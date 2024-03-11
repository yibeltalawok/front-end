export default [
    {
      path: "bundle",
      component: () => import("./Bundle"),
      children: [
        
        {
          path: "bundles",
          name: "bundles-list",
          component: () => import("./BundleList")
        },
  
      ],
    },
  ];
  