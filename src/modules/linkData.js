const menusData = [
    {
        title: "employee_module",
        allowedRoles: ["admin"],
        links: [
            {
                title: "employeeList",
                route: "hr",
                icon: "employee",
                allowedRoles: ["admin"],
            },
            {
                title: "addEmployee",
                route: "create-emploayee",
                icon: "employee",
                allowedRoles: ["admin"],
            },
           ]
        },
        {
            title: "payrol_module",
            allowedRoles: ["admin"],
            links: [
                {
                    title: "payrolList",
                    route: "payroll-master-list",
                    icon: "summary",
                    allowedRoles: ["admin"],
                },
                {
                    title: "createPayrol",
                    route: "payroll-master-list",
                    icon: "summary",
                    allowedRoles: ["admin"],
                },
               ]
            },
            {
                title: "working_hour_module",
                allowedRoles: ["admin"],
                links: [
                    {
                        title: "add-WH",
                        route: "workhour-list",
                        icon: "working_hour",
                        allowedRoles: ["admin"],
                    },
                    {
                        title: "Add working hour",
                        route: "workhour-create",
                        icon: "summary",
                        allowedRoles: ["admin"],
                    },
                   ]
                },
                {
                    title: "attendance_module",
                    allowedRoles: ["admin"],
                    links: [
                        {
                            title: "attendance",
                            route: "attendance-settlement",
                            icon: "attendance-settlement-table",
                            allowedRoles: ["admin"],
                        },
                        {
                            title: "takeAttendance",
                            route: "job-list",
                            icon: "attendance-settlement-table",
                            allowedRoles: ["admin"],
                        },
                        {
                            title: "All Attendance",
                            route: "attendance-list",
                            icon: "attendance-settlement-table",
                            allowedRoles: ["admin"],
                        },
                       ]
                    },
                    {
                        title: "overtime_module",
                        allowedRoles: ["admin"],
                        links: [
                            {
                                title: "overtime",
                                route: "overtime-group",
                                icon: "overtime-log",
                                allowedRoles: ["admin"],
                            },
                            {
                                title: "addOvertime",
                                route: "overtime-group",
                                icon: "overtime-log",
                                allowedRoles: ["admin"],
                            },
                           ]
                        },
                        {
                            title: "isModule",
                            allowedRoles: ["admin"],
                            links: [
                                {
                                    title: "incentive-summary",
                                    route: "incentive-list",
                                    icon: "incentive-summary",
                                    allowedRoles: ["admin"],
                                },
                                {
                                    title: "addIncentive",
                                    route: "create-incentive",
                                    icon: "incentive-summary",
                                    allowedRoles: ["admin"],
                                },
                               ]
                            },
                            {
                                title: "taxModule",
                                allowedRoles: ["admin"],
                                links: [
                                    {
                                        title: "tax-slab",
                                        route: "tax-slab-list",
                                        icon: "tax-slab",
                                        allowedRoles: ["admin"],
                                    },
                                    {
                                        title: "addTax",
                                        route: "create-tax-slab",
                                        icon: "tax-slab",
                                        allowedRoles: ["admin"],
                                    },
                                   ]
                                },  
                                {
                                    title: "costModule",
                                    allowedRoles: ["admin"],
                                    links: [

                                        {
                                            title: "op_cost",
                                            route: "operational-cost-list",
                                            icon: "op_cost",
                                            allowedRoles: ["admin"],
                                        },

                                        {
                                            title: "costEntry",
                                            route: "operational-cost-entry",
                                            icon: "op_cost",
                                            allowedRoles: ["admin"],
                                        },
                                       ]
                                    }, 
 {
        title: "customer-module",
        allowedRoles: ["Inventory", "admin"],
        links: [
            {
                title: "customerList",
                route: "customer-list",
                icon: "people",
                allowedRoles: ["Inventory", "admin"],
            },
            {
                title: "addCustomer",
                route: "create-customer",
                icon: "people",
                allowedRoles: ["Inventory", "admin"],
            },
    ]
},
{
    title: "inventory-module",
    allowedRoles: ["Inventory", "admin"],
    links: [

        {
            title: "inventoryList",
            route: "inventory",
            icon: "inventory",
            allowedRoles: ["Inventory", "admin"],
        },
        {
            title: "addInventory",
            route: "inventory-creation",
            icon: "inventory",
            allowedRoles: ["Inventory", "admin"],
        },
        {
            title: "categoryList",
            route: "category-list",
            icon: "category",
            allowedRoles: ["Inventory", "admin"],
        },
        {
            title: "addCategory",
            route: "create-category",
            icon: "category",
            allowedRoles: ["Inventory", "admin"],
        },
    ],
},
{
    title: "product-module",
    allowedRoles: ["Inventory", "admin"],
    links: [
        {
            title: "productList",
            route: "product-list",
            icon: "product",
            allowedRoles: ["Inventory", "admin"],
        },
        {
            title: "addProduct",
            route: "create-product",
            icon: "product",
            allowedRoles: ["Inventory", "admin"],
        },
]
},
{
    title: "supplier-module",
    allowedRoles: ["Inventory", "admin"],
    links: [
        {
            title: "supplierList",
            route: "suplier-list",
            icon: "supplier",
            allowedRoles: ["Inventory", "admin"],
        },
        {
            title: "addSupplier",
            route: "create-suplier",
            icon: "supplier",
            allowedRoles: ["Inventory", "admin"],
        },
]
},
{
    title: "purchased-module",
    allowedRoles: ["Inventory", "admin"],
    links: [
        {
            title: "purchasedList",
            route: "purchased-list",
            icon: "purchased",
            allowedRoles: ["Inventory", "admin"],
        },
        {
            title: "addPurchased",
            route: "create-purchased",
            icon: "purchased",
            allowedRoles: ["Inventory", "admin"],
        },
        {
            title: "issueList",
            route: "issue-list",
            icon: "issue",
            allowedRoles: ["Inventory", "admin"],
        },
        {
            title: "addIssue",
            route: "create-issue",
            icon: "issue",
            allowedRoles: ["Inventory", "admin"],
        },
]
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

//     {
//         title: "permon",
//         allowedRoles: ["admin"],
//         links: [
//             {
//                 title: "jobs",
//                 route: "job-list",
//                 icon: "summary",
//                 allowedRoles: ["admin"],
//             },
//             {
//                 title: "performance-monitoring",
//                 route: "permon",
//                 icon: "performance-monitoring",
//                 allowedRoles: ["admin"],
//             },

//             {
//                 title: "efficiency",
//                 route: "efficiency",
//                 icon: "efficiency",
//                 allowedRoles: ["admin"],
//             },
//             {
//                 title: "iot-registration",
//                 route: "iotlist",
//                 icon: "people",
//                 allowedRoles: ["admin"],
//             },

//             {
//                 title: "oprationHistory",
//                 route: "opration-history",
//                 icon: "oprationHistory",
//                 allowedRoles: ["admin"],
//             },
//         ],
//     },
 ]
export { menusData }