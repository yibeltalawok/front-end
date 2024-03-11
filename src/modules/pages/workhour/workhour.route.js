import WorkhourList from "./list/WorkhourList";
import WorkhourCreate from "./new/WorkhourCreate";
import WorkhourUpdate from "./update/WorkhourUpdate";

export default [
  {
    path: "workhour/list",
    name: "workhour-list",
    component: WorkhourList,
  },
  {
    path: "workhour/new",
    name: "workhour-create",
    component: WorkhourCreate,
  },
  {
    path: "workhour/:workhourId/update",
    name: "workhour-update",
    component: WorkhourUpdate,
  },
];
