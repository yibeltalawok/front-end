
<template>
  <div>
    <v-container grid-list-xs fluid>
      <v-card outlined style="border-radius: 12px">

        <v-toolbar dense flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="$router.push({ name: 'operational-cost-list' })"
          >
            <v-icon class="mx-1">arrow_back</v-icon>
            {{ $t("go_back") }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            text
            small
            outlined
            color="amber"
            class="text-capitalize"
            @click="createSamHistory"
          >
            {{ $t("addNew") }}</v-btn
          >
        </v-toolbar>
        <v-divider></v-divider>

        <v-layout row wrap justify-center>
          <v-flex xs12 sm12 md4 lg4 pa-3>{{ $t("cost-per-SAM") }}</v-flex>

          <v-flex xs12 sm12 md4 lg4 pa-3>
            <v-text-field
              :label="$t('filter-by-date')"
              placeholder="YYYY-MM"
              dense
              outlined
              hide-details
              v-model="date"
              v-validate="'required'"
              type="month"
              @input="filterByDate(date)"
            />
          </v-flex>

          <v-flex xs12 sm12 md4 lg4 pa-3 v-if="costPerSam.length > 0">
            <div class="text-right">
              <v-btn
                text
                small
                outlined
                :disabled="isSaving"
                color="white"
                class="text--white green text-capitalize"
                @click="createSummary()"
              >
                <v-progress-circular
                  v-if="saving"
                  class="mr-1"
                  indeterminate
                  size="35"
                  :value="20"
                  color="blue"
                />
                {{ $t("create-history") }}
              </v-btn>
            </div>
          </v-flex>
        </v-layout>


        <v-data-table
        :headers="headers"
        :items="this.samHistories"
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
        </v-data-table>
      </v-card>

      <!-- //////// THE DIALOG ///////////////// -->
      <v-row justify="center">
        <v-dialog
          v-model="dialog"
          persistent
          max-width="700px"
        >
          <v-card wrap outlined style="border-radius:1px">
            
            <v-app-bar
            color="amber"
            >
              <v-card-subtitle>
                <span style="color: white">Add Cost Per SAM</span>
              </v-card-subtitle>

              <v-spacer />
              
              <v-btn
                icon
                dark
                @click="dialog = false"
                color="red"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>

            </v-app-bar>

            <v-card-text>
              <v-form @submit.prevent="save" ref="form" lazy-validation>
                <v-layout row justify-center my-3>
                  
                  <v-flex xs12 sm12 md12 lg12 pa-2>
                    <v-layout column wrap justify-center my-3>

                      <v-flex xs12 sm7 md7 lg7 pa-3>
                        <template>
                          <v-row>
                            <v-col>
                              <v-menu
                                ref="menu"
                                v-model="menu"
                                :close-on-content-click="false"
                                :return-value.sync="date"
                                transition="scale-transition"
                                offset-y
                                max-width="290px"
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
                                <v-date-picker
                                  v-model="date"
                                  type="month"
                                  color="amber"
                                  no-title
                                  scrollable
                                >
                                  <v-spacer></v-spacer>
                                  <v-btn
                                    text
                                    color="primary"
                                    @click="menu = false"
                                  >
                                    Cancel
                                  </v-btn>
                                  <v-btn
                                    text
                                    color="primary"
                                    @click="$refs.menu.save(date), getTotalMin(date), checkByDate(date)"
                                  >
                                    OK
                                  </v-btn>
                                </v-date-picker>
                              </v-menu>
                            </v-col>
                          </v-row>
                        </template>
                      </v-flex>

                      <v-flex xs12 sm12 md12 lg12 pa-2 v-if="this.cpsamhistory.length > 0">
                        <v-data-table
                        :headers="headers"
                        :items="this.cpsamhistory"
                        :hide-default-footer="true"
                        disable-pagination
                        item-key="id"
                        >
                        <template v-slot:item.date="{ item }">{{
                          new Date(item.date).toLocaleDateString("en-US")
                        }}</template>

                        </v-data-table>
                      </v-flex>


                      <v-flex xs12 sm7 md7 lg7 pa-2 mt-10>
                        <v-row>

                          <v-flex xs12 sm4 md4 lg4 pa-2>
                            <h4>TotalMinsProduced: {{ this.totalMinutes }}</h4>
                          </v-flex>

                        <v-flex xs12 sm4 md4 lg4 pa-2 style="margin-bottom: 5px">
                          <h4>TotalCost: {{this.totalCost}}</h4>
                        </v-flex>
                        <v-flex xs12 sm4 md4 lg4 pa-2>
                          <h4>Cost Per Sam: {{ this.sam }}</h4>
                        </v-flex>

                        </v-row>
                        

                      <!-- TotalAmountDone: {{ this.totalAmount }} <br> -->
                      
                      </v-flex>

                      
                        
                    </v-layout>
                  </v-flex>

                </v-layout>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-btn 
              class="mr-2"
                small
                color="red"
                text
                @click="dialog = false"
              >
                Cancel
              </v-btn>

              <v-spacer></v-spacer>

                <div v-if="this.cpsamhistory.length > 0">
                  <v-btn
                    small
                    color="amber"
                    text
                    @click="update()"
                  >
                    {{ $t("update") }}
                  </v-btn>

                </div>
                <div v-if="this.cpsamhistory.length == 0">
                  <v-btn
                    small
                    color="amber"
                    text
                    @click="save()"
                  >
                    {{ $t("save") }}
                  </v-btn>

                </div>

              

              
            </v-card-actions>
          </v-card>

        </v-dialog>
      </v-row>

      

    </v-container>
  </div>
</template>

<script>
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { api, path } from "@/api";
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  name: "OperationalCostList",
  data() {
    return {
      isSaving: false,
      saving: false,
      path: path.costPerSamList,
      resourceName: "Operational Cost per sam",
      costPerSam: [],
      dialog: false,
      monthFromDate: '',
      yearFromDate: '',
      sam: '',
      selectdDate: '',
      headers: [
        {
          text: this.$t("dateRecorded"),
          value: "date",
        },
        {
          text: this.$t("month"),
          value: "month",
        },
        {
          text: this.$t("year"),
          value: "year",
        },
        {
          text: this.$t("totalMinProduced"),
          value: "totalMinuteProduced",
        },
        {
          text: this.$t("operationalCost"),
          value: "operationalCost",
        },
        {
          text: this.$t("cost-per-SAM"),
          value: "costPerSam",
        },
      ],

      date: new Date(),
      modal: false,
      totalSamProduced: 0,
      samSummary: {},
      month: "",
      year: "",
    };
  },
  async created() {
    let d = new Date();
    this.loadData(d);
    await this.getCostPerSamHistory();
  },

  computed: {
    ...mapState("cost", ["totalMinutes","totalAmount", "totalCost", "samHistories", "cpsamhistory", "cpsamId"]),
  },
  methods: {
    // ...mapMutations("cost", ["pushOpIds"]),
    ...mapActions("cost", ["getTotalMinsProduced","getOperationCost", "createCostPerSamHistory", "getCostPerSamHistory", "fetchSamHistoryByDate", 
      "getCPSamHistoryByDate", "updateCostPerSamHistory", "getIdOfCPSamHistory"]),

    createSamHistory(){
      this.dialog = true;
    },

    async getTotalMin(date){
      this.selectdDate = date;

      console.log("SELECTED DATE: "+this.selectdDate)

      this.yearFromDate = date.substr(0, 4);
      this.monthFromDate = date.substr(5, 7);
      
      await this.getTotalMinsProduced(date).then(() =>{
        // console.log(res)
        // console.log("RESPONSE: " + this.totalAmount);
        // console.log("RESPONSE: " + this.totalMinutes);
        this.getOperationCost(date).then(() =>{
          // console.log("RES: "+this.totalCost);

          // if(this.totalAmount != 0){
          //   this.sam = this.totalCost/this.totalAmount;
          // }
          if(this.totalMinutes != 0){
            this.sam = this.totalCost/this.totalMinutes;
          }
          else{
            this.sam = 0;
          }
        })
                
      });
    },

    async checkByDate(date){
      let year = date.substr(0, 4);
      let month = date.substr(5, 7);
      await this.getCPSamHistoryByDate([month, year]);
    },

    async filterByDate(date){
      let year = date.substr(0, 4);
      let month = date.substr(5, 7);
      this.fetchSamHistoryByDate([month, year]);
    },

    save(){
      // check if date is selected.
      if(this.selectdDate){
        if(this.cpsamhistory.length == 0){
          // already registered... no duplicate sams ...
          let dt = new Date();
          // alert(dt);
          // alert(this.yearFromDate);
          let cpsh = {
            date: this.selectdDate,
            month: this.monthFromDate,
            year: this.yearFromDate,
            totalMinuteProduced: this.totalMinutes,
            operationalCost: this.totalCost,
            costPerSam: this.sam
          };

          this.createCostPerSamHistory(cpsh).then(() =>{
            this.dialog = false;
            this.getCostPerSamHistory();
            this.$notify({
                type: "success",
                title: "Cost Per Sam History",
                message: `Cost Per SAM History created successfully.`
            });
          })
        }
        

        // console.log(cpsh);
      }
      else{
        this.$notify({
              type: "danger",
              title: "Cost Per Sam History",
              message: `Please select a date.`
          });
      }
      
    },

    async update(){
      // check if date is selected.
      if(this.selectdDate){
        // already registered... no duplicate sams ...
        let dt = new Date();

        let year = this.selectdDate.substr(0, 4);
        let month = this.selectdDate.substr(5, 7);
        // alert(dt);
        // alert(this.yearFromDate);

        // get the id of the cost per sam history to be updated.
        await this.getIdOfCPSamHistory([month, year]).then(() =>{

          let cpsh = {
            id: this.cpsamId,
            date: this.selectdDate,
            month: this.monthFromDate,
            year: this.yearFromDate,
            totalMinuteProduced: this.totalMinutes,
            operationalCost: this.totalCost,
            costPerSam: this.sam
          };

          this.updateCostPerSamHistory(cpsh).then(() =>{
            this.dialog = false;
            this.getCostPerSamHistory();
            this.$notify({
                type: "success",
                title: "Cost Per Sam History",
                message: `Cost Per SAM History Updated successfully.`
            });
            
          })

        })

        // console.log(cpsh);
      }
    },

    async loadData(date) {
      this.modal = false;
      let d = new Date(date);
      this.date = d.toISOString().substr(0, 7);
      this.month = d.getMonth() + 1;
      this.year = d.getFullYear();
      let temVal = [];
      this.costPerSam = [];
      await api
        .create({ month: this.month, year: this.year }, this.path)
        .then((item) => {
          temVal = item;
        });
      this.costPerSam = temVal;
      this.totalSamProduced = this.costPerSam.reduce(
        (acc, val) => acc + parseFloat(val.producedSam),
        0
      );
    },
    async createSummary() {
      this.isSaving = true;
      this.saving = true;
      // alert(this.date);
      let mon = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      // let date = new Date();
      let fc = { where: { month: this.month, year: this.year } };
      let check = (await api.all(path.costPerSam, fc)).rows;
      if (check.length == 0) {
        let cps = (
          parseFloat(this.costPerSam[0].totalCost) /
          parseFloat(this.totalSamProduced)
        ).toFixed(2);

        let date = new Date();
        date.setMonth(this.month - 1);
        this.samSummary = {
          date: date,
          day: new Date(this.date).getDate(),
          month: this.month,
          mName: mon[parseInt(this.month) - 1],
          year: new Date(this.date).getFullYear(),
          totalSamProduced: this.totalSamProduced,
          operationalCost: this.costPerSam[0].totalCost,
          costPerSam: cps,
        };
        api
          .create(this.samSummary, path.costPerSam)
          .then(() => {
            this.isSaving = false;
            this.saving = false;
            this.$notify({
              type: "success",
              title: "Create History",
              message: `SAM history is successfully created!.`,
            });
          })
          .catch((err) => {
            this.showErrors(err);
          });
      } else {
        for (const iterator of check) {
          let cps = (
            parseFloat(this.costPerSam[0].totalCost) /
            parseFloat(this.totalSamProduced)
          ).toFixed(2);
          let date = new Date();
          date.setMonth(this.month - 1);
          // alert(date);
          // alert(this.month);
          this.samSummary = {
            id: iterator.id,
            date: date,
            day: new Date(this.date).getDate(),
            month: this.month,
            mName: mon[this.month - 1],
            year: new Date(this.date).getFullYear(),
            totalSamProduced: parseFloat(this.totalSamProduced).toFixed(2),
            operationalCost: this.costPerSam[0].totalCost,
            costPerSam: cps,
          };
          api
            .update(this.samSummary, path.costPerSam)
            .then(() => {
              this.isSaving = false;
              this.saving = false;
              this.samSummary = {};
              this.$notify({
                type: "success",
                title: "Update History",
                message: `${this.$t("Cost per sam history")} ${this.$t(
                  "information  successfully changed"
                )}`,
              });
            })
            .catch((err) => {
              this.showErrors(err);
            });
        }
      }
    },
  },
};
</script>
