import express from "express";
import { stripe, supabaseAdmin } from "./stripe.js";
import { PLAN_LOCATIONS } from "./config/plans.js";
import {
  findUserByCustomerId,
  activateSubscription,
  cancelSubscription,
} from "./services/subscriptionService.js";

const router = express.Router();

console.log("CLIENT_URL:", process.env.CLIENT_URL);

// ── Webhook ───────────────────────────────────────────────────────────────────
router.post("/webhook", async (req, res) => {
  console.log("✅ Webhook route hit");
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("🔔 Webhook event:", event.type);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const customerId = session.customer;

      console.log("Webhook metadata userId:", session.metadata?.userId);
      console.log("Full session metadata:", session.metadata);

      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const priceId = lineItems.data[0]?.price?.id;
      const locationCount = PLAN_LOCATIONS[priceId] ?? 0;

      console.log("priceId:", priceId, "locationCount:", locationCount);

      let userId = session.metadata?.userId;
      if (!userId) userId = await findUserByCustomerId(customerId);

      if (!userId) {
        console.error("❌ Could not find userId for session:", session.id);
        break;
      }

      console.log("📝 Calling activateSubscription for userId:", userId);
      await activateSubscription({ userId, customerId, priceId, locationCount });
      console.log("✅ activateSubscription complete");
      break;
    }

    case "customer.subscription.deleted": {
      const customerId = event.data.object.customer;
      await cancelSubscription(customerId);
      break;
    }

   case "customer.subscription.updated": {
  const subscription = event.data.object;
  const customerId = subscription.customer;
  const newPriceId = subscription.items.data[0]?.price?.id;

  await supabaseAdmin
    .from("profiles")
    .update({ plan_id: newPriceId })
    .eq("stripe_customer_id", customerId);

  break;
}
  }

  res.json({ received: true });
});

// ── Checkout ──────────────────────────────────────────────────────────────────
router.post("/create-checkout-session", async (req, res) => {
  console.log("✅ Checkout route hit, body:", req.body);
  const { priceId, userId } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
      metadata: { userId }, // ✅ userId correctly passed
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── Upgrade ───────────────────────────────────────────────────────────────────
router.post("/upgrade-plan", async (req, res) => {
  const { newPriceId, customerId } = req.body;

 console.log("upgrade-plan hit, customerId:", customerId);  // ← add
  console.log("newPriceId:", newPriceId);                    // ← add


  try {
    // Get existing subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

     console.log("subscriptions found:", subscriptions.data.length); // ← add

    const subscription = subscriptions.data[0];

    if (subscription) {

      console.log("updating subscription:", subscription.id); // ← add
      console.log("subscriptions found:", subscriptions.data.length);
console.log("subscription object:", subscriptions.data[0]); // ← add
console.log("subscription id:", subscriptions.data[0]?.id); // ← add
console.log("subscriptions found:", subscriptions.data.length);
console.log("full subscriptions:", JSON.stringify(subscriptions.data)); // ← add


      // Update existing subscription — cancels old plan automatically
      await stripe.subscriptions.update(subscription.id, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId,
        }],
        proration_behavior: "create_prorations", // charges/credits difference
      });

      res.json({ success: true });
    } else {
      // No existing subscription — create new checkout
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: newPriceId, quantity: 1 }],
        success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/dashboard`,
        metadata: { customerId },
      });
      res.json({ url: session.url });
    }
  } catch (err) {
    console.error("Stripe upgrade error:", err.message); // ← change to err.message
  console.error("Full error:", err); // ← add
    console.error("Stripe upgrade error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── Billing Portal ────────────────────────────────────────────────────────────
router.post("/create-portal-session", async (req, res) => {
  const { customerId } = req.body;
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.CLIENT_URL}/dashboard`,
    });
    res.json({ url: portalSession.url });
  } catch (err) {
    console.error("Stripe portal error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── Retrieve Session ──────────────────────────────────────────────────────────
router.get("/session/:id", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id);
    res.json(session);
  } catch (err) {
    console.error("Stripe session retrieval error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── Verify Session (debug) ────────────────────────────────────────────────────
// Usage: GET /api/stripe/verify-session?session_id=cs_test_xxx
router.get("/verify-session", async (req, res) => {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: "session_id required" });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const lineItems = await stripe.checkout.sessions.listLineItems(session_id);

    console.log("🔍 Session status:", session.status);
    console.log("🔍 Session metadata:", session.metadata);
    console.log("🔍 Line items:", lineItems.data);

    res.json({
      status: session.status,
      metadata: session.metadata,         // ✅ check userId is here
      customerId: session.customer,
      priceId: lineItems.data[0]?.price?.id,
      locationCount: PLAN_LOCATIONS[lineItems.data[0]?.price?.id] ?? 0,
    });
  } catch (err) {
    console.error("Verify session error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;