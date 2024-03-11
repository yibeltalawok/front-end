<template>
  <div>
    <!--Today totat production pices and by whom make top five -->
    <v-card outlined>
      <div class="topListDiv" @click="todayProdationDiv()">
        <h4 class="titleMain">
          Today's production and top three operator!
        </h4>
        <v-spacer />
        <svgIcon v-if="isShowTop === false" name="arrowDown" />
        <svgIcon v-else name="arrowRigth" />
      </div>
      <div v-show="isShowTop">
        <div class="mainListTop">
          <v-spacer />
          <div class="topPices">
            <h1>{{ totalProduced }}</h1>
            <p>pices of productions</p>
          </div>
          <v-spacer />

          <div class="topEmployee">
            <div
              class="topEmplyeeDiv"
              v-for="person in clothProducedByWHo"
              :key="person"
            >
              <img :src="person[1]" />
              <label style="margin-left: 10px"
                >{{ person[0] }}({{ person[2] }})</label
              >
            </div>
          </div>
          <v-spacer />
        </div>
      </div>
    </v-card>
    <v-container grid-list-xs>
      <v-toolbar dense flat>
        <h3 class="titleMain">Assigned Production History List</h3>
        <v-spacer />
        <v-btn
          small
          class="hourlyReportBtn"
          color="#76bd7b"
          outlined
          @click="dialogHourlyReport = true"
          >Hourly Report</v-btn
        >
        <v-btn
          small
          class="addOpartion"
          color="#76bd7b"
          outlined
          @click="addOpration"
          >Add Production</v-btn
        >
      </v-toolbar>
      <v-fab-transition>
        <v-card flat outlined>
          <!--Table filter from database by date and by whole columon using search input -->
          <div style="display: flex">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search by Employee and Order..."
              single-line
              hide-details
            ></v-text-field>
            <v-spacer />
            <v-menu
              ref="menuList"
              v-model="menuList"
              :close-on-content-click="false"
              :return-value.sync="dateList"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <!--<svgIcon name="calendar"></svgIcon> -->
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  style="margin-top: 10px; margin-bottom: -19px"
                  outlined
                  dense
                  v-model="dateList"
                  label="Start Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="dateList"
                ><v-spacer />
                <v-btn text color="red" @click="menuList = false">Cancel</v-btn>
                <v-spacer />
                <v-btn
                  text
                  color="green"
                  @click="
                    $refs.menuList.save(dateList),
                      loadProductionHistoryHistory()
                  "
                  >Ok</v-btn
                >
              </v-date-picker>
            </v-menu>
          </div>

          <!--Please don't remove  this oone it makes tabel devider more beautiful  -->
          <v-divider />
          <v-divider />
          <v-divider />
          <v-divider />
          <v-divider />
          <v-divider />

          <v-data-table
            dense
            :headers="headers"
            :items="productionHistoryHistory"
            item-key="id"
            :search="search"
          >
            <template v-slot:item.action="{ item }">
              <span
                small
                @click="(idValueDelete = item.id), (dialogDelete = true)"
              >
                <svgIcon name="delete"></svgIcon>
              </span>
            </template>
          </v-data-table>
        </v-card>
      </v-fab-transition>

      <!-- Delete item / production history dialog -->
      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class="headline">Are you sure?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialogDelete = false"
              >Cancel</v-btn
            >
            <v-btn color="blue darken-1" text @click="deleteSingleProHis"
              >OK</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!--- Hourly production report dialog-->
      <v-dialog persistent v-model="dialogHourlyReport" max-width="500px">
        <v-card class="hourlyReportCard">
          <h2 class="headline">Hourly Production Report!</h2>

          <p style="margin-top: 20px">Date : {{ this.dateList }}</p>

          <v-autocomplete
            :items="[
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
            ]"
            v-model="selectedHourReport"
            label="Start hour of Production Ending hour *"
            required
          ></v-autocomplete>

          <div style="margin-left: 60%">
            <v-btn color="red darken-1" text @click="dialogHourlyReport = false"
              >Cancel</v-btn
            >
            <v-btn color="blue darken-1" text @click="hourlyReport()">OK</v-btn>
          </div>
        </v-card>
      </v-dialog>

      <!--Alert for add new production history -->
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-toolbar color="#76bd7b" dark
            >Add New Production Opration
          </v-toolbar>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" justify="center">
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="date"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="date"
                        label="Date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="date"
                      ><v-spacer />
                      <v-btn text color="red" @click="menu = false"
                        >Cancel</v-btn
                      >
                      <v-spacer />
                      <v-btn
                        text
                        color="green"
                        @click="
                          $refs.menu.save(date),
                            addOpration(),
                            reloadDialodProductionHistory()
                        "
                        >Ok</v-btn
                      >
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-autocomplete
                    :items="employeesOprationHistory"
                    item-text="fullname"
                    item-value="id"
                    v-model="selectedEmployee"
                    label="Employee / Worker*"
                    @change="operationDescription($event)"
                    required
                  ></v-autocomplete>
                </v-col>

                <v-row
                  v-if="this.operationDescriptionList.length > 0"
                  style="margin-left: 5%"
                >
                  <v-col cols="12" sm="4">
                    <strong> Operation : </strong>
                    {{ this.operationDescriptionList[0].opration }}
                  </v-col>

                  <v-col cols="12" sm="4">
                    <strong> Section : </strong>
                    {{ this.operationDescriptionList[0].section }}
                  </v-col>

                  <v-col cols="12" sm="4">
                    <strong> Line : </strong>
                    {{ this.operationDescriptionList[0].line }}
                  </v-col>

                  <v-col cols="12" sm="4">
                    <strong> Line per hour : </strong>
                    {{ this.operationDescriptionList[0].outputPerHourL }}
                  </v-col>

                  <v-col cols="12" sm="4">
                    <strong> Progress : </strong>
                    {{ this.operationDescriptionList[0].progress }}
                  </v-col>

                  <v-col cols="12" sm="4">
                    <strong> Amount Done : </strong>
                    {{ this.operationDescriptionList[0].amountDone }}
                  </v-col>
                </v-row>

                <v-row v-else> </v-row>

                <!-- Start time picker -->
                <v-col cols="12" sm="6">
                  <v-dialog
                    ref="dialogOne"
                    v-model="pickerOne"
                    :return-value.sync="timeOne"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="timeOne"
                        label="Start Time"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker v-model="timeOne">
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="pickerOne = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dialogOne.save(timeOne)"
                      >
                        OK
                      </v-btn>
                    </v-time-picker>
                  </v-dialog>
                </v-col>

                <!-- End time picker-->
                <v-col cols="12" sm="6">
                  <v-dialog
                    ref="dialogTwo"
                    v-model="pickerTwo"
                    :return-value.sync="timeTwo"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="timeTwo"
                        label="End Time"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker v-model="timeTwo">
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="pickerTwo = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dialogTwo.save(timeTwo)"
                      >
                        OK
                      </v-btn>
                    </v-time-picker>
                  </v-dialog>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-autocomplete
                    :items="ordersOprationHistory"
                    item-text="orderDescription"
                    item-value="id"
                    label="Order*"
                    v-model="selectedOrder"
                    required
                    @change="selectOrder($event)"
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-autocomplete
                    :items="bundlesOprationHistory"
                    item-text="bundleDescription"
                    item-value="id"
                    v-model="selectedBunddles"
                    label="Bunddle Number"
                    multiple
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
            <h4 style="margin-left: 30%; color: red">
              {{ this.messageInputValidation }}
            </h4>
          </v-card-text>
          <v-card-actions>
            <v-btn
              small
              color="red"
              style="width: 30%"
              outlined
              @click="dialog = false"
            >
              Close
            </v-btn>
            <v-spacer />
            <v-btn
              small
              color="#76bd7b"
              style="width: 30%"
              outlined
              @click="saveNewOpration"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import svgIcon from "../../layout/Icon";

