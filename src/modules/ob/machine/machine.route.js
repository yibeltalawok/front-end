export default [
  {
    path: "machine",
    component: () => import("./Machine"),
    children: [
      {
        path: "list",
        name: "machine",
        component: () => import("./MachineList"),
      },
      {
        path: "create",
        name: "create-machine",
        component: () => import("./CreateMachine"),
      },
      {
        path: ":machineId/update",
        name: "update-machine",
        component: () => import("./UpdateMachine"),
      },
      {
        path: ":machineId/detail",
        name: "machine-detail",
        component: () => import("./MachineDetail"),
      },
    ],
  },
];
