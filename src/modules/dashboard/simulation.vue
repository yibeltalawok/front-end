<template>
  <div class="mainclass">    
    <div class="mainchartrows">
        <div class="attendancelosttime">
            <div class="attendanceChart">
                <v-layout row justify-space-between>
                    <h4 class="card-title">Performance Average : <strong v-if="performanceDataAverage.type !== Nan">{{performanceDataAverage}}</strong> <strong v-else>No Data, yet</strong></h4>
                </v-layout>
                        <div
          class="cardPerformace"
          v-for="list in performanceData"
          :key="list.employeeid"
        >
          <img :src="list.employeeProfilePicture" alt="" />
          <div>
            <label>{{ list.employeeName }}</label
            ><br />
            <label style="font-size: x-small">{{ list.department }}</label>
          </div>
          <v-spacer />
          <p>{{ list.employeeGender }}</p>

          <v-spacer />
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
                <p v-bind="attrs" v-on="on">{{ list.sam }}</p>
            </template>
            <span>SAM</span>
          </v-tooltip>

          <v-spacer />
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <p v-bind="attrs" v-on="on">{{ list.amountDone }}</p>
            </template>
            <span>Amount Done</span>
          </v-tooltip>

          <v-spacer />
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <p v-bind="attrs" v-on="on">{{ list.efficiency }}</p>
            </template>
            <span>Efficiency</span>
          </v-tooltip>

          <v-spacer />
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <p v-bind="attrs" v-on="on">{{ list.lotTime }}</p>
            </template>
            <span>Lost Time</span>
          </v-tooltip>

          <v-spacer />
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <p v-bind="attrs" v-on="on">{{ list.performance }}</p>
            </template>
            <span>Performance</span>
          </v-tooltip>

          <v-spacer />
        </div>
            </div>
        </div>

         <div>
            <div class="recentordersContainer1">
                <v-layout row justify-space-between style="margin-bottom: 10px">
                <h4 class="card-title">Production</h4>
                </v-layout>

                <v-layout column justify-space-between>
                <!-- Use v-for when retrieving real data. -->
                    <v-flex row xs12 sm12 md12 lg12>
                        <div class="statusCardPerformace" cols="5">
                            <div>
                                <p class="statuses" style="margin-top: 10px">Cut In</p>
                            </div>
                            <v-spacer />
                            <p>{{bunddleHistorySimulation.ci}}</p>
                        </div>

                        <div class="spacer" cols="1"></div>

                        <div class="statusCardPerformace" cols="5" style="margint-left: 2%">
                            <div>
                                <p class="statuses" style="margin-top: 10px">Cut Out</p>
                            </div>
                            <v-spacer />
                            <p>{{bunddleHistorySimulation.co}}</p>
                        </div>
                    </v-flex>
                    <v-flex row xs12 sm12 md12 lg12>
                        <div class="statusCardPerformace" cols="5">
                            <div>
                                <p class="statuses" style="margin-top: 10px">Sew In</p>
                            </div>
                            <v-spacer />
                            <p>{{bunddleHistorySimulation.si}}</p>
                        </div>

                        <div class="spacer" cols="1"></div>

                        <div class="statusCardPerformace" cols="5" style="margint-left: 2%">
                            <div>
                                <p class="statuses" style="margin-top: 10px">Sew Out</p>
                            </div>
                            <v-spacer />
                            <p>{{bunddleHistorySimulation.so}}</p>
                        </div>
                    </v-flex>
                    <v-flex row xs12 sm12 md12 lg12>
                        <div class="statusCardPerformace" cols="5">
                            <div>
                                <p class="statuses" style="margin-top: 10px">Finishing In</p>
                            </div>
                            <v-spacer />
                            <p>{{bunddleHistorySimulation.fi}}</p>
                        </div>

                        <div class="spacer" cols="1"></div>

                        <div class="statusCardPerformace" cols="5" style="margint-left: 2%">
                            <div>
                                <p class="statuses" style="margin-top: 10px">Finishing Out</p>
                            </div>
                            <v-spacer />
                            <p>{{bunddleHistorySimulation.fo}}</p>
                        </div>
                    </v-flex>
                    <v-flex row xs12 sm12 md12 lg12>
                        <div class="statusCardPerformace" cols="5">
                            <div>
                                <p class="statuses" style="margin-top: 10px">Packing In</p>
                            </div>
                            <v-spacer />
                            <p>{{bunddleHistorySimulation.pi}}</p>
                        </div>

                        <div class="spacer" cols="1"></div>

                        <div class="statusCardPerformace" cols="5" style="margint-left: 2%">
                            <div>
                                <p class="statuses" style="margin-top: 10px">Packing Out</p>
                            </div>
                            <v-spacer />
                            <p>{{bunddleHistorySimulation.po}}</p>
                        </div>
                    </v-flex>
                </v-layout>
            </div>
            <div class="recentordersContainer2">
                <v-layout row justify-space-between style="margin-bottom: 10px">
                <h4 class="card-title">Notifications</h4>
                </v-layout>
                
                <v-layout column justify-space-between v-for=" list in notificationList" :key="list">
                <!-- Use v-for when retrieving real data. -->
                        <div class="statusCardPerformace2">
                          <strong><label class="statusesNtoification" style="margin-top: 10px">{{list.title}}</label></strong>
                          <br>
                          <label class="notifcationDescription">{{list.description}}</label>
                        </div>
                </v-layout>
            </div>
        </div>
    </div>

    <div class="mainchartrows">
        <div class="favProductsContainer">
            <v-layout row justify-space-between style="margin-top: 2%; margin-left: 2%">
            <h4 class="card-title">Line Efficiency Average : <strong v-if="efficiencyAverage.type !== Nan">{{efficiencyAverage}}</strong> <strong v-else>No Data, yet</strong></h4>
            </v-layout>

            <v-layout column justify-space-between>
                <!-- Use v-for when retrieving real data. -->
                <v-flex xs12 sm10 md10 lg10>
                    <div
                        class="cardPerformace"
                        v-for="list in efficiencyData"
                        :key="list.line"
                      >
                        <div>
                          <span>{{ ("0" + list.line).slice(-2) }}</span>
                        </div>
                        <v-spacer />                    
                        
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                              <p v-bind="attrs" v-on="on">{{ list.totalad }}</p>
                          </template>
                          <span>Total amount done</span>
                        </v-tooltip>
                        <v-spacer />
            
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                              <p v-bind="attrs" v-on="on">{{ list.totalwhr }}</p>
                          </template>
                          <span>Working Hour</span>
                        </v-tooltip>
                        <v-spacer />
                        
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                              <p v-bind="attrs" v-on="on">{{ list.totalsam }}</p>
                          </template>
                          <span>SAM</span>
                        </v-tooltip>
                        <v-spacer />
                        
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                              <p v-bind="attrs" v-on="on">{{ list.efficiency.toFixed(2) }}</p>
                          </template>
                          <span>Efficiency</span>
                        </v-tooltip>
                        <v-spacer />
                    </div>
                </v-flex>
            </v-layout>
        </div>
        <div class="favProductsContainer">
            <v-layout row justify-space-between style="margin-top: 2%; margin-left: 2%">
              <h4 class="card-title">Line</h4>
            </v-layout>

            <v-row justify-space-between class="lineSimulation">
                <!-- Use v-for when retrieving real data. -->
                <v-col class="linenumber" cols="2">
                  01
                </v-col>

                <v-col class="emps" cols="10">
                  <v-row class="firstLineRow">
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards" style="background: red">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards" style="background: red">
                    </v-col>
                  </v-row>
                  <v-row class="secondLineRow">
                    <v-col cols="1" class="empCards" style="background: red">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards" style="background: red">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards" style="background: red">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                  </v-row>
                </v-col>
            </v-row>
            <v-row justify-space-between class="lineSimulation">
                <!-- Use v-for when retrieving real data. -->
                <v-col class="linenumber" cols="2">
                  02
                </v-col>

                <v-col class="emps" cols="10">
                  <v-row class="firstLineRow">
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards" style="background: red">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                  </v-row>
                  <v-row class="secondLineRow">
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                  </v-row>
                </v-col>
            </v-row>
            <v-row justify-space-between class="lineSimulation">
                <!-- Use v-for when retrieving real data. -->
                <v-col class="linenumber" cols="2">
                  03
                </v-col>

                <v-col class="emps" cols="10">
                  <v-row class="firstLineRow">
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                  </v-row>
                  <v-row class="secondLineRow">
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards" style="background: red">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards" style="background: red">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                  </v-row>
                </v-col>
            </v-row>
            <v-row justify-space-between class="lineSimulation">
                <!-- Use v-for when retrieving real data. -->
                <v-col class="linenumber" cols="2">
                  04
                </v-col>

                <v-col class="emps" cols="10">
                  <v-row class="firstLineRow">
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards" style="background: red">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                  </v-row>
                  <v-row class="secondLineRow">
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards" style="background: red">
                    </v-col>
                  </v-row>
                </v-col>
            </v-row>
            <v-row justify-space-between class="lineSimulation">
                <!-- Use v-for when retrieving real data. -->
                <v-col class="linenumber" cols="2">
                  05
                </v-col>

                <v-col class="emps" cols="10">
                  <v-row class="firstLineRow">
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards" style="background: red">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards" style="background: red">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                  </v-row>
                  <v-row class="secondLineRow">
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards" style="background: red">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                    <v-col cols="1" class="empCards">
                    </v-col>
                  </v-row>
                </v-col>
            </v-row>
        </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { mapState, mapActions } from "vuex";

