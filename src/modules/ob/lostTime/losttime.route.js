export default [
  {
    path: "lost-time",
    component: () => import("./LostTime"),
    children: [
      {
        path: "list",
        name: "lost-time",
        component: () => import("./LostTimeList"),
      },
    ],
  },
];
