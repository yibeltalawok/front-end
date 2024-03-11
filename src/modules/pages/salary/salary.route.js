export default [
    //=================Salary Master Components==================== 
    { 
    path: "salary",
    component: () => import("./payrolAndSalary"),
    children: [ 
    {
        path: "master/list",
        name: "master-list",
        component: () => import("@/modules/pages/salary/master/MasterList"),
    },
    {
        path: "master/create",
        name: "create-master",
        component: () => import("@/modules/pages/salary/master/CreateMaster"),
    },
    {
        path: "master/:masterId/update",
        name: "update-master",
        component: () => import("@/modules/pages/salary/master/UpdateMaster"),
    },
    {
        path: "master/:masterId/info",
        name: "master-info",
        component: () => import("@/modules/pages/salary/master/MasterInfo"),
    },
    // ===================Tax Slab Components==================================    
    {
        path: "tax/salb/list",
        name: "tax-slab-list",
        component: () => import("@/modules/pages/salary/tax/TaxSlabList"),
    },
    {
        path: "tax/salb/create",
        name: "create-tax-slab",
        component: () => import("@/modules/pages/salary/tax/CreateTaxSlab"),
    },
    {
        path: "tax/salb/:slabId/update",
        name: "update-tax-slab",
        component: () => import("@/modules/pages/salary/tax/UpdateTaxSlab"),
    },
    //=====================Payroll master Components===============================   
    {
        path: "payroll/master/create",
        name: "create-payroll-master",
        component: () => import("@/modules/pages/salary/payroll/CreatePayrollMaster"),
    },
    {
        path: "payroll/master/list",
        name: "payroll-master-list",
        component: () => import("@/modules/pages/salary/payroll/PayrollMasterList"),
    },
    {
        path: "payroll/master/:payrollId/update",
        name: "update-payroll-master",
        component: () => import("@/modules/pages/salary/payroll/UpdatePayrollMaster"),
    },
    {
        path: "payroll/master/:payrollId/info",
        name: "payroll-master-info",
        component: () => import("@/modules/pages/salary/payroll/PayrollMasterInfo"),
    },
    //=============Over Time Components=============================================    
    {
        path: "over-time/:overtimeId/update",
        name: "update-over-time",
        component: () => import("@/modules/pages/salary/payroll/overtime/UpdateOverTime"),
    },
    {
        path: "over-time/:payrollId/list",
        name: "over-time-list",
        component: () => import("@/modules/pages/salary/payroll/overtime/OverTimeList"),
    },
    {
        path: "over-time/:payrollId/create",
        name: "create-over-time",
        component: () => import("@/modules/pages/salary/payroll/overtime/CreateOverTime"),
    },

    {
        path: "over-time/group",
        name: "overtime-group",
        component: () => import("@/modules/pages/salary/payroll/overtime/OvertimeForGroup"),
    },
    // ================Attendance==========================================================
    {
        path: "attendance/:employeeId/list",
        name: "attendance-list",
        component: () => import("@/modules/pages/salary/payroll/attendance/AttendanceList"),
    },
    {
        path: "attendance/settlement",
        name: "attendance-settlement",
        component: () => import("@/modules/pages/salary/payroll/attendance/AttendanceSettlement"),
    },
    // ================Salary Sheet==========================================================

    {
        path: "summary/sheet",
        name: "summary-sheet",
        component: () => import("@/modules/pages/salary/payroll/summary-sheet/SummarySheet"),
    },
    {
        path: "salry/sleep",
        name: "salary-sleep",
        component: () => import("@/modules/pages/salary/payroll/summary-sheet/SalarySleep"),
    },
    {
        path: "finance/copy",
        name: "finance-copy",
        component: () => import("@/modules/pages/salary/payroll/summary-sheet/FinanceCopy"),
    },
    {
        path: "payroll/calculation",
        name: "payroll-calculation",
        component: () => import("@/modules/pages/salary/payroll/summary-sheet/PayrollCalculation"),
    },

]
    }
]
