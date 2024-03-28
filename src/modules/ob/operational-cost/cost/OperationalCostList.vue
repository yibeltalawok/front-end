<template>
  <div>
    <div class="form-group">
      <input
        type="file"
        id="csv_file"
        style="display: none"
        ref="csvfileInput"
        name="csv_file"
        class="form-control"
        @change="loadCSV($event)"
      />
    </div>



    <v-container grid-list-xs fluid>
      <v-card flat>
        <v-toolbar style="margin-bottom: 10px" dense flat>
          <v-layout row align-content-space-around>
            <v-spacer></v-spacer>
            
                <v-dialog
                  v-model="dialog"
                  persistent
                  max-width="600px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      small
                      rounded
                      outlined
                      color="#ECBB44"
                      class="text-capitalize mx-1 ml-3 mr-3"
                      v-bind="attrs"
                      v-on="on"
                      >
                      {{ $t("cost-entry") }}
                      </v-btn>               
                  </template>
                  <v-card>
                    <v-app-bar color="amber">
                      <v-card-title style="color:white">
                        Enter Cost Entry
                      </v-card-title>
                      <v-spacer></v-spacer>
                      <v-btn
                          color="red"
                          text
                          @click="dialog = false"
                        >
                          <svgIcon name="close"/>
                      </v-btn>
                    </v-app-bar>
                    <CostEntry />
                  </v-card>
                </v-dialog>
      

            <v-btn
              small
              rounded
              outlined
              color="#ECBB44"
              class="text-capitalize mx-1 ml-3 mr-3"
              @click="$router.push({ name: 'operational-cost-summary' })"
              >{{ $t("cost-summary") }}</v-btn
            >
            <v-btn
              small
              rounded
              color="#ECBB44"
              outlined
              class="text-capitalize mx-1 ml-3 mr-3"
              @click="$router.push({ name: 'cost-per-sam' })"
              >{{ $t("cost-per-SAM") }}</v-btn
            >
            <v-btn
              rounded
              small
              outlined
              color="#ECBB44"
              class="text-capitalize ml-3 mr-3"
              @click="$refs.csvfileInput.click()"
            >
              <v-icon small style="margin-right: 10px">mdi-file</v-icon>
              {{ $t("upload-cost-sheet") }}
            </v-btn>

            <v-btn
              small
              color="amber"
              class="text-capitalize mx-1 ml-3 mr-3 white--text"
              @click="downloadDataAsCsv('opmsOperationalCost', items)"
              >{{ $t("print") }}</v-btn
            >
          </v-layout>
        </v-toolbar>

        <v-divider></v-divider>

        <div id="mainView">
          <div id="tableChartDiv">
            <div id="chartDivMain">
              <h4 id="headerChart">{{ this.totalCostDescription }}</h4>
              <div id="chartCostSum"></div>
            </div>

            <v-data-table
              :headers="headers"
              :items-per-page="itemsperpage"
              :loading="oplistloadding"
              :items="opcosts"
              item-key="id"
              loading-text="Loading data... Please wait"
            >
              <template v-show="oplistloadding" slot="loading">
                <loadingdata />
              </template>

              <template v-show="oplistloadding" slot="no-data">
                <errorloading />
              </template>

              <template v-slot:item.date="{ item }">{{
                new Date(item.date).toLocaleDateString("en-US")
              }}</template>
              <template v-slot:item.action="{ item }">
                <v-btn
                  text
                  small
                  color="success"
                  class="text-capitalize"
                  @click="deleteItem(item.id, path)"
                >
                  <v-icon small class="red--text">delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </div>

          <div id="specification" outlined>
            <v-select
              label="Payment method / Type"
              :items="paymentMethodList"
              item-text="nametype"
              v-model="nameTypeSelected"
              @change="reloadChartData()"
            ></v-select>
            <v-select
              ref="nameNarrtion"
              label="Reason / Narration"
              :items="reasonForPaymentList"
              item-text="namenarration"
              v-model="nameNarrationSelected"
              @change="reloadChartData()"
            ></v-select>
            <v-text-field
              flat
              prepend-inner-icon="search"
              color="primary"
              dense
              solo
              hide-details
              v-model="search"
              :label="$t('search-operational-cost')"
              single-line
            />
          </div>
        </div>

        <v-card flat width="500px" style="margin: auto">
          <v-pagination
            v-model="currentpage"
            :length="parseInt(opcostscount / 10 + 1)"
            circle
            color="amber"
            @input="pageChanged"
          />
        </v-card>
      </v-card>
    </v-container>

    <!-- csvDialog dialog  -->
    <v-dialog
      v-model="csvDialog"
      persistent
      :overlay="true"
      max-width="80%"
      transition="dialog-transition"
    >
      <v-card>
        <v-toolbar flat dense dark color="primary ">
          Register from CSV files
          <v-spacer />
          <v-btn icon @click="closeDialog()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-data-table
            :headers="csvheaders"
            :items-per-page="10"
            :items="csvData"
            footer-props.items-per-page-text="`Performance per page`"
          >
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-btn @click.stop="uploadtoServer()" outlined small> Upload </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { path } from "@/api";
import { TableMixinWithVuex, csvDownloadMixin } from "@/shared/mixins";
import { errorloading, loadingdata } from "@/shared/components";
import { mapActions, mapState, mapMutations } from "vuex";
import CostEntry from "./CostEntry"
import svgIcon from "../../../layout/Icon";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

