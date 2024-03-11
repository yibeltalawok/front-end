export default [
  {
    path: "contact-us",
    component: () => import("@/modules/contactUs/Contact"),
    children: [
      {
        path: "create-message",
        name: "contact-us",
        component: () => import("@/modules/contactUs/ContactUs"),
      },
      {
        path: "list",
        name: "contact-us-list",
        component: () => import("@/modules/contactUs/ContactUsList"),
      },
    ],
  },
];
