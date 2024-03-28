<template>
  <div>
    <v-card class="white"> 
      <v-toolbar flat class="white">
          <v-spacer></v-spacer>
          <!-- <v-text-field
            :label="$t('Filter by date')"
            placeholder="yyyy-mm-dd"
            dense
            outlined
            v-model="date"
            hide-details
            name="date"
            type="date"
            @input="getReport"
          /> -->

          <v-spacer />
          <!-- <v-card outlined class="pink">
            <v-layout row wrap> -->
          <v-text-field
            :label="$t('Week start month')"
            placeholder="yyyy-mm-dd"
            dense
            outlined
            v-model="start"
            hide-details
            name="date"
            type="month"
            @input="getWeekReport"
          />
          <v-spacer></v-spacer>
          <v-text-field
            :label="$t('Week end Month')"
            placeholder="yyyy-mm-dd"
            dense
            outlined
            v-model="end"
            hide-details
            name="date"
            type="month"
            @input="getWeekReport"
          />
                <v-spacer></v-spacer> 

        <v-flex xs12 ms12 md5 lg5>
           <v-combobox
            v-model="year"
            dense
            label="Filter by year"
            :items="years"
            item-text="year"
            item-value="year"
            hide-details 
            @input="filterByYear(year.year)"
            outlined
          />
        </v-flex>
      </v-toolbar>
      <v-container grid-list-xs>
        <v-layout row justify-center>  
          <v-flex xs12 sm12 md8 lg8 pa-2>
            <div class="small">
            <line-chart :chart-data="lineChart" :options="options"></line-chart>
          </div>
            <!-- <chart
              width="1000"
              height="400"
              id="line"
              :line="line"
               :fBy="fBy"
            ></chart> -->
          </v-flex>
        </v-layout>
           <v-spacer />
        <v-layout row justify-center>
         <v-flex xs12 ms12 md4 lg4 pa-1>
       <viewCard :tittle="total" subtittle="Defect"/>
         </v-flex>
         <v-flex xs12 ms12 md4 lg4 pa-2>
        <viewCard :tittle="averageDefect" subtittle="Defect/average"/>
       </v-flex>
     </v-layout>
      </v-container> 
    </v-card>
  </div>
</template>
<script>
// import VueApexCharts from "vue-apexcharts";
// import Chart from "./Chart";
//import {api,path} from "@/api";
import { mapActions, mapState } from "vuex";
import viewCard from "../../quality/viewCard"
import LineChart from "./lineChart";
export default {
  data: () => ({
    year: "",
    fBy: "all",
    total:0,
    lines:[],
     end: new Date().toISOString().substr(0,7),
      start: new Date().toISOString().substr(0,7),
    averageDefect:0,
    lengthLable:0,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: "right",
          align: "right",
          labels: {
            render: "percentage",
            fontColor: ["green", "white", "red"],
            precision: 2
          }
        }
      },

  }),
  components: {
      viewCard,
    LineChart,
  },
  computed: {
    ...mapState("defects", ["lineChart","years"])
  },
   created() {
    this.getReport(new Date());
    // this.getReport(this.date);
  },
// async mounted() {
//     let lines = (await api.all(path.line)).rows
//       .filter(a => a.number > 0)
//       .map(x => {
//         return {
//           number: x.number
//         };
//       });

//     const key = "number";
//     this.lines = [...new Map(lines.map(item => [item[key], item])).values()];

//     this.line = this.lines[0].number;
//   },


  methods: {
    ...mapActions("defects", ["getlinechart","getDashboardWithRange"]),

    getWeekReport() {
      if (this.start != "" && this.end != "") {
        var start = new Date(this.start);
        let sm = start.getMonth(); 
        let sy = start.getFullYear();

        var end = new Date(this.end);
        let em = end.getMonth(); 
        let ey = end.getFullYear();
        if (sm <= em  && sy == ey) {
          this.getDashboardWithRange([this.start, this.end]);
        } else {
          this.$notify({
            type: "danger",
            title: "Input error",
            message: `${this.$t(
              "Please select valid date interval in same month?"
            )}`
          });
        }
      }
    },

      filterByYear(year) {
        let date = year+"-03-23" 
        this.getReport(date)
        },

    async getReport(date) {
      // eslint-disable-next-line no-console
     await this.getlinechart(date).then(res=>{
       res
     this.total =  this.lineChart.datasets[0].data.reduce((acc,val)=>parseFloat(acc)+parseFloat(val))
     this.lengthLable=parseFloat(this.lineChart.labels.length)
     this.averageDefect=this.total/this.lengthLable   
    });
    },
  }
};
</script>
