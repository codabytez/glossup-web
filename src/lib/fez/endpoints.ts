export const FEZ_ENDPOINTS = {
  auth: {
    path: "/user/authenticate",
  },
  changePassword: {
    path: "/user/changePassword",
    queryKey: ["fez", "change-password"],
  },

  // ── Orders ──────────────────────────────────────────────────────────────────
  orders: {
    path: "/orders", // GET /orders/{orderId}
    queryKey: ["fez", "orders"],
  },
  createOrder: {
    path: "/order", // POST — body is array of order objects
    queryKey: ["fez", "create-order"],
  },
  updateOrder: {
    path: "/order", // PUT — body is array of order objects with orderNo
    queryKey: ["fez", "update-order"],
  },
  cancelOrder: {
    path: "/order/cancel",
    queryKey: ["fez", "cancel-order"],
  },
  searchOrders: {
    path: "/orders/search",
    queryKey: ["fez", "search-orders"],
  },
  trackOrder: {
    path: "/order/track", // GET /order/track/{orderNumber}
    queryKey: ["fez", "track-order"],
  },
  manifestUrl: {
    path: "/orders", // GET /orders/{orderNo}/manifest-url
    queryKey: ["fez", "manifest"],
  },
  statsWithDateRange: {
    path: "/orders/statsWithDateRange",
    queryKey: ["fez", "stats-with-date-range"],
  },

  // ── Delivery ─────────────────────────────────────────────────────────────
  deliveryCost: {
    path: "/order/cost",
    queryKey: ["fez", "delivery-cost"],
  },
  deliveryTimeEstimate: {
    path: "/delivery-time-estimate",
    queryKey: ["fez", "delivery-time-estimate"],
  },
  states: {
    path: "/states",
    queryKey: ["fez", "states"],
  },
} as const;
