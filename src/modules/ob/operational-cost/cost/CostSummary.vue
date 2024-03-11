<template>
  <div>
    <v-container grid-list-xs fluid>
      

        <v-toolbar dense flat>
          <v-spacer></v-spacer>
          <v-btn 
            text
            small
            outlined
            color="amber"
            class="text-capitalize"
            @click="addNewDialog = true"
            >Add New
            </v-btn>
        </v-toolbar>
        <v-layout row wrap justify-center mb-7>
          <div class="maincontainer">
            <div class="chartanddata">
              <div class="chartcontainer">
                <div class="titilesection">
                  <v-layout row justify-space-between>
                    <div class="tittle">Cost Per Minute</div>
                    <v-spacer></v-spacer>
                    <date @click.stop="datePickerCPM = true" class="icons" style="margin-left: 75%" />
                    <v-row justify="center">
                      <v-dialog v-model="datePickerCPM" persistent max-width="290">
                        <v-date-picker color="amber" type="month" v-model="selectedDate">
                          <v-spacer />
                          <v-btn
                            text
                            color="amber"
                            @click="(datePickerCPM = false), reloadCPMChart(selectedDate)"
                            >Ok</v-btn
                          ></v-date-picker
                        >
                      </v-dialog>
                    </v-row>
                  </v-layout>
                </div>
                <div class="chartview" id="samchartdiv">

                </div>
              </div>

              <div class="textdata">

                <!-- <div class="differencecard">
                  <div class="numbersection">
                    <div class="costpersamnumber">{{ (this.yearDiff/1000000).toFixed(3) }}</div>
                    <div class="costpersamtext">Per Year</div>
                  </div>
                  <div class="iconsection">
                    <div class="upicon">
                      <img class="imageicons" :class="{filtergreen: !this.yearIncrease}" src="@/assets/images/up.png" />
                    </div>
                    <div class="middletext">{{this.yearPercentage.toFixed(2)}}%</div>
                    <div class="downicon">
                      <img class="imageicons" :class="{filtergreen: this.yearIncrease}" src="@/assets/images/down.png" />
                    </div>
                  </div>
                </div> -->

                <div class="differencecard">
                  <div class="numbersection">
                    <div class="costpersamnumber">{{ (this.yearDiff/1000000).toFixed(3) }} M</div>
                    <div class="costpersamtext">Per Year</div>
                  </div>
                  <div class="iconsection">
                    <div class="upicon">
                      <img class="imageicons" :class="{filtergreen: !this.yearIncrease}" src="@/assets/images/up.png" />
                    </div>
                    <div class="middletext">{{this.yearPercentage}}%</div>
                    <div class="downicon">
                      <img class="imageicons" :class="{filtergreen: this.yearIncrease}" src="@/assets/images/down.png" />
                    </div>
                  </div>
                </div>

                <div class="differencecard">
                  <div class="numbersection">
                    <div class="costpersamnumber">{{ (this.monthDiff/1000000).toFixed(3) }} M</div>
                    <div class="costpersamtext">Per Month</div>
                  </div>
                  <div class="iconsection">
                    <div class="upicon">
                      <img class="imageicons" :class="{filtergreen: !this.monthIncrease}" src="@/assets/images/up.png" />
                    </div>
                    <div class="middletext">{{this.monthPercentage}}%</div>
                    <div class="downicon">
                      <img class="imageicons" :class="{filtergreen: this.monthIncrease}" src="@/assets/images/down.png" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </v-layout>

        <v-card outlined style="border-radius: 12px">
          <v-data-table
          :headers="headers"
          :items="this.costPerMins"
          item-key="id"
          >
            <template slot="headerCell" slot-scope="props">
              <span class="table-header-text caption font-weight-bold">
                {{ $t(props.header.text) }}
              </span>
            </template>
            
            <template v-slot:item.date="{ item }">{{
              new Date(item.date).toLocaleDateString("en-US")
            }}</template>

            <template v-slot:item.costPerMinute="{ item }">
              {{item.costPerMinute.toFixed(3)}}
            </template>

          </v-data-table>
        </v-card>


        <!-- /////////// THE DIALOG ////////// -->
        <v-dialog v-model="addNewDialog" persistent max-width="650px">
          <v-card>
            <v-app-bar color="amber">
              <v-card-subtitle style="color: white">Add New Cost Per Minute </v-card-subtitle>
              <v-spacer />
              
              <v-btn
                icon
                dark
                @click="addNewDialog = false"
                color="red"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-app-bar>
            <v-card-text style="margin-top: 5%">
              <!-- <v-container> -->
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      :return-value.sync="monthYear"
                      transition="scale-transition"
                      offset-y
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          flat
                          v-on="on"
                          v-bind="attrs"
                          v-model="monthYear"
                          label="Start and End Date"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        color="amber"
                        v-model="monthYear"
                        type="month"
                        no-title
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu = false"
                          >Cancel</v-btn
                        >
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menu.save(monthYear), getCost(monthYear), checkByDate(monthYear)"
                          >OK</v-btn
                        >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" sm="6"> Total Cost : {{this.totalCostMin}} </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      max="31"
                      type="number"
                      label="Working Days"
                      v-model="item.workingDays"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      type="number"
                      label="Minutes Per Day"
                      v-model="item.minutesPerDay"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-flex xs12 sm12 md12 lg12 pa-2 mb-3 v-if="this.costPMdialog.length > 0">
                    <v-data-table
                    :headers="headers"
                    :items="this.costPMdialog"
                    :hide-default-footer="true"
                    disable-pagination
                    item-key="id"
                    >
                    <template v-slot:item.date="{ item }">{{
                      new Date(item.date).toLocaleDateString("en-US")
                    }}</template>

                    <template v-slot:item.costPerMinute="{ item }">
                      {{item.costPerMinute.toFixed(3)}}
                    </template>

                    </v-data-table>
                  </v-flex>
                </v-row>

                <v-row>
                  <!-- <v-col cols="12" sm="8"></v-col> -->
                  <v-col cols="12" sm="9"
                    ><v-btn small text color="red" @click="addNewDialog = fasle"
                      >Cancel</v-btn
                    ></v-col
                  >
                  <v-spacer></v-spacer>
                  <v-col>
                    <div v-if="this.costPMdialog.length > 0">
                      <v-btn 
                        small
                        text
                        color="amber"
                        @click="update()"
                      >
                        {{ $t("update") }}
                      </v-btn>

                    </div>

                    <div v-if="this.costPMdialog.length == 0">
                      <v-btn 
                        small
                        text
                        color="amber"
                        @click="save()"
                      >
                        {{ $t("save") }}
                      </v-btn>

                    </div>
                    </v-col>
                </v-row>
              <!-- </v-container> -->
            </v-card-text>
          </v-card>
        </v-dialog>

      

    </v-container>

  </div>