export default {
  data(){
    return{
      performanceDataAverage: 0,
      efficiencyAverage: 0,
    }
  },
  computed: {
    ...mapState("simulation", ["performanceData", "performanceDataAverage","bunddleHistorySimulation","efficiencyAverage", "efficiencyData","notificationList"]),
  },
  methods: {
    ...mapActions("simulation", ["getLoadPerformanceData", "getbunddleHistorySimulation", "getEfficiencyDatas", "getNotificationList"]),
  },
  created(){
    this.getLoadPerformanceData();
    this.getbunddleHistorySimulation();
    this.getEfficiencyDatas();
    this.getNotificationList()
  },
};
</script>

<style scoped>
.lineSimulation{
  margin-top: 6%;
  height: 100px;
  overflow-x: auto;
  /* border-bottom: 1px solid rgb(218, 213, 213); */
  border: rgb(223, 216, 216) solid 1px;
  border-radius: 10px;
}
.empCards{
  background: green;
  height: 30px;
  margin-right: 1%;
}
.firstLineRow{
  margin-top: 0.1px;
}
.secondLineRow{
  padding-top: 20px;
}
.linenumber{
  margin-top: 3%;
  font-size: 35px;
  color: #fdae19;
}
.mainchartrows {
  display: flex;
  width: 95%;
  margin-left: 30px;
}
.singleProduct {
  /* width: 37vw; */
  border-bottom: 1px solid rgb(218, 213, 213);
  padding: 10px;
  margin-top: 30px;
}
.singleProduct .tittle {
  font-weight: bold;
  font-size: 18px;
}
.singleProduct .subtittle {
  font-weight: medium;
  font-size: 15px;
  margin-right: 20px;
}
.productionList {
  width: 600px;
  height: 420px;
  padding: 20px;
  border: outset 0.5px;
  margin: 10px;
  margin-left: 50px;
  border-radius: 10px;
}
.recentordersContainer1 {
  width: 600px;
  height: 300px;
  padding: 20px;
  border: outset 0.5px;
  margin: 10px;
  /* margin-left: 50px; */
  border-radius: 10px;
}
.recentordersContainer2 {
  width: 600px;
  height: 300px;
  padding: 20px;
  border: outset 0.5px;
  margin: 10px;
  /* margin-left: 50px; */
  border-radius: 10px;
}
.favProductsContainer {
    height:600px;
  width: 600px;
  /* margin-left: 2.5%; */
  margin: 10px;
  padding: 20px;
  border-radius: 10px;
  border: rgb(223, 216, 216) solid 1px;
  border: outset 0.5px;
  float: left;
  overflow-y: auto;

}
.card-title {
  margin-left: 10px;
  color: rgb(138, 136, 136);
}
.performance-trailing {
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 20px;
  font-size: 30px;
  color: #f0bd46;
  font-weight: bold;
}
.performance-title {
  margin-left: 20px;
  margin-top: auto;
  margin-bottom: auto;
}
.profilepic-cover {
  width: 90px;
  height: 90px;
  margin-left: 20px;
  margin-top: auto;
  margin-bottom: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 4px solid #f0bd46;
  border-radius: 100px;
}
.profilepic {
  width: 78px;
  height: 78px;
  border: 2px solid #ffda82;
  border-radius: 100px;
  overflow: hidden;
}
.profilepic img {
  object-fit: cover;
  width: 78px;
  height: 78px;
}
.dataview {
  /* background-color: thistle; */
  margin-top: 5%;
  width: 100%;
  height: 365px;
}
.chartview {
  /* background-color: tomato; */
  /* width: 30%; */
  height: 100px;
}
.performancedataview {
  border: 1px solid rgb(236, 230, 230);
  border-radius: 10px;
  box-shadow: 2px 4px 10px 0px #f1f0ec;
  width: 100%;
  height: 13vh;
  margin-top: 10px;
  margin-left: 3px;
}
.performancechartview {
  /* background-color: rgb(235, 228, 227); */
  width: 100%;

  height: 420px;
  margin-left: 50px;
  margin: 10px;
  padding: 20px;
  border-radius: 10px;
  border: rgb(223, 216, 216) solid 1px;
  border: outset 0.5px;
  
}
.icons {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
.icons:hover {
  width: 22px;
  height: 22px;
  margin-right: 10px;
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
  border: rgb(223, 216, 216) solid 1px;
  border: outset 0.5px;
}
.nodata {
  width: 200px;
  height: 100px;
  margin: auto;
  animation: shake 4.2s cubic-bezier(0.36, 0.07, 0.19, 0.97) both infinite;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}
.nd {
  height: 150px;
  margin-top: 20%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

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
  width: 40px;
  height: 40px;
  margin: auto;
}
/* .smallCard:hover .tittle {
    font-size: 40px;
} */
.smallCard:hover .trailingicon {
  width: 45px;
  height: 45px;
  margin: auto;
}
.losttimeChart {
  height: 200px;
  width: 600px;
  margin-left: 50px;
  margin: 10px;
  border-radius: 10px;
  border: rgb(223, 216, 216) solid 1px;
  border: outset 0.5px;
}
.performanceChart {
  height: 230px;
  width: 100px;
  margin: 10px;
  padding: 20px;
  border-radius: 10px;
  border: rgb(223, 216, 216) solid 1px;
  border: outset 0.5px;
}
.attendanceChart {
    /* background-color: thistle; */
  height: 85vh;
  width: 580px;
  margin-left: 50px;
  margin: 10px;
  padding: 20px;
  border-radius: 10px;
  border: rgb(223, 216, 216) solid 1px;
  border: outset 0.5px;
  float: left;
  overflow-y: auto;
}
.attendancelosttime {
  display: flex;
  flex-direction: column;
}
.performanceChart {
  height: 420px;
  width: 600px;
  margin: 10px;
  margin-left: 50px;
  border-radius: 10px;
  border: rgb(223, 216, 216) solid 1px;
  border: outset 0.5px;
}
#chartdiv {
  width: 100%;
  height: 355px;
  margin-left: 0;
  /* height: 100%; */
}
#samchartdiv {
  width: 100%;
  height: 355px;
  margin-left: 0;
  /* height: 100%; */
}
#costsummarychart {
  width: 100%;
  height: 355px;
  margin-left: 0;
}