export default {
  name: "OperationalCostList",
  mixins: [TableMixinWithVuex, csvDownloadMixin],
  components: {
    CostEntry,
    errorloading,
    loadingdata,
    svgIcon
  },
  data() {
    return {
      //Used to selection critreria default value in v-select
      dialog: false,
      totalCostDescription: "Total Cost : 0 Birr",
      nameTypeSelected: "All",
      nameNarrationSelected: "All",
      headers: [
        {
          text: this.$t("date"),
          value: "date",
        },
        {
          text: this.$t("narration"),
          value: "narration",
        },
        {
          text: this.$t("type"),
          value: "type",
        },
        {
          text: this.$t("amount"),
          value: "amount",
        },

        {
          text: this.$t("action"),
          value: "action",
          sortable: false,
          align: "center",
        },
      ],
      csvheaders: [
        {
          text: "Date",
          value: "date",
        },
        {
          text: "Narration",
          value: "narration",
        },
        {
          text: "Type",
          value: "type",
        },
        {
          text: "Amount",
          value: "amount",
        },
      ],

      csvData: [],
      csvDialog: false,
      testData: [],

      // templete data for table mixin
      path: path.operationalCost,
      totalItemsCount: this.opcostscount,
      search: "", // search variable attached to a textfield to search the list
      searcpropertry: "narration", // searchable property on the list where you want to apply the search
      // filteroptions: {},  // minimal filter object where filtering is done
      resourceName: "Operational Cost", // resorce name or main page name, or may be the model name where you are fetching the data from
      fetchListData: this.getOpCosts, // method from the vuex actions which accepts a filter and sets the list data to a variable
      setloading: this.setOpListLoadding, // a mutation method in vuex where you change the vlaue of the loading variable
    };
  },

  created() {
    var data = [];
    data.push("All");
    data.push("All");

    this.getOprationCostPerYear(data).then(() => {
      var totalCost = 0;
      for (let i = 0; i < this.oprationCostPerYear.length; i++) {
        totalCost += this.oprationCostPerYear[i].cost;
      }
      this.totalCostDescription = "Total Cost : " + totalCost + " Billion Birr";
      this.drawCostSummaryChart();
    });
    this.getPaymentMethodList();
    this.getReasonForPaymentList();
  },

  computed: {
    ...mapState("costs", ["opcosts", "opcostscount", "oplistloadding"]),
    ...mapState("operation", [
      "oprationCostPerYear",
      "paymentMethodList",
      "reasonForPaymentList",
    ]),
  },
  methods: {
    ...mapActions("costs", ["uploadOperations", "getOpCosts"]),
    ...mapMutations("costs", ["setOpListLoadding"]),
    ...mapActions("operation", [
      "getOprationCostPerYear",
      "getPaymentMethodList",
      "getReasonForPaymentList",
    ]),

    closeDialog() {
      this.csvDialog = false;
      this.csvData = [];
    },
    loadCSV(e) {
      var vm = this;
      if (window.FileReader) {
        var reader = new FileReader();
        reader.readAsText(e.target.files[0]);
        // Handle errors load
        reader.onload = function (event) {
          var csv = event.target.result;
          vm.csvJSON(csv);
        };
        reader.onerror = function (evt) {
          if (evt.target.error.name == "NotReadableError") {
            alert("Canno't read file !");
          }
        };
      } else {
        alert("FileReader are not supported in this browser.");
      }
    },
    csvJSON(csv) {
      var vm = this;
      var lines = csv.split("\n");

      lines.map(function (line, indexLine) {
        if (indexLine < 1) return; // Jump header line
        var currentline = line.split(",");
        //assign value of each row to object
        var csv_headers = {
          date: currentline[0],
          narration: currentline[1],
          type: currentline[2],
          amount: currentline[3],
        };
        //push object to array
        vm.csvData.push(Object.assign({}, csv_headers));
      });
      vm.csvData.pop();
      vm.csvDialog = false;
      vm.csvDialog = true;
      // eslint-disable-next-line no-console
      console.log(vm.csvData);
    },

    async reloadChartData() {
      var data = [];
      data.push(this.nameTypeSelected);
      data.push(this.nameNarrationSelected);
      this.getOprationCostPerYear(data).then(() => {
        var totalCost = 0;
        for (let i = 0; i < this.oprationCostPerYear.length; i++) {
          totalCost += this.oprationCostPerYear[i].cost;
        }
        this.totalCostDescription = "Total Cost : " + totalCost + " Birr";
        this.drawCostSummaryChart();
      });
    },

    async uploadtoServer() {
      await this.uploadOperations(this.csvData).then((r) => {
        // eslint-disable-next-line no-console
        if (r) {
          this.$notify({
            type: "success",
            title: "Operational cost",
            message: `Operation Cost Registered from csv`,
          });
          // this.$router.push({
          //   name: "operational-cost-list"
          // });
          location.reload();
          this.csvDialog = true;
          this.csvDialog = false;
        } else {
          this.$notify({
            type: "danger",
            title: "Error",
            message: `Server Error, Could not upload your data please try again.`,
          });
          this.csvDialog = true;
          this.csvDialog = false;
        }
      });
    },

    async drawCostSummaryChart() {
      am4core.useTheme(am4themes_animated);

      // Create chart instance
      let chart = am4core.create("chartCostSum", am4charts.PieChart);

      // Add data
      chart.data = this.oprationCostPerYear;

      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "cost";
      pieSeries.dataFields.category = "month";
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;

      // This creates initial animation
      pieSeries.hiddenState.properties.opacity = 1;
      pieSeries.hiddenState.properties.endAngle = -90;
      pieSeries.hiddenState.properties.startAngle = -90;
    },
  },
};
</script>

<style scoped>
.rowbtn {
  display: flex;
  align-items: center;
  justify-content: space-around;
  float: right;
}
#mainView {
  display: flex;
}
#tableChartDiv {
  width: 80%;
}
#specification {
  width: 20%;
}

#chartDivMain {
  width: 100%;
}
#headerChart {
  margin-left: 2%;
  color: cadetblue;
}
#chartCostSum {
  width: 70%;
  height: 200px;
}
</style>