export default [
    {
      path: "modulesList",
      component: () => import("@/modules/quality/quality"),
      children: [
        {
          path: ":styleId/details",
          name: "moduleDetails",
          component: () => import("@/modules/quality/moduleDetailsView"),
        },
        {
          path: "/qualityDashboard",
          name: "qualitydashboard",
          component: () => import("@/modules/quality/qualityDashboard"),
        },

      ],
    },
  ];
  