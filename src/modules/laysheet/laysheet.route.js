export default [
  {
    path: "laysheet",
    component: () => import("./Laysheet"),
    children: [
      {
        path: "list",
        name: "laysheet-list",
        component: () => import("./LaysheetList"),
      },
      {
        path: "bcsheet",
        name: "bcsheet",
        component: () => import("./BCSheet"),
      },
      {
        path: "create",
        name: "laysheet",
        component: () => import("./CreateLaysheet"),
      },
      {
        path: "bundle/qrcode",
        name: "qrcode",
        component: () => import("./QRCode"),
      },
      {
        path: "laysheet/:laysheetId/detail",
        name: "laysheet-detail",
        component: () => import("./LaysheetDetail"),
      },
      {
        path: "laysheet/:laysheetId/update",
        name: "update-laysheet",
        component: () => import('./UpdateLaysheet')
      },
      {
        path: "status/qrcode",
        name: "status-qrcode",
        component: () => import("./OrderStatusQrCode"),
      }
    ],
  },
];
