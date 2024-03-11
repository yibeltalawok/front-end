export default [
  {
    path: "files",
    component: () => import("./FileManager"),
    children: [
      {
        path: "print/template",
        name: "template",
        component: () => import("./contents/templateDashboard.vue"),
      },
      {
        path: "print/production/template",
        name: "production-template",
        component: () => import("./contents/Template.vue"),
      },
      {
        path: "Production/qrcode",
        name: "prod-qrcode",
        component: () => import("./contents/ProductionQrCode"),
      },
      {
        path: "production/:amountDone/new",
        name: "production-new",
        component: () => import("./contents/NewProduction"),
      },
      {
        path: "json",
        name: "json",
        component: () => import("./contents/JSONFile"),
      },
      {
        path: 'order/status/json',
        name: 'order-status-json',
        component: () => import("./contents/OrderStatusJson")
      },
      {
        path: "order/status/scanned/json",
        name: "order-status-scanned",
        component: () => import('./contents/OrderStatusScannedJson')
      }
    ],
  },
];
