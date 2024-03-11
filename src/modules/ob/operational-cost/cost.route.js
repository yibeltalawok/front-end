export default [
  {
    path: "op-cost",
    component: () => import("./OpCost"),
    children: [
      {
        path: "list",
        name: "operational-cost-list",
        component: () => import("./cost/OperationalCostList"),
      },
      {
        path: "entry",
        name: "operational-cost-entry",
        component: () => import("./cost/CostEntry"),
      },
      {
        path: "summary",
        name: "operational-cost-summary",
        component: () => import("./cost/CostSummary"),
      },
      {
        path: "SAM",
        name: "cost-per-sam",
        component: () => import("./costPerSam/CostPerSAM"),
      },
      {
        path: "history",
        name: "cost-per-sam-history",
        component: () => import("./costPerSam/CostPerSAMHistory"),
      },
    ],
  },
];
