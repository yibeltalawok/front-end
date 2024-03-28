
<template>
  <div>
    <canvas :width="width" :height="height" :id="id"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";
import { api, path } from "@/api";
export default {
  data() {
    return {
      filter: { include: ["userRole"] }
    };
  },
  props: [
    "id",
    "width",
    "height",
    "type",
    "title",
    "labels",
    "data",
    "fill",
    "backgroundColor",
    "borderColor",
    "borderWidth"
  ],
  async mounted() {
    let employees = (await api.all(path.employee, this.filter)).rows;
    let userRoles = employees.map(r => r.userRole.name);

    let objs = userRoles.reduce((acc, val) => {
      acc[val] = acc[val] === undefined ? 1 : (acc[val] += 1);
      return acc;
    }, {});
    let keyNames = Object.keys(objs);
    let values = Object.values(objs);
    let roles = [];
    roles = keyNames;

    var ctx = document.getElementById(this.id).getContext("2d");
    new Chart(ctx, {
      type: this.type ? this.type : "pie",
      // type: this.type ? this.type : "bar",
      data: {
        labels: roles,
        datasets: [
          {
            label: this.title,
            data: values,
            fill: this.fill,
            backgroundColor: [
              "#ff6384",
              "#36a2eb",
              "#cc65fe",
              "#ffce56",
              "#ff6384",
              "#36a2eb",
              "#cc65fe"
            ],
            borderColor: this.borderColor,
            borderWidth: this.borderWidth ? this.borderWidth : 1
          }
        ]
      }
    });
  }
};
</script>