
import SAMList from "./sam/list/SAMList";
import RegisterSAM from "./sam/new/RegisterSAM";
import SAMInfo from "./sam/info/SAMInfo";
import UpdateSAM from "./sam/update/UpdateSAM";

import salaryRoute from "@/modules/pages/salary/salary.route";

export default [
  {
    path: "sam/list",
    name: "sam-list",
    component: SAMList,
  },
  {
    path: "sam/new",
    name: "register-sam",
    component: RegisterSAM,
  },
  {
    path: "sam/:samId/update",
    name: "update-sam",
    component: UpdateSAM,
  },
  {
    path: "sam/:samId/info",
    name: "sam-info",
    component: SAMInfo,
  },

  ...salaryRoute,

  // no data
  {
    path: "no-data/:route/:component",
    name: "no-data",
    component: () => import("@/modules/pages/NoData"),
  },
  {
    path: "Exp/attendance",
    name: "exp-calc",
    component: () => import("@/modules/ExpCulculator"),
  },
];
