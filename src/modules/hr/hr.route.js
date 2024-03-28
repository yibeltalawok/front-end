export default [
  {
    path: "hr",
    component: () => import("./HR"),
    children: [
      {
        path: "employees",
        name: "hr",
        component: () => import("./employee/EmployeeList"),
      },
      {
        path: "employee/create",
        name: "create-emploayee",
        component: () => import("./employee/CreateEmployee"),
      },
      {
        path: "employee/qrcode",
        name: "employee-qrcode",
        component: () => import("./employee/QRCode"),
      },
      {
        path: "employee/:employeeId/detail",
        name: "employee-detail",
        component: () => import("./employee/EmployeeDetail"),
      },
      {
        path: "employee/:employeeId/update",
        name: "update-employee",
        component: () => import("./employee/UpdateEmployee"),
      },
      {
        path: "attendance/create",
        name: "attendance",
        component: () => import("./employee/attendance/CreateAttendance"),
      },
    ],
  },
];
