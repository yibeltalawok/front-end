<template>
  <div class="mainclass">
    <v-layout style="margin: 10px; display: flex" justify-space-around>
      <div class="smallCard" style="width: 180px">
        <div class="colview">
          <div class="tittle">{{ statData[0] }}</div>
          <div class="subtitle">Employees</div>
        </div>
        <div class="trailingicon">
          <employee />
        </div>
      </div>

      <div class="smallCard" style="width: 230px">
        <div class="colview">
          <div class="tittle">{{ statData[1] }}%</div>
          <div class="subtitle">Labour productivity</div>
        </div>
        <div class="trailingicon">
          <productivity />
        </div>
      </div>

      <div class="smallCard" style="width: 180px">
        <div class="colview">
          <div class="tittle">{{ statData[2] }}</div>
          <div class="subtitle">Customers</div>
        </div>
        <div class="trailingicon">
          <customer />
        </div>
      </div>

      <div class="smallCard" style="width: 180px">
        <div class="colview">
          <div class="tittle">{{ statData[3] }}</div>
          <div class="subtitle">Suppliers</div>
        </div>
        <div class="trailingicon">
          <supplier />
        </div>
      </div>
    </v-layout>

    <v-layout row justify-center>
      <div>
        <div class="attendancelosttime">
          <linechart />
        </div>
        <div class="losttimeChart">
          <lostTimeChart />
        </div>
      </div>

      <div class="performanceChart">
        <performanceYearly />
      </div>
    </v-layout>

    <v-layout row justify-space-around style="margin-top: 30px">
      <div class="smallCard" style="width: 300px">
        <div class="circularBar">
          <v-progress-circular
            :value="statData[4]"
            color="amber"
            style="width: 40px; height: 50px"
          >
            <h3>%</h3>
          </v-progress-circular>
        </div>
        <div class="colview">
          <div class="tittle">{{ statData[4] }}%</div>
          <div class="subtitle">Avarage Performance</div>
        </div>
        <div class="trailingicon">
          <bulb />
        </div>
      </div>
    </v-layout>
  </div>
</template>

<script>
import employee from "@/assets/icons/employeeBage.svg";
import customer from "@/assets/icons/customer.svg";
import productivity from "@/assets/icons/productivity.svg";
import supplier from "@/assets/icons/supplier.svg";

import { mapState, mapActions } from "vuex";
import linechart from "./linechartview";
import lostTimeChart from "./lostTimeChart";
import performanceYearly from "./PerformanceYearly";

export default {
  components: {
    employee,
    customer,
    productivity,
    supplier,
    linechart,
    performanceYearly,
    lostTimeChart,
  },
  mounted() {
    this.loadstatData();
  },
  computed: {
    ...mapState("employeeDashboard", ["statData"]),
  },

  methods: {
    attendanceDateClicked() {
      // eslint-disable-next-line no-console
      // console.log("Attendance clicked");
    },
    ...mapActions("employeeDashboard", ["getstatData"]),

    async loadstatData() {
      await this.getstatData();
      //eslint-disable-next-line no-console
      //console.log(data);
    },
  },
  data() {
    return {
      datePickerLostTime: false,
    };
  },
};
</script>

<style scoped>
.mainrow {
  display: flex;
  margin-right: 30px;
}
.circularBar {
  flex: 2;
}
.smallCard {
  width: 270px;
  height: 60px;
  margin: 10px;
  margin-right: 20px;
  padding: 10px;
  padding-left: 30px;
  padding-right: 20px;
  border-radius: 20px;
  display: flex;
  border: outset 0.5px;
}

/* .smallCard:hover {
  width: 270px;
  height: 95px;
  margin: 10px;
  margin-right: 20px;
  padding: 10px;
  padding-left: 30px;
  padding-right: 20px;
  border-radius: 20px;
  display: flex;
  background-color: #f7e7c3;
  box-shadow: 2px 4px 10px 0px #ddd6c5;
} */
.colview {
  display: flex;
  flex: 5;
  flex-direction: column;
}
.tittle {
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
  font-size: 20px;
  font-weight: bold;
  color: grey;
}
.subtitle {
  font-family: "Courier New", Courier, monospace;
  font-size: 10px;
  font-weight: lighter;
  color: grey;
}
.trailingicon {
  width: 25px;
  height: 25px;
  margin: auto;
}

/* .smallCard:hover .tittle {
  font-size: 40px;
}

.smallCard:hover .trailingicon {
  width: 45px;
  height: 45px;
  margin: auto;
} */

.losttimeChart {
  padding: 1%;
  height: 300px;
  width: 600px;
  margin-top: 5%;
  border-radius: 10px;
  border: outset 0.5px;
}

.attendancelosttime {
  display: flex;
  flex-direction: column;
}

.performanceChart {
  height: 420px;
  width: 600px;
  margin-top: 10px;
  margin-left: 50px;
  border-radius: 10px;
  border: outset 0.5px;
}

/* transform: scale(1.1);
.performanceChart:hover {
  height: 430px;
  width: 630px;
  margin-left: 50px;
  border-radius: 10px;
  border: rgb(223, 216, 216) solid 1px;
  background-color: white;
  box-shadow: 2px 4px 10px 0px #e7e0d0;
} */
/* .losttimeChart:hover,
.attendancelosttime:hover,
.performanceChart:hover {
  margin-top: 1%;
  transform: scale(1.05);
} */
</style>