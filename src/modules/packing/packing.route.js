export default [
  {
    path: 'packedIn',
    name: 'packedIn',
    component: () => import("./packedInList.vue")
  },
  {
    path: "packing",
    component: () => import("./Packing"),
    children: [
      {
        path: "list",
        name: "packing",
        component: () => import("./packingList/PackingList"),
      },
      {
        path: "create",
        component: () => import("./packingList/CreatePackingList"),
        children: [
          {
            path: "type/one",
            name: "create-packList",
            component: () => import("./packingList/types/TypeOne"),
          },
          {
            path: "type/two",
            name: "packListTwo",
            component: () => import("./packingList/types/TypeTwo"),
          },
          {
            path: "type/three",
            name: "packListThree",
            component: () => import("./packingList/types/TypeThree"),
          },
          {
            path: "type/four",
            name: "packListFour",
            component: () => import("./packingList/types/TypeFour"),
          },
        ],
      },
      {
        path: "details",
        component: () => import("./packingList/CreatePackingList"),
        children: [
          {
            path: ":packingId/one-detail",
            name: "type-one-detail",
            component: () => import("./packingList/types-detail/TypeOneDetail"),
          },
          {
            path: ":packingId/two-detail",
            name: "type-two-detail",
            component: () => import("./packingList/types-detail/TypeTwoDetail"),
          },
          {
            path: ":packingId/three-detail",
            name: "type-three-detail",
            component: () =>
              import("./packingList/types-detail/TypeThreeDetail"),
          },
          {
            path: ":packingId/four-detail",
            name: "type-four-detail",
            component: () =>
              import("./packingList/types-detail/TypeFourDetail"),
          },
        ],
      },
    ],
  },
];
