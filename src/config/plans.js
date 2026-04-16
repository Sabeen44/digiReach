export const PRICE_IDS = {
  starter:    "price_1T6bbyRQXSCaZY9hN9GPW82Y",
  growth:     "price_1T6bd1RQXSCaZY9hys0f1mH9",
  enterprise: "price_1T6bdWRQXSCaZY9hc63mn7aw",
};

export const PLAN_LABELS = {
  [PRICE_IDS.starter]:    "Starter",
  [PRICE_IDS.growth]:     "Growth",
  [PRICE_IDS.enterprise]: "Enterprise",
};

export const PLAN_LOCATION_LIMITS = {
  [PRICE_IDS.starter]:    1,
  [PRICE_IDS.growth]:     5,
  [PRICE_IDS.enterprise]: Infinity,
};

export const PLAN_LIST = [
  {
    id:          "starter",
    priceId:     PRICE_IDS.starter,
    name:        "Starter",
    price:       "$10",
    per:         "per month",
    description: "Perfect for small businesses getting started with digital signage.",
    features: [
      "1 screen location",
      "Upload your own creatives",
      "Real-time scheduling",
      "Email support",
    ],
  },
  {
    id:          "growth",
    priceId:     PRICE_IDS.growth,
    name:        "Growth",
    price:       "$20",
    per:         "per month",
    description: "Ideal for growing networks and multi-location setups.",
    features: [
      "Up to 5 screen locations",
      "Upload your own creatives",
      "Real-time scheduling",
      "Analytics dashboard",
      "Priority support",
    ],
    featured: true,
  },
  {
    id:          "enterprise",
    priceId:     PRICE_IDS.enterprise,
    name:        "Enterprise",
    price:       "$30",
    per:         "per month",
    description: "For large networks that need scale and flexibility.",
    features: [
      "10+ screen locations",
      "Upload your own creatives",
      "Real-time scheduling",
      "Advanced analytics",
      "Dedicated account manager",
    ],
  },
];
