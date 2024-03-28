import IncentiveList from "@/modules/incentive/list/IncentiveList";
import IncentiveInfo from "@/modules/incentive/info/IncentiveInfo";
import CompanyAndEmployee from "@/modules/incentive/percent/CompanyAndEmployee";
import LineAndOperator from "@/modules/incentive/percent/LineAndOperator";
import SlabeList from "@/modules/incentive/slabe/SlabeList";
import CreateSlabe from "@/modules/incentive/slabe/CreateSlabe";
import SlabeUpdate from "@/modules/incentive/slabe/SlabeUpdate";
import Weightage from "@/modules/incentive/Weightage";

export default [
  {
    path: "incentive",
    component: () => import("./Incentive"),
    children: [
      {
        path: "incentive/list",
        name: "incentive-list",
        component: IncentiveList,
      },
      {
        path: "incentive/:incentiveId/info",
        name: "incentive-info",
        component: IncentiveInfo,
      },
      {
        path: "incentive/line-percent",
        name: "incentive-line",
        component: LineAndOperator,
      },
      {
        path: 'new/incentive',
        name: 'create-incentive',
        component: () => import('./new/CreateIncentive')
      },
      {
        path: "incentive/Company-percent",
        name: "incentive-company",
        component: CompanyAndEmployee,
      },

      {
        path: "incentive/slabe-list",
        name: "slabe-list",
        component: SlabeList,
      },
      {
        path: "incentive/create-slabe",
        name: "create-slabe",
        component: CreateSlabe,
      },
      {
        path: "incentive:slabeId/updtae-slabe",
        name: "update-slabe",
        component: SlabeUpdate,
      },
      {
        path: "incentive/weightage",
        name: "weightage",
        component: Weightage,
      },
      {
        path: "incentive/share",
        name: "incentive-share-list",
        component: () => import('./list/IncentiveShareList')
      },
      {
        path: 'incentive/:item/summary',
        name: 'incentive-summary',
        component: () => import("@/modules/incentive/summary/IncentiveSummary")
      }, {
        path: 'incentive/summary/list',
        name: 'incentive-summary-list',
        component: () => import("@/modules/incentive/summary/SummaryList")
      }
    ],
  },
];