</template>

<script>
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import date from "@/assets/icons/date_icon.svg";
import { mapActions, mapState, mapMutations } from "vuex";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

export default {
  name: "UserAccountCreate",

  data() {
    return {
      menu: false,
      monthYear: new Date().toISOString().substr(0, 7),
      addNewDialog: false,
      selectedMonth: '',
      item: {},
      datePickerCPM: false,
      selectedDate: new Date().toISOString().substr(0, 7),
      monthDiff: '',
      monthPercentage: '',
      // cpmStatus: '',
      yearDiff: '',
      yearPercentage: '',
      // yearCostStatus: '',
      monthIncrease: false,
      yearIncrease: false,
      headers: [
        {
          text: this.$t("dateRecorded"),
          value: "date",
        },
        {
          text: this.$t("costPerMonth"),
          value: "costPerMonth",
        },
        {
          text: this.$t("costPerMinute"),
          value: "costPerMinute",
        },
        {
          text: this.$t("workingDays"),
          value: "workingDays",
        },
        {
          text: this.$t("workingHours"),
          value: "workingHours",
        },
        {
          text: this.$t("minutesPerDay"),
          value: "minutesPerDay",
        },
        
      ],
      
    };
  },

  components: {
    date,
  },
  async created() {
    // this.compareCostPerMonth()
    await this.getCostPerMinutes();
    
  },

  async mounted(){
    await this.compareCostPerMonth().then(() =>{
      this.compareCostPerYear().then(() =>{
        this.drawCostPerSamChart();
      })
    })
    
    
    
  },
  computed: {
    ...mapState("cost", ["totalCostMin", "costPerMins", "costPMdialog", "costPerMinId", "cpms", "currentMonthCost", "prevMonthCost", "currentYearCost", "prevYearCost"]),
  },
  methods: {
    ...mapActions("cost", ["getCostForCostPerMin", "createCostPerMinute", "getCostPerMinutes", "getCostPerMinsByDate", "getIdOfCostPerMin",
      "updateCostPerMinute", "fetchCPMForChart", "fetchCurrentMonthCost", "fetchPrevMonthCost", "fetCurrentYearCost", "fetchPrevYearCost"]),

    async drawCostPerSamChart(){

      let dt = new Date().toISOString().substr(0, 7);
      let year = '';
      if(this.selectedDate){
        year = this.selectedDate.substr(0, 4);
      }
      else{
        year = dt.substr(0,4);
      }
      // let month = dt.substr(5, 2);

      let filter = '';
      // Create chart instance
      let chart = am4core.create("samchartdiv", am4charts.XYChart);

      let data = [];
      let value = 120;

      let names = ["January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
      ];

      for (var i = 0; i < names.length; i++) {
          // let isodate = new Date().toISOString().substr(0,10);
        switch (names[i]) {
            case "January":
                // month = '01';
                filter = year+"-01"
                break;

            case "February":
                // month = '02';
                filter = year+"-02";
                break;

            case "March":
                // month = '03';
                filter = year+"-03";
                break;

            case "April":
                // month = '04';
                filter = year+"-04";
                break;

            case "May":
                // month = '05';
                filter = year+"-05";
                break;

            case "June":
                // month = '06';
                filter = year+"-06";
                break;

            case "July":
                // month = '07';
                filter = year+"-07";
                break;

            case "August":
                // month = '08';
                filter = year+"-08";
                break;

            case "September":
                // month = '09';
                filter = year+"-09";
                break;
                
            case "October":
                // month = '10';
                filter = year+"-10";
                break;

            case "November":
                // month = '11';
                filter = year+"-11";
                break;

            case "December":
                // month = '12';
                filter = year+"-12";
                break;

            default: filter = year+"-01";
                break;
        }
          
        await this.fetchCPMForChart(filter).then(() =>{
            value = this.cpms;
            data.push({ category: names[i], value: value });
        })
          
      }

      chart.colors.list = [
      am4core.color("#f5ba0a")
      ];

      chart.data = data;
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.dataFields.category = "category";
      categoryAxis.renderer.minGridDistance = 15;
      categoryAxis.renderer.grid.template.location = 0.5;
      categoryAxis.renderer.grid.template.strokeDasharray = "1,3";
      categoryAxis.renderer.labels.template.rotation = -90;
      categoryAxis.renderer.labels.template.horizontalCenter = "left";
      categoryAxis.renderer.labels.template.location = 0.5;
      categoryAxis.renderer.labels.template.fontSize = 12;

      categoryAxis.renderer.labels.template.adapter.add("dx", function(dx, target) {
          return -target.maxRight / 2;
      })

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.ticks.template.disabled = true;
      valueAxis.renderer.axisFills.template.disabled = true;

      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = "category";
      series.dataFields.valueY = "value";
      series.tooltipText = "{valueY.value}";
      series.sequencedInterpolation = true;
      series.fillOpacity = 0;
      series.strokeOpacity = 1;
      series.strokeDashArray = "1,3";
      series.columns.template.width = 0.01;
      series.tooltip.pointerOrientation = "horizontal";

      let bullet = series.bullets.create(am4charts.CircleBullet);

      chart.cursor = new am4charts.XYCursor();

      // chart.scrollbarX = new am4core.Scrollbar();
      // chart.scrollbarY = new am4core.Scrollbar();
    },

    async reloadCPMChart(val){
      this.selectedDate = val;
      await this.drawCostPerSamChart();
      // alert(val);
    },
    
    async getCost(val) {
      this.selectedMonth = val;
      this.getCostForCostPerMin(val).then(() =>{
        // alert(this.selectedMonth)
      })
    },

    async checkByDate(dt){
      // alert(dt)
      await this.getCostPerMinsByDate(dt);
    },
    async save() {
      if(this.selectedMonth){
        let dt = new Date();
        let hour = this.item.minutesPerDay/60;
        // alert(date);
        // costPerMonth = this.totalCostMin;
        let costPerDay = this.totalCostMin / this.item.workingDays;
        let costPerHour = costPerDay / hour;
        let costPerMin = costPerHour / 60;

        this.item.date = this.selectedMonth;
        this.item.costPerMonth = this.totalCostMin;
        this.item.costPerDay = costPerDay;
        this.item.costPerHour = costPerHour;
        this.item.costPerMinute = costPerMin;
        this.item.workingHours = hour;
        // console.log(this.item);

        await this.createCostPerMinute(this.item).then(() =>{
          this.addNewDialog = false;
          this.getCostPerMinutes();
          this.$notify({
              type: "success",
              title: "Cost Per Minute",
              message: `Cost Per Minute created successfully.`
          });
        })
      }
      
    },
    async compareCostPerMonth(){
      let dt = new Date().toISOString().substr(0,7);
      // alert(dt)
      let year = dt.substr(0, 4);
      // alert(year)
      let month = dt.substr(5, 2);
      let thisMonth = parseInt(month);
      let prevMonth = (month - 1).toString();
      let previousMonth = '';
      if(prevMonth < 10){
        previousMonth = "0"+prevMonth;
      }
      else{
        previousMonth = prevMonth.toString();
      }

      let prevMonthFilter = (year+"-"+previousMonth);
      // alert(prevMonthFilter)
      
      // console.log(previousMonth + " : "+month);

      // fetch this month's cost.
      await this.fetchCurrentMonthCost(dt).then(() =>{

        // then fetch the previous month's cost
        this.fetchPrevMonthCost(prevMonthFilter).then(() =>{
          if(this.currentMonthCost > this.prevMonthCost){
            this.monthDiff = this.currentMonthCost - this.prevMonthCost;
            if(this.prevMonthCost == 0){
              this.monthPercentage = this.currentMonthCost.toFixed(2);
            }
            else{
              this.monthPercentage = ((this.monthDiff * 100) / this.prevMonthCost).toFixed(2);
            }
            
            // console.log(this.monthPercentage);
            // this.cpmStatus = 'increase'
            this.monthIncrease = true;
          }
          else if(this.currentMonthCost < this.prevMonthCost){
            this.monthDiff = this.prevMonthCost - this.currentMonthCost;
            this.monthPercentage = ((this.monthDiff * 100) / this.currentMonthCost).toFixed(2);
            // this.cpmStatus = 'decrease';
            this.monthIncrease = false;
          }
        });

      });

      
    },

    async compareCostPerYear(){
      let dt = new Date().toISOString().substr(0,7);
      // alert(dt)
      let year = dt.substr(0, 4);
      // alert(year)
      let thisYear = parseInt(year);
      let prevYear = (year - 1).toString();
      // alert(prevYear)
      
      // fetch this year's cost.
      await this.fetCurrentYearCost(year).then(() =>{
        // console.log("Current Year: "+this.currentYearCost)
        // then fetcch the previous year's cost.
        this.fetchPrevYearCost(prevYear).then(() =>{
          // console.log("Prev Year: "+this.prevYearCost)
          if(this.currentYearCost > this.prevYearCost){
            this.yearDiff = this.currentYearCost - this.prevYearCost;
            if(this.prevYearCost == 0){
              this.yearPercentage = this.currentYearCost.toFixed(2);
            }
            else{
              this.yearPercentage = ((this.yearDiff * 100)/this.prevYearCost).toFixed(2);
            }
            // this.yearCostStatus = 'increase';
            this.yearIncrease = true;
          }
          else if(this.currentYearCost < this.prevYearCost){
            this.yearDiff = this.prevYearCost - this.currentYearCost;
            this.yearPercentage = ((this.yearDiff * 100) / this.currentYearCost).toFixed(2);
            // this.yearCostStatus = 'decrease';
            this.yearIncrease = false;
          }
        })
      })

    },

    async update(){
      if(this.selectedMonth){
        let dt = new Date();
        let hour = this.item.minutesPerDay/60;

        //get the id of the cost per minute to be updated.
        await this.getIdOfCostPerMin(this.selectedMonth).then(() =>{

          let costPerDay = this.totalCostMin / this.item.workingDays;
          let costPerHour = costPerDay / hour;
          let costPerMin = costPerHour / 60;

          let costPMin ={
            id: this.costPerMinId,
            date: this.selectedMonth,
            costPerMonth: this.totalCostMin,
            costPerDay: costPerDay,
            costPerHour: costPerHour,
            costPerMinute: costPerMin,
            workingDays: this.item.workingDays,
            minutesPerDay: this.item.minutesPerDay,
            workingHours: hour
            
          }

          this.updateCostPerMinute(costPMin).then(() =>{
            this.addNewDialog = false;
            this.costPMdialog = [];
            this.getCostPerMinutes();
            this.$notify({
                type: "success",
                title: "Cost Per Minute",
                message: `Cost Per Minute Updated successfully.`
            });
          })

        })
      }
    }
  },
};
</script>