export default {
  components: {
    svgIcon,
  },
  mounted() {
    this.loadProductionHistoryHistory();
    this.getClothProducedByWHo();
  },
  computed: {
    ...mapState("order", [
      "ordersOprationHistory",
      "bundlesOprationHistory",
      "employeesOprationHistory",
      "operationDescriptionList",
    ]),
    ...mapState("productionHistory", [
      "productionHistory",
      "productionHistoryHistory",
      "hourlyProductionReport",
      "clothProducedByWHo",
      "totalProduced",
    ]),
  },
  methods: {
    ...mapActions("order", [
      "getOrdersOpration",
      "getBundles",
      "getEmployees",
      "getOperationDescription",
    ]),
    ...mapActions("productionHistory", [
      "processProductionHistory",
      "getProductionHistoryHistory",
      "deleteSingleProductionHistory",
      "getHourlyProductionReport",
      "getClothProducedByWHo",
    ]),

    async todayProdationDiv() {
      if (this.isShowTop === true) this.isShowTop = false;
      else this.isShowTop = true;
    },

    async deleteSingleProHis() {
      this.dialogDelete = false;
      //Used to delete single production history, InnerMethod used to refresh the table after delete.
      this.deleteSingleProductionHistory(this.idValueDelete).then(() => {
        this.loadProductionHistoryHistory();
      });
    },

    async loadProductionHistoryHistory() {
      //filter production history by date
      this.getProductionHistoryHistory(this.dateList);
    },

    async operationDescription(jobId) {
      this.getOperationDescription(jobId);
    },

    async selectOrder(orderId) {
      this.getBundles(orderId);
    },

    async timeToNumberConverter(tc) {
      if (tc.charAt(0) === "0")
        tc = tc.charAt(1) + "." + tc.charAt(3) + tc.charAt(4);
      else tc = tc.charAt(0) + tc.charAt(1) + "." + tc.charAt(3) + tc.charAt(4);

      return tc;
    },

    async saveNewOpration() {
      //Used to get today date in yyyy-mm-dd format
      var dateToady = new Date();
      var year = dateToady.getFullYear();
      var month = dateToady.getMonth() + 1;
      var date = dateToady.getDate();

      if (month < 10) month = "0" + month;
      if (date < 10) date = "0" + date;
      dateToady = [year, month, date].join("-");

      //Used to validate all input failed or not
      if (
        this.timeOne === null ||
        this.timeTwo === null ||
        this.selectedBunddles.length === 0 ||
        this.selectedEmployee.length === 0
      ) {
        this.messageInputValidation = "All input value must be filled!";
      } else {
        // Used to manage/organized data insert to productionHistory model
        for (let i = 0; i < this.selectedBunddles.length; i++) {
          this.proHisData.employeeId = this.operationDescriptionList[0].employeeId;
          this.proHisData.jobId = this.selectedEmployee; //This one is job id used to related employee
          this.proHisData.operationId = this.operationDescriptionList[0].operationId;
          this.proHisData.orderId = this.selectedOrder;
          this.proHisData.scannedOrderStatusId = this.selectedBunddles[i];

          this.proHisData.from = await this.timeToNumberConverter(this.timeOne);
          this.proHisData.to = await this.timeToNumberConverter(this.timeTwo);
          this.proHisData.date = dateToady;

          //Start proccsing based on the data
          await this.processProductionHistory(this.proHisData);
        }
        //used to reload table
        this.loadProductionHistoryHistory();
        this.dialog = false;

        //Used to reset counter and input data
        this.date = new Date().toISOString().substr(0, 10);

        this.reloadDialodProductionHistory();
      }
    },

    async reloadDialodProductionHistory() {
      //reload job and opertion detailed description
      this.operationDescription("");
      this.timeOne = null;
      this.timeTwo = null;
      this.selectedEmployee = [];
      this.selectedOrder = [];
      this.selectedBunddles = [];
      this.messageInputValidation = "";
    },

    async addOpration() {
      this.getOrdersOpration();
      this.getEmployees(this.date);
      this.dialog = true;
    },

    async dataToCsv(data) {
      const csvRows = [];
      const headers = Object.keys(data[0]);
      csvRows.push(headers.join(","));

      for (const row of data) {
        const values = headers.map((header) => {
          const escape = ("" + row[header]).replace(/"/g, '\\"');
          return `"${escape}"`;
        });
        csvRows.push(values.join(","));
      }
      return csvRows.join("\n");
    },

    async downloadCsvData(data) {
      const blob = new Blob([data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute(
        "download",
        "Date-" +
          this.dateList +
          "-start hour-" +
          this.selectedHourReport +
          ".csv"
      );
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },

    async hourlyReport() {
      if (this.selectedHourReport.length > 0) {
        this.dialogHourlyReport = false;
        await this.getHourlyProductionReport([
          this.dateList,
          this.selectedHourReport,
        ]);

        if (this.hourlyProductionReport.length > 0) {
          const csvData = await Promise.resolve(
            this.dataToCsv(this.hourlyProductionReport)
          );
          this.downloadCsvData(csvData);
          this.hourlyProductionReport = [];
        } else {
          this.$notify({
            type: "danger",
            title: "Error!",
            message: "No data in your selection!",
          });
        }
      }
    },
  },
  data() {
    return {
      //date picker in dialog add new prodution history
      date: new Date().toISOString().substr(0, 10),
      menu: false,

      //date picker in dialog filter prodution history
      dateList: new Date().toISOString().substr(0, 10),
      menuList: false,

      //delete single production history id value holder and dialog
      idValueDelete: "",
      dialogDelete: false,

      // Table filteration based on whole columon
      search: "",

      //hourly production report dialog
      dialogHourlyReport: false,

      selectedHourReport: "",

      // used to top list show hide
      isShowTop: true,

      dialog: false,
      timeOne: null,
      pickerOne: false,
      timeTwo: null,
      pickerTwo: false,
      selectedEmployee: [],
      selectedOrder: [],
      selectedBunddles: [],
      proHisData: {},
      messageInputValidation: "",
      headers: [
        {
          text: "Employee Name",
          align: "start",
          //sortable: false,
          value: "fullname",
        },
        { text: "Order", value: "order" },
        { text: "B.Q#", filterable: false, value: "bundleQua" },
        { text: "Bundle#", filterable: false, value: "bundle" },
        { text: "Start Time", filterable: false, value: "startTime" },
        { text: "EndTime", filterable: false, value: "endTime" },
        { text: "Line#", filterable: false, value: "line" },
        { text: "Operation", filterable: false, value: "operation" },
        { text: "Section", filterable: false, value: "section" },
        { text: "Action", filterable: false, value: "action", sortable: false },
      ],
    };
  },
};
</script>

<style>
.addOpartion,
.hourlyReportBtn {
  margin-right: 20px;
}

.hourlyReportCard {
  padding: 20px;
}

.titleMain {
  color: rgb(192, 186, 186);
}

.topListDiv {
  display: flex;
  margin: 2%;
}

.mainListTop {
  display: flex;
  margin-top: -3%;
}

.topPices {
  display: flex;
  align-items: center;
  color: #76bd7b;
}

.topPices h1 {
  font-size: 90px;
}
.topPices p {
  margin-top: 25%;
}

.topEmployee {
  margin: 1%;
}

.topEmplyeeDiv {
  width: 150%;
  height: 40px;
  display: flex;
  align-items: center;
  margin: 3%;
  border: 1px solid white;
  box-shadow: 1px 1px 3px 0px rgba(124, 224, 129, 0.9);
  border-radius: 20px;
}

.topEmplyeeDiv:hover {
  width: 150%;
  height: 50px;
  display: flex;
  align-items: center;
  margin: 2%;
  font-weight: bold;
  color: green;
  background-color: #acf4ac;
  border: 1px solid white;
  box-shadow: 1px 1px 3px 0px rgba(62, 194, 68, 0.9);
  border-radius: 40px;
}

.topEmplyeeDiv img {
  border-radius: 20px;
  width: 40px;
  height: 40px;
}

.topEmplyeeDiv:hover img {
  border-radius: 50px;
  width: 48px;
  height: 48px;
  box-shadow: 1px 1px 3px 0px rgba(141, 134, 134, 0.9);
  transform: rotate(-20deg);
}
</style>