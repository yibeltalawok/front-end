export default [
  {
    path: "user",
    component: () => import("./User"),
    children: [
      {
        path: "user/list",
        name: "user",
        component: () => import("./UserList"),
      },
      {
        path: "user/new",
        name: "user-create",
        component: () => import("./CreateAccount"),
      },
      {
        path: "user/:userId/edit",
        name: "user-update",
        component: () => import("./EditAccount"),
      },
      {
        path: "my/profile",
        name: "my-profile",
        component: () => import("./MyProfile"),
      }
    ],
  },
];
