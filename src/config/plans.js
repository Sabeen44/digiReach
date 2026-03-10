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
  [PRICE_IDS.enterprise]: 10,
};

export const PLAN_LIST = [
  { label: "Starter",    price: "$29/mo",  locations: "1 location",   id: PRICE_IDS.starter },
  { label: "Growth",     price: "$79/mo",  locations: "5 locations",  id: PRICE_IDS.growth },
  { label: "Enterprise", price: "Custom",  locations: "10 locations", id: PRICE_IDS.enterprise },
];