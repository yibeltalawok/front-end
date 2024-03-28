export default [
  {
    path: "permon",
    component: () => import("./PerMon"),
    children: [
      {
        path: "jobs-list",
        name: "job-list",
        component: () => import('@/modules/permon/jobs/jobsList'),
      },
      {
        path: "performance/list",
        name: "permon",
        component: () => import("./performance/PerformanceList"),
      },
      {
        path: "performance/calc",
        name: "calc-performance",
        component: () => import("./performance/PerformanceCalc"),
      },
      {
        path: "performance/iotlist",
        name: "iotlist",
        component: () => import("./iot/iotlist"),
      },
      {
        path: "efficiency/list",
        name: "efficiency",
        component: () => import("./efficiency/EfficiencyList"),
      },
      {
        path: "performance/summary",
        name: "performance-summary",
        component: () => import("./performance/PerformanceSummary")
      }
    ],
  },
];
