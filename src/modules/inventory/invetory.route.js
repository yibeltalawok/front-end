export default [
    {
        path: "inventory/",
        component: () => import("./Inventory"),
        children: [
            {
                path: "list",
                name: "inventory",
                component: () => import('./inventory/InventoryList'),
            },
            {
                path: "new",
                name: "inventory-creation",
                component: () => import('./inventory/CreateInventory')
            },

            {
                path: ":inventoryId/update",
                name: "update-inventory",
                component: () => import('./inventory/UpdateInventory')
            },
            {
                path: "category",
                name: "category-list",
                component: () => import('./category/CategoryList')
            },
            {
                path: "category",
                name: "create-category",
                component: () => import('./category/CreateCategory')
            },
            {
                path: "update/:categoryId/category",
                name: "update-category",
                component: () => import('./category/UpdateCategory')
            },
            {
                path: "customer/list",
                name: "customer-list",
                component: () => import('./customer/CustomerList')
            },
            // {
            //     path: "customer/list",
            //     name: "customer-list",
            //     component: () => import('./customer/CustomerList')
            // },
            {
                path: "create/customer",
                name: "create-customer",
                component: () => import('./customer/CreateCustomer')
            },
            {
                path: "update:customerId/customer",
                name: "update-customer",
                component: () => import('./customer/UpdateCustomer')
            },
            {
                path: "create/:inventoryId/item",
                name: "create-item",
                component: () => import('./item/CreateItem')
            },
            {
                path: "item/:inventoryId/list",
                name: "item-list",
                component: () => import('./item/ItemList')
            },
            {
                path: "update/:inventoryId/:itemId/item",
                name: "update-item",
                component: () => import('./item/UpdateItem')
            },
            {
                path: "item/:inventoryId/:itemId/detail",
                name: "detail-item",
                component: () => import('./item/ItemDetail')
            },
            {
                path: "create/purchased",
                name: "create-purchased",
                component: () => import('./purchased/CreatePurchased')
            },
            {
                path: "purchased/list",
                name: "purchased-list",
                component: () => import('./purchased/PurchasedList')
            }, {
                path: "update:purchasedId/purchased",
                name: "update-purchased",
                component: () => import('./purchased/UpdatePurchased')
            },
            {
                path: "issue/list",
                name: "issue-list",
                component: () => import('./issue/IssueList')
            },
            {
                path: "create/issue",
                name: "create-issue",
                component: () => import('./issue/CreateIssue')
            },
            {
                path: "update/:issueId/issue",
                name: "update-issue",
                component: () => import('./issue/UpdateIssue')
            },
            {
                path: "issue/:issueId/detail",
                name: "issue-detail",
                component: () => import('./issue/IssueDetail')
            },


            {
                path: "create/product",
                name: "create-product",
                component: () => import('./product/createProduct')
            },
            {
                path: "product/list",
                name: "product-list",
                component: () => import('./product/productList')
            },
            {
                path: "update/product",
                name: "update-product",
                component: () => import('./product/updateProduct')
            },
            {
                path: "detail/product",
                name: "product-detail",
                component: () => import('./product/productDetail')
            },



            {
                path: "create/suplier",
                name: "create-suplier",
                component: () => import('./suplier/createSuplier')
            },
            {
                path: "suplier/list",
                name: "suplier-list",
                component: () => import('./suplier/suplierList')
            },
            {
                path: "update/suplier",
                name: "update-suplier",
                component: () => import('./suplier/updateSuplier')
            },
            {
                path: "detail/suplier",
                name: "suplier-detail",
                component: () => import('./suplier/suplierDetail')
            },




        ],
    },
];