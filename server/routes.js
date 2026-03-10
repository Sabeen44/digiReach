import express from "express";
import { stripe } from "./stripe.js";
import { PLAN_LOCATIONS } from "./config/plans.js";
import {
  findUserByCustomerId,
  activateSubscription,
  cancelSubscription,
} from "../services/subscriptionService.js";

const router = express.Router();

// ── Webhook ───────────────────────────────────────────────────────────────────
// NOTE: This route must be registered with raw body parser in app.js
// before express.json() middleware

router.post("/webhook", async (req, res) => {
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

        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        const priceId = lineItems.data[0]?.price?.id;
        const locationCount = PLAN_LOCATIONS[priceId] ?? 0;

        let userId = session.metadata?.userId;
        if (!userId) userId = await findUserByCustomerId(customerId);

        if (!userId) {
          console.error("❌ Could not find userId for session:", session.id);
          break;
        }

        await activateSubscription({ userId, customerId, priceId, locationCount });
        break;
      }

      case "customer.subscription.deleted": {
        const customerId = event.data.object.customer;
        await cancelSubscription(customerId);
        break;
      }
    }

    res.json({ received: true });
});

// ── Checkout ──────────────────────────────────────────────────────────────────

router.post("/create-checkout-session", async (req, res) => {
  const { priceId, userId } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
      metadata: { userId },
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
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: newPriceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard`,
      metadata: { customerId },
    });
    res.json({ url: session.url });
  } catch (err) {
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

export default router;