export default [
  {
    path: "history",
    component: () => import("./History"),
    children: [
      {
        path: "",
        name: "opration-history",
        component: () => import("./OperationHistory")
      },
    ]
  }
];
