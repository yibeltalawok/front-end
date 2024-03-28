
<template>
  <v-app>
    <v-breadcrumbs :items="camps">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>

    <v-container grid-list-xs>
      <v-layout row justify-center align-center>
        <v-flex xs12 sm12 md4 lg4 pa-2>
          <v-card outlined height="100%">
            <v-card-text>
              <v-layout clomun wrap justify-center>
                <v-flex xs12 sm12 md11 lg11 pa-1>
                  <b>Employee Name:</b>
                  {{item.employee.fullName}}
                </v-flex>
                <v-flex xs12 sm12 md11 lg11 pa-1>
                  <b>Id no:</b>
                  {{item.employee.idno}}
                </v-flex>
                <v-flex xs12 sm12 md11 lg11 pa-1>
                  <b>Sex:</b>
                  {{item.employee.gender}}
                </v-flex>
                <v-flex xs12 sm12 md11 lg11 pa-1>
                  <b>DOJ:</b>
                  {{ new Date(item.employee.joiningDate).toLocaleDateString("en-US") }}
                </v-flex>
                <v-flex xs12 md11 lg11 pa-1>
                  <b>EXP(DD-MM-YY):</b>
                  {{exp}}
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 sm12 md4 lg4 pa-2>
          <v-card outlined height="100%">
            <v-card-text>
              <v-layout row wrap justify-center>
                <v-flex xs12 md11 lg11 pa-1>
                  <b>Salary:</b>
                  {{ item.employee.salary }}
                </v-flex>
                <v-flex xs12 md11 lg11 pa-1>
                  <b>Department:</b>
                  {{ item.employee.department }}
                </v-flex>
                <v-flex xs12 md11 lg11 pa-1>
                  <b>Sub Dept:</b>
                  {{ item.employee.subDept }}
                </v-flex>
                <v-flex xs12 md11 lg11 pa-1>
                  <b>Resp Allow:</b>
                  {{ item.responseAllow }}
                </v-flex>
                <v-flex xs12 md11 lg11 pa-1>
                  <b>Iron Incentive:</b>
                  {{ item.responseAllow }}
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 sm12 md4 lg4 pa-2>
          <v-card outlined height="100%">
            <v-card-text>
              <v-layout row wrap justify-center>
                <v-flex xs12 md11 lg11 pa-1>
                  <b>Home Allow:</b>
                  {{ item.homeAllow }}
                </v-flex>
                <v-flex xs12 md11 lg11 pa-1>
                  <b>Absent incentive:</b>
                  {{ item.absentIncentive }}
                </v-flex>
                <v-flex xs12 md11 lg11 pa-1>
                  <b>Transport pay:</b>
                  {{ item.transportPay }}
                </v-flex>
                <v-flex xs12 md11 lg11 pa-1>
                  <b>Cost Sharing:</b>
                  {{ item.costSharing }}%
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs12 sm12 md4 lg4 pa-2>
          <v-btn
            outlined
            block
            rounded
            color="primary"
            class="text-capitalize"
            @click="
              $router.push({
                name: 'update-master',
                params: { driverId: item.id },
              })
            "
          >
            <v-icon class="mx-2">edit</v-icon>Edit this information
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import { api, path } from "@/api";
//import QrcodeVue from "qrcode.vue";
export default {
  name: "Salary Master",
  data() {
    return {
      resourceName: "Salary Master",
      filter: { include: ["employee"] },
      resource: api,
      path: path.master,
      masterId: "",
      item: {},
      size: 200,
      exp: "",
      camps: [
        {
          text: "Dashboard",
          disabled: false,
          to: "dasboard"
        },
        {
          text: "Salary",
          disabled: true
        },
        {
          text: "Master",
          disabled: false,
          to: "/app/master/list"
        },
        {
          text: "Click here",
          disabled: true
        },
        {
          text: "Slary Master Detail",
          disabled: true
        }
      ]
    };
  },
  async created() {
    const { masterId } = this.$route.params;
    this.item = await api.get(masterId, path.master, this.filter);
    this.masterId = masterId;
    this.calculateExp();
  },
  methods: {
    calculateExp() {
      // ===================Joining Date===================================
      let jod = new Date(this.item.employee.joiningDate);
      let jd = jod.getDate();
      let jm = jod.getMonth() + 1;
      let jy = jod.getFullYear();
      // ===================Current Date===================================
      let date = new Date();
      let cd = date.getDate();
      let cm = date.getMonth() + 1;
      let cy = date.getFullYear();
      let m, y, d;
      y = cy - jy;
      if (cm >= jm) m = cm - jm;
      else {
        y--;
        m = 12 + cm - jm;
      }

      if (cd >= jd) d = cd - jd;
      else {
        m--;
        d = 31 + cd - jd;

        if (m < 0) {
          m = 11;
          y--;
        }
      }
      this.exp = d + "-" + m + "-" + y;
    }
  }
};
</script>