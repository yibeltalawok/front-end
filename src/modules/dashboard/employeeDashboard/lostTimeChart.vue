<template>
  <div class="mainDiv">
    <div class="lostTimeChartLeftDiv">
      <h4 class="card-title">
        <strong>Total Lost time </strong>
      </h4>
      <v-card flat v-if="totalLostTime" class="leftDivStatus">
        <h3>{{ this.totalLostTime }}</h3>
        <label>Lost Time</label>
      </v-card>
    </div>
    <div class="lostTimeChartRightDiv">
      <v-container>
        <v-row>
          <v-col cols="12" sm="6"></v-col>
          <v-col cols="12" sm="5">
            <v-autocomplete
              class="lineLostTime"
              dense
              :items="['1','2','3','4','5','6','7', '8','9']"
              label="Line"
              v-model="selectedLine"
              @change="reloadLostTimeChart()"
          ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="1">
            <dateIcon class="dateIcon" @click="datePickerLostTime = true" />
            <v-row justify="center">
              <v-dialog v-model="datePickerLostTime" persistent max-width="290">
                <v-date-picker color="amber" v-model="dateLosttime" range>
                  <v-spacer />
                  <v-btn
                    text
                    color="green"
                    @click="(datePickerLostTime = false), reloadLostTimeChart()"
                    >Ok</v-btn
                  ></v-date-picker
                >
              </v-dialog>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
      <barChartView class="barChartView" />
    </div>
  </div>
</template>

<script>
import dateIcon from "@/assets/icons/date_icon.svg";
import barChartView from "../../ob/lostTime/barchartView";
import { mapActions, mapState } from "vuex";

export default {
  computed: {
    ...mapState("losttime", ["LostTimeSummaryData"]),
  },

  created() {
    this.reloadLostTimeChart();
  },
  methods: {
    ...mapActions("losttime", ["fetchLostTimeWithDateFilter"]),

    async reloadLostTimeChart() {
      await this.fetchLostTimeWithDateFilter({date: this.dateLosttime,line: this.selectedLine }).then(() => {
        this.totalLostTime =
          this.LostTimeSummaryData.datasets[0].data[0] +
          this.LostTimeSummaryData.datasets[1].data[0] +
          this.LostTimeSummaryData.datasets[2].data[0] +
          this.LostTimeSummaryData.datasets[3].data[0];
      });
    },
  },

  data() {
    return {
      dateLosttime: [
        new Date().toISOString().substr(0, 10),
        new Date().toISOString().substr(0, 10),
      ],
      selectedLine:'',
      datePickerLostTime: false,
      totalLostTime: 0,
    };
  },
  components: {
    dateIcon,
    barChartView,
  },
};
</script>

<style scoped>
.mainDiv {
  display: flex;
}
.lostTimeChartLeftDiv {
  width: 25%;
  height: 245px;
  margin-top: 1%;
}

.leftDivStatus {
  height: 80px;
  padding: 10%;
  margin-top: 50%;
  margin-left: -5%;
  border-radius: 20px;
}

.leftDivStatus h3 {
  margin-left: 35%;
  font-size: 35px;
  margin-top: -20%;
  color: rgb(139, 75, 75);
}
.leftDivStatus label {
  margin-left: 25%;
  font-family: cursive;
}
.card-title {
  margin-left: 10px;
  color: rgb(124, 123, 123);
}
.lostTimeChartRightDiv {
  width: 70%;
  height: 280px;
}
.dateIcon {
  width: 20px;
  height: 20px;
  margin-top: -80%;
  margin-left: -80%;
}

.lineLostTime{
  margin-top: -5%;
}

.dateIcon:hover {
  transform: scale(1.25);
}
.barChartView {
  margin-top: -30px;
}
</style>