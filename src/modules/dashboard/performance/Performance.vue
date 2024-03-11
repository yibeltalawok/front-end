<template>
  <div>
    <v-card flat style="margin-bottom: 20px;" >
      <v-container grid-list-xs class="white" >
        <v-toolbar dense flat class="white">
          <h2 class="text-center py-3" style="color: #2a682a;">
            {{ $t("performance") }}
          </h2>

          <v-spacer> </v-spacer>
          <v-btn text color="success" @click="dialog = true">
            {{ $t("select_date_range") }}
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
          <v-spacer></v-spacer>

          <v-spacer></v-spacer>{{ $t("line") }}
          <v-card width="100" flat>
            <v-combobox
              v-model="line"
              background-color="white"
              item-color="black"
              light
              hideDetails
              dense
              label="select"
              :items="lines"
              item-text="number"
              item-value="id"
              solo
              flat
              @input="setLine"
            />
          </v-card>
          <v-spacer></v-spacer>{{ $t("operation") }}
          <v-card width="100" flat>
            <v-combobox
              v-model="operation"
              background-color="white"
              item-color="black"
              light
              hideDetails
              dense
              label="select"
              :items="operations"
              item-text="number"
              item-value="id"
              solo
              flat
              @input="setOperation"
            />
          </v-card>
          <v-spacer></v-spacer>{{ $t("id_num") }}
          <v-card width="100" flat>
            <v-combobox
              v-model="idno"
              background-color="white"
              item-color="black"
              light
              hideDetails
              dense
              label="select"
              :items="idNoIndex"
              item-text="number"
              item-value="id"
              solo
              flat
              @input="setIdNo"
            />
          </v-card>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-layout row justify-center>
          <v-flex xs12 pa2>
            <apexchart
              type="line"
              height="450"
              :options="chartOptions"
              :series="series"
            ></apexchart>
          </v-flex>

          <viewCard
            :tittle="outPutData[0].averagePerformance"
            subtittle="average performance"
            icon="performance"
          />
        </v-layout>
      </v-container>
      <v-spacer></v-spacer>

      <!-- date dialog -->
      <v-dialog
        v-model="dialog"
        scrollable
        persistent
        :overlay="false"
        max-width="300px"
        transition="dialog-transition"
        height="200"
      >
        <v-date-picker v-model="dates" range scrollable>
          <v-toolbar dense flat>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="dialog = false">{{
              $t("cancel")
            }}</v-btn>
            <v-btn color="primary" @click="filterByDate">{{ $t("ok") }}</v-btn>
            <v-spacer></v-spacer>
          </v-toolbar>
        </v-date-picker>
      </v-dialog>
      <!-- date dialog -->
    </v-card>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import _ from "lodash";
