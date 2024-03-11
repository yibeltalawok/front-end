<template>
  <div>
    <v-card>
      <v-container grid-list-xs class="white">
        <v-toolbar dense flat class="white">
          <h2 class="text-center py-3" style="color: #2a682a;">
            {{ $t("sewingline_chart") }}
          </h2>
          <v-spacer></v-spacer>{{ $t("line") }}
          <v-card width="100" flat>
            <v-combobox
              v-model="line"
              background-color="white"
              item-color="black"
              light
              hideDetails
              dense
              class="white"
              label="select"
              :items="lines"
              item-text="number"
              item-value="id"
              solo
              flat
              @input="filterByLine"
            />
          </v-card>
          <v-spacer></v-spacer>

          <v-btn text color="success" @click="dialog = true">
            {{ $t("select_date_range") }}
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
        </v-toolbar>

        <apexchart
          type="line"
          height="350"
          width="100%"
          :options="chartOptions"
          :series="series"
        ></apexchart>
      </v-container>

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
import { api, path } from "@/api";
export default {
  data: () => ({
    line: "",
    lines: [],
    outputs: [],
    lineFiltered: [],

    dialog: false,
    dates: [],

    //line graph
    series: [],
    chartOptions: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Sewing line output",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
      xaxis: {
        categories: [0],
        title: {
          text: "Date of month"
        }
      }
    }
  }),
  computed: {
    dateRangeText() {
      return this.dates.join(" ~ ");
    }
  },
  components: {
    apexchart: VueApexCharts
  },
  async created() {
    //line
    this.lines = (await api.all(path.line)).rows
      .filter(a => a.number > 0)
      .map(x => {
        return {
          id: x.id,
          number: x.number,
          capacity: x.capacity,
          date: x.date
        };
      });

    this.line = this.lines[0].number;

    //sewing output
    let filter = {
      include: ["order"]
    };
    this.outputs = (await api.all(path.orderStatus, filter)).rows.map(x => {
      return {
        output: x.sewOut,
        line: x.order.lineNumber,
        date: x.date
      };
    });

    //graph data=>sewing output
    this.setValues(this.outputs);

    //default
  },
  methods: {
    async filterByDate() {
      let dateOne = this.dates[0];
      let dateTwo = this.dates[1];
      let smallestDate = dateOne < dateTwo ? dateOne : dateTwo;
      let biggerDate = dateOne < dateTwo ? dateTwo : dateOne;

      //filter sewing output by date
      let filter = {
        include: ["order"],
        where: {
          date: { between: [smallestDate, biggerDate] }
        }
      };
      let values = (await api.all(path.orderStatus, filter)).rows.map(x => {
        return {
          output: x.order ? x.sewOut : 0,
          line: x.order ? x.order.lineNumber : 0,
          date: x.date
        };
      });
      this.setValues(values);

      this.dialog = false;
    },
    filterByLine(val) {
      this.lineFiltered = this.outputs.filter(x => x.line == val.number);
      this.setValues(this.lineFiltered);
    },
    groupBy(array) {
      let group = array.reduce((r, a) => {
        // eslint-disable-next-line no-console
        console.log("a", a);
        // eslint-disable-next-line no-console
        console.log("r", r);
        r[a.make] = [...(r[a.make] || []), a];
        return r;
      }, {});
      // eslint-disable-next-line no-console
      console.log("group", group);
    },
    setValues(values) {
      this.series = [];
      let data = values.map(x => x.output);
      data[0] = 0;
      this.series.push({
        name: "Output",
        data: data
      });
      //date categories
      values.map(x => {
        this.chartOptions.xaxis.categories.push(
          new Date(x.date).toDateString()
        );
      });
    }
  }
};
</script>