.cardPerformace {
    margin-top: 5%;
  display: flex;
  position: relative;
  height: 45px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  transition: height 0.3s, box-shadow 0.3s;
  border-radius: 10px;
  border: 1px solid green;
  font-size: 12px;
  padding-left: 3%;
  padding-right: 3%;
  align-items: center;
}
.statusCardPerformace {
    margin-top: 2%;
  display: flex;
  position: relative;
  height: 45px;
  width: 40%;
  overflow: hidden;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  transition: height 0.3s, box-shadow 0.3s;
  border-radius: 10px;
  border: 1px solid green;
  font-size: 12px;
  padding-left: 3%;
  padding-right: 3%;
  align-items: center;
}
.statusCardPerformace2 {
  margin-bottom: 1%;
  position: relative;
  height: 35px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  transition: height 0.3s, box-shadow 0.3s;
  border-radius: 10px;
  border: 1px solid green;
  font-size: 12px;
  padding-left: 3%;
  padding-right: 3%;
  align-items: center;
}

.cardPerformace:hover {
  height: 50px;
  box-shadow: 10px 10px 30px 0px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  background-color: #acf4ac;
  color: green;
  font-size: 13px;
}
.statusCardPerformace:hover {
  height: 50px;
  box-shadow: 10px 10px 30px 0px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  background-color: #acf4ac;
  color: green;
  font-size: 13px;
}

.cardPerformace p {
  margin-top: 2%;
}

.cardPerformace img {
  height: 30px;
  width: 30px;
  margin: 10px;
  border-radius: 15px;
}
.cardPerformace span {
  height: 300px;
  width: 300px;
  font-size: 25px;
  margin: 10px;
  color: #fdae19;
  /* background: #fdae19; */
  border-radius: 50%;
}

.line-no {
  padding: 3px;
  color: #fdae19;
}
.notifications{
    display: block;
}

.statusesNtoification{
  margin-top: -1%;
    font-size: 12px;
}

.notifcationDescription{
    font-size: 11px;
}

.statuses{
    font-size: 15px;
}
/* .spacer{
    width: 2%;
} */

.cards{
  width: 70%;
}

</style>