import { api, path } from "@/api";
import { mapState } from "vuex";
import viewCard from "../../quality/viewCard";
export default {
  data: () => ({
    line: "",
    lines: [],
    outputs: [],
    idno: "",
    idNo: [],
    idNoIndex: [],
    operation: "",
    operations: [],
    currentLineGroup: [],
    currentOperationGroup: [],
    groupedByLine: {},
    groupedByOperation: {},
    groupedById: {},

    dialog: false,
    dates: [],

    //line graph
    series: [],
    chartOptions: {
      chart: {
        zoom: {
          enabled: true
        }
      },
      colors: [
        "#77B6EA",
        "#545454",
        "#ff0000",
        "#fffc00",
        "#0300ff",
        "#b700ff",
        "#0ab912"
      ],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Operator performance per day",
        align: "left"
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
      markers: {
        size: 1
      },
      xaxis: {
        type: "category",
        categories: [" "],
        title: {
          text: "Days"
        }
      },
      yaxis: {
        title: {
          text: "Performance"
        },
        min: 10,
        max: 100
      },
      legend: {
        position: "bottom",
        horizontalAlign: "right",
        floating: true,
        offsetY: 5,
        offsetX: -5
      }
    }
  }),
  computed: {
    ...mapState("employee", ["outPutData"]),
    dateRangeText() {
      return this.dates.join(" ~ ");
    }
  },
  components: {
    apexchart: VueApexCharts,
    viewCard
  },
  async created() {
    //Set one month date range
    this.setDate();

    //line
    var l = (await api.all(path.line)).rows;
    this.lines = l.map(x => {
      return x.number;
    });
    if (this.lines) {
      this.line = this.lines[0];
    }

    //Get performance by date
    this.filterByDate();
  },
  methods: {
    setDate() {
      var today = new Date().toISOString();
      this.dates.push(today.substring(0, 10));
      var before = new Date(today);
      before.setMonth(parseInt(before.getMonth()) - 1);
      this.dates.push(before.toISOString().substring(0, 10));
    },
    async filterByDate() {
      let dateOne = this.dates[0];
      let dateTwo = this.dates[1];
      let smallestDate = dateOne < dateTwo ? dateOne : dateTwo;
      let biggerDate = dateOne < dateTwo ? dateTwo : dateOne;

      //filter sewing output by date
      let filter = {
        include: { jobs: ["employee", "lines", "operation"] },
        where: {
          date: { between: [smallestDate, biggerDate] }
        }
      };
      this.outputs = (await api.all(path.performance, filter)).rows.map(p => {
        return {
          date: p.date,
          value: p.value,
          idno: p.jobs.employee.idno,
          line: p.jobs.line,
          operationCode: p.jobs.operation.code
        };
      });
      this.setLineGrouped();
      this.setLine();

      this.dialog = false;
    },
    setLineGrouped() {
      let values = this.outputs;
      let groupedByLine = _.groupBy(values, "line");

      this.groupedByLine = groupedByLine;
    },
    setLine() {
      this.operation = "";
      this.operations = [];
      let group = this.groupedByLine;
      this.currentLineGroup = group[this.line];

      //Set Operations
      this.setOperation();

      let dateGroup = _.groupBy(this.currentLineGroup, "date");
      let dates = [...new Set(Object.keys(dateGroup))];

      //Set X axis values
      this.setXaxis(dates);
    },
    setOperation() {
      this.idno = "";
      let currentLineGroup = this.currentLineGroup;
      let groupedByOperation = _.groupBy(currentLineGroup, "operationCode");

      let operations = Object.keys(groupedByOperation);
      this.operations = [];
      this.operations = operations;

      let operation = this.operation;

      let operationGroup = [];

      if (operation == "") {
        operations.forEach(op => {
          operationGroup.push(groupedByOperation[op]);
        });
      } else {
        operationGroup.push(groupedByOperation[operation]);
      }

      this.groupedByOperation = operationGroup;
      this.currentOperationGroup = [];

      for (let i = 0; i < this.groupedByOperation.length; i++) {
        const g = this.groupedByOperation[i];
        for (let j = 0; j < g.length; j++) {
          const op = g[j];
          this.currentOperationGroup.push(op);
        }
      }

      // set current ID #
      this.setIdNo();
    },
    setIdNo() {
      this.groupedById = _.groupBy(this.currentOperationGroup, "idno");
      this.idNoIndex = Object.keys(this.groupedById);

      this.idNo = [];
      let idno = this.idno;
      if (idno != "") {
        this.idNo.push(idno);
      } else {
        this.idNo = this.idNoIndex;
      }
      //Set individual value of lien or employee to series
      this.setValue();
    },
    setValue() {
      this.series = [];
      let group = this.groupedById;
      let idNo = this.idNo;

      idNo.forEach(id => {
        //Performance Series
        let result = group[id].map(d => {
          return d.value;
        });
        this.series.push({
          name: id,
          data: result
        });
      });
    },
    async setXaxis(dates) {
      let x = this.chartOptions.xaxis.categories;
      if (x.length > 1) {
        for (let i = 0; i < x.length; i++) {
          this.chartOptions.xaxis.categories[i].pop();
        }
        this.chartOptions.xaxis.categories[0] = " ";
      }

      for (let i = 0; i < dates.length; i++) {
        const d = dates[i];
        if (i == 0) {
          this.chartOptions.xaxis.categories[0] = new Date(d).toDateString();
        } else {
          this.chartOptions.xaxis.categories.push(new Date(d).toDateString());
        }
      }
    }
  }
};
</script>
