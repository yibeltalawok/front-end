const menusData = [
    //                                                                     //Ordering              //yibeltal comment
    // {
    //     title: "cop",
    //     allowedRoles: ["admin", "cutting-department"],
    //     links: [
    //         {
    //             title: "order",
    //             route: "order",
    //             icon: "order",
    //             allowedRoles: ["admin", "cutting-department"],
    //         },
    //     ]
    // },
    //                                                                            //cutting room            //yibeltal
    // {
    //     title: "cutting-room-module",
    //     allowedRoles: ["admin", "cutting-department"],
    //     links: [

    //         {
    //             title: "laysheet",
    //             route: "laysheet-list",
    //             icon: "laysheet",
    //             allowedRoles: ["admin", "cutting-department"],
    //         },
    //         {
    //             title: "bundles",
    //             route: "bundles-list",
    //             icon: "bundles",
    //             allowedRoles: ["admin", "cutting-department"],
    //         },
    //     ],
    // },

    // quality
    {
        title: "human_resource",
        allowedRoles: ["admin"],
        links: [
            {
                title: "employee",
                route: "hr",
                icon: "employee",
                allowedRoles: ["admin"],
            },

            {
                title: "payrol",
                route: "payroll-master-list",
                icon: "summary",
                allowedRoles: ["admin"],
            },
            {
                title: "working_hour",
                route: "workhour-list",
                icon: "working_hour",
                allowedRoles: ["admin"],
            },
            {
                title: "attendance-settlement-table",
                route: "attendance-settlement",
                icon: "attendance-settlement-table",
                allowedRoles: ["admin"],
            },
            {
                title: "overtime",
                route: "overtime-group",
                icon: "overtime-log",
                allowedRoles: ["admin"],
            },
            {
                title: "incentive-summary",
                route: "incentive-list",
                icon: "incentive-summary",
                allowedRoles: ["admin"],
            },
            {
                title: "tax-slab",
                route: "tax-slab-list",
                icon: "tax-slab",
                allowedRoles: ["admin"],
            },
            {
                title: "op_cost",
                route: "operational-cost-list",
                icon: "op_cost",
                allowedRoles: ["admin"],
            },
        ],
    },
    {
        title: "permon",
        allowedRoles: ["admin"],
        links: [
            {
                title: "jobs",
                route: "job-list",
                icon: "summary",
                allowedRoles: ["admin"],
            },
            {
                title: "performance-monitoring",
                route: "permon",
                icon: "performance-monitoring",
                allowedRoles: ["admin"],
            },

            {
                title: "efficiency",
                route: "efficiency",
                icon: "efficiency",
                allowedRoles: ["admin"],
            },
            {
                title: "iot-registration",
                route: "iotlist",
                icon: "people",
                allowedRoles: ["admin"],
            },
            // {
            //     title: "production-qr",
            //     route: "prod-qrcode",
            //     icon: "production-qr",
            //     allowedRoles: ["admin"],
            // },

            {
                title: "oprationHistory",
                route: "opration-history",
                icon: "oprationHistory",
                allowedRoles: ["admin"],
            },
        ],
    },
    // {
    //     title: "quality",
    //     allowedRoles: ["admin", "qc", "qa"],
    //     links: [

    //     ],
    // },
//                                                                          //yibeltal comment
    // {
    //     title: "ob",
    //     allowedRoles: ["admin"],
    //     links: [
    //         {
    //             title: "ob",
    //             route: "ob",
    //             icon: "ob",
    //             allowedRoles: ["admin"],
    //         },

    //         {
    //             title: "machineDB",
    //             route: "machine",
    //             icon: "machineDB",
    //             allowedRoles: ["admin"],
    //         },
    //         {
    //             title: "lost_time1",
    //             route: "lost-time",
    //             icon: "lost_time1",
    //             allowedRoles: ["admin"],
    //         },
    //     ],
    // },


    //                                                                  // not my comment
    // {
    //     title: "packing",
    //     allowedRoles: ["admin"],
    //     links: [
    //         {
    //             title: "packing_list",
    //             route: "packing",
    //             icon: "packing_list",
    //             allowedRoles: ["admin"],
    //         },
    //         {
    //             title: "packing_in",
    //             route: "packedIn",
    //             icon: "packing_in",
    //             allowedRoles: ["admin"],
    //         },
    //     ],
    // },
    {
        title: "inventory",
        allowedRoles: ["Inventory", "admin"],
        links: [
            {
                title: "customer",
                route: "customer-list",
                icon: "people",
                allowedRoles: ["Inventory", "admin"],
            },
            {
                title: "product",
                route: "product-list",
                icon: "product",
                allowedRoles: ["Inventory", "admin"],
            },
            {
                title: "supplier",
                route: "suplier-list",
                icon: "supplier",
                allowedRoles: ["Inventory", "admin"],
            },

            {
                title: "category",
                route: "category-list",
                icon: "category",
                allowedRoles: ["Inventory", "admin"],
            },
            {
                title: "inventory",
                route: "inventory",
                icon: "inventory",
                allowedRoles: ["Inventory", "admin"],
            },
            {
                title: "purchased",
                route: "purchased-list",
                icon: "purchased",
                allowedRoles: ["Inventory", "admin"],
            },
            {
                title: "issue",
                route: "issue-list",
                icon: "issue",
                allowedRoles: ["Inventory", "admin"],
            },
        ],
    },
    {
        title: "user",
        allowedRoles: ["admin"],
        links: [
            {
                title: "users and role",
                route: "user",
                icon: "user",
                allowedRoles: ["admin"],
            }
        ],
    },
    //                                                                          //yibeltal comment
    // {
    //     title: "file",
    //     allowedRoles: ["admin"],
    //     links: [
    //         {
    //             title: "template",
    //             route: "template",
    //             icon: "template",
    //             allowedRoles: ["admin"],
    //         },

    //         {
    //             title: "json",
    //             route: "json",
    //             icon: "json",
    //             allowedRoles: ["admin"],
    //         },
    //     ],
    // },

]
export { menusData }