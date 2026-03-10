import { supabaseAdmin } from "../stripe.js";

export async function findUserByCustomerId(customerId) {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (error) console.error("findUserByCustomerId error:", error.message);
  return data?.id ?? null;
}

export async function activateSubscription({ userId, customerId, priceId, locationCount }) {
  console.log("Updating user:", userId);

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      subscription_status: "active",
      stripe_customer_id: customerId,
      plan_id: priceId,
      location_count: locationCount,
    })
    .eq("id", userId);

  if (error) console.error("activateSubscription error:", error.message);
  else console.log("✅ Subscription activated for user:", userId);
}

export async function cancelSubscription(customerId) {
  const userId = await findUserByCustomerId(customerId);
  if (!userId) {
    console.error("cancelSubscription: could not find user for customer:", customerId);
    return;
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      subscription_status: "canceled",
      plan_id: null,
      location_count: 0,
    })
    .eq("id", userId);

  if (error) console.error("cancelSubscription error:", error.message);
  else console.log("⚠️ Subscription canceled for user:", userId);
}