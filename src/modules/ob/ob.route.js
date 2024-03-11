export default [
  {
    path: "ob",
    component: () => import("./OB"),
    children: [
      {
        path: "style",
        name: "ob",
        component: () => import("./style/StyleList"),
      },
      {
        path: "style/:styleId/detail",
        name: "style-detail",
        component: () => import("./style/StyleDetail"),
      },
      {
        path: "operation/:styleId/list",
        name: "operation-list",
        component: () => import("./operation/OperationList"),
      },
      {
        path: "operation/:styleId/create",
        name: "create-operation",
        component: () => import("./operation/CreateOperation"),
      },
      {
        path: "Operation/:operationId/:styleId/update",
        name: "update-operation",
        component: () => import("./operation/UpdateOperation"),
      },
      {
        path: "operation/:styleId/summary",
        name: "opr-summary",
        component: () => import("./Summary"),
      },
    ],
  },
];
