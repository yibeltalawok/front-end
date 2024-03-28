import Login from "@/modules/users/Login";
import Dashboard from "@/modules/dashboard/Dashboard";
import employeeDashboard from "@/modules/dashboard/employeeDashboard/employeeDashboard";
import companyDashboard from "@/modules/dashboard/companyDashboard/companyDashboard";
import AppLayout from "@/modules/layout/AppLayout";
import userRoute from "../modules/users/user.route";
import pagesRoute from "../modules/pages/pages.route";
import roleRoute from "../modules/role/role.route";
import workhourRoute from "../modules/pages/workhour/workhour.route";
import incentiveRoute from "../modules/incentive/incentive.route";
import orderRoute from "../modules/orders/order.route";
import fileRoute from "../modules/fileManagement/file.route";
import obRoute from "../modules/ob/ob.route";
import quality from "../modules/quality/quality.route";
import machineRoute from "../modules/ob/machine/machine.route";
import historyRoute from "../modules/ob/history/history.route";
import hrRoute from "../modules/hr/hr.route";
import laysheetRoute from "../modules/laysheet/laysheet.route";
import losttimeRoute from "../modules/ob/lostTime/losttime.route";
import packingRoute from "../modules/packing/packing.route";
import costRoute from "../modules/ob/operational-cost/cost.route";
import permonRoute from "../modules/permon/permon.route";
import contactUsRoute from "../modules/contactUs/contactUs.route";
import Inventory from '../modules/inventory/invetory.route';
import BundleRoute from '../modules/bundle/bundle.route';
import simulation from "@/modules/dashboard/simulation";

const routes = [
  {
    path: "/",
    redirect: "/app",
  },
  {
    path: "/app",
    component: AppLayout,
    redirect: "/app/companyDashboard",
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: Dashboard,
      },
      {
        path: "employeedashboard",
        name: "employeedashboard",
        component: employeeDashboard,
      },
      {
        path: "companyDashboard",
        name: "companyDashboard",
        component: companyDashboard,
      },
      {
        path: "simulation",
        name: "simulation",
        component: simulation,
      },
      ...userRoute,
      ...pagesRoute,
      ...roleRoute,
      ...orderRoute,
      ...obRoute,
      ...machineRoute,
      ...historyRoute,
      ...hrRoute,
      ...losttimeRoute,
      ...packingRoute,
      ...permonRoute,
      ...workhourRoute,
      ...laysheetRoute,
      ...fileRoute,
      ...incentiveRoute,
      ...orderRoute,
      ...quality,
      ...packingRoute,
      ...costRoute,
      ...contactUsRoute,
      ...Inventory,
      ...BundleRoute

    ],
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },


  {
    path: "*",
    redirect: "/app",
  },
];

export default routes;
