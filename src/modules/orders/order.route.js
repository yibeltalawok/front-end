export default [
  {
    path: "orders/",
    component: () => import("@/modules/orders/Order"),
    children: [
      {
        path: "list",
        name: "order",
        component: () => import("@/modules/orders/list/OrderList"),
      },
      {
        path: ":orderId/info",
        name: "order-info",
        component: () => import("@/modules/orders/info/OrderInfo"),
      },
      {
        path: ":orderId/update",
        name: "update-order",
        component: () => import("@/modules/orders/update/UpdateOrder"),
      },
      {
        path: "create",
        name: "create-order",
        component: () => import("@/modules/orders/OrderCreation"),
      },
      {
        path: "production/report",
        name: "production-report",
        component: () => import("@/modules/orders/ProductionReport")
      },
      {
        path: "reconciliation",
        name: "order-rec",
        component: () => import("./reconciliation/OrderRecList"),
      },
      {
        path: "reconciliation/create",
        name: "create-order-rec",
        component: () => import("./reconciliation/CreateOrderRec"),
      },
      {
        path: "reconciliation/:recId/detail",
        name: "order-rec-detail",
        component: () => import("./reconciliation/OrderRecDetail"),
      },
      {
        path: "reconciliation/:recId/update",
        name: "update-order-rec",
        component: () => import("./reconciliation/UpdateOrderRec"),
      },
      {
        path: "TNA",
        name: "tna",
        component: () => import("./tna/TNAList"),
      },
      {
        path: "TNA/create",
        name: "create-tna",
        component: () => import("./tna/CreateTNA"),
      },
      {
        path: "TNA/:tnaId/update",
        name: "update-tna",
        component: () => import("./tna/UpdateTNA"),
      },
      {
        path: "TNA/:tnaId/detail",
        name: "tna-detail",
        component: () => import("./tna/Gantt"),
      },
      {
        path: "status:orderId/list",
        name: "status-list",
        component: () => import("./status/list/StatusList"),
      },
      {
        path: ":orderId/status/list",
        name: "status-list",
        component: () => import("@/modules/orders/status/list/StatusList"),
      },
      {
        path: ":stusId/status/info",
        name: "status-info",
        component: () => import("@/modules/orders/status/info/StatusInfo"),
      },
      {
        path: ":stusId/status/update",
        name: "update-status",
        component: () => import("@/modules/orders/status/update/UpdateStatus"),
      },
      {
        path: ":orderId/status/create",
        name: "create-status",
        component: () => import("@/modules/orders/status/new/CreateStatus"),
      },

    ],
  },
];