<style scoped>
.costpersamtext {
  flex: 1;
  font-family: "Courier New", Courier, monospace;
  font-size: 20px;
  font-weight: lighter;
  color: grey;
  margin: auto;
}
.costpersamnumber {
  flex: 2;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
  font-size: 25px;
  font-weight: bold;
  color: grey;
  width: 12vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: auto;
}

.upicon {
  height: 4vh;
  width: 100%;
}

.middletext {
  /* margin: auto; */
  font-size: 16px;
  font-weight: lighter;
  color: grey;
}

.imageicons {
  height: 30px;
  width: 30px;
  margin: auto;
}

.downicon {
  height: 4vh;
  width: 100%;
}
.iconsection {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.numbersection {
  flex: 3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 15px;
  padding-right: 10px;
}
.textdata .differencecard {
  height: 13vh;
  width: 69%;
  background-color: tomato;
  margin: auto;
  border: 1px solid rgb(218, 213, 213);
  background-color: white;
  border-radius: 20px;
  display: flex;
  padding: 5px;
}

.textdata {
  background-color: white;
  height: 40vh;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.icons {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.titilesection {
  flex: 1;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
  font-size: 15px;
  font-weight: bold;
  color: grey;
  margin-left: 10px;
  margin-right: 10px;
}

.chartview {
  /* background-color: lightgray; */
  flex: 10;
}

.chartcontainer {
  height: 40vh;
  flex: 2;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border: 1px solid rgb(218, 213, 213);
  background-color: white;
  border-radius: 20px;
}

.datatable {
  height: 40vh;
  width: 97%;
  margin: 10px;
  border-radius: 10px;
  background-color: lavender;
}

.chartanddata {
  height: 40vh;
  width: 100%;
  display: flex;
}

.maincontainer {
  width: 100%;
  /* height: 90vh; */
  margin-top: 10px;
}
.filtergreen {
  filter: invert(48%) sepia(79%) saturate(26%) hue-rotate(86deg)
    brightness(118%) contrast(119%);
}
</style>
