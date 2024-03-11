<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:13px">
        <v-toolbar dense flat>
          <v-btn
            text
            class="text-capitalize"
            @click="$router.push({ name: 'incentive-list' })"
          >
            <v-icon class="mx-3">mdi-chevron-left</v-icon>{{ $t("go_back") }}
          </v-btn>
          <v-spacer />
          <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </v-toolbar>
        <v-layout justify-center row>
          <v-flex xs12 sm12 md10 lg10 pa-2>
            <v-card outlined height="100%">
              <v-card-text>
                <v-form @submit.prevent="save">
                  <form-error-messages :messages="errorMessage" />
                  <v-layout row wrap justify-center>
                    <v-flex xs12 sm12 md5 lg5 pa-1>
                      <v-autocomplete
                        :label="$t('select-order')"
                        :items="orders"
                        :filter="customFilter"
                        item-text="orderNumber"
                        item-value="id"
                        v-validate="'required'"
                        v-model="orderId"
                        :error-messages="errors.collect('orders')"
                        name="styles"
                        color="blue-grey lighten-2"
                        outlined
                        dense
                        @input="getSelectedOrder"
                      />
                    </v-flex>
                    <v-flex xs12 sm12 md5 lg5 pa-1>
                      <v-text-field
                        v-validate="'required'"
                        v-model="dailyTarget"
                        :error-messages="errors.collect('target')"
                        :label="$t('targetPerDay')"
                        name="target"
                        outlined
                        dense
                        type="number"
                        min="1"
                      />
                    </v-flex>
                    <v-flex xs12 sm12 md5 lg5 pa-1>
                      <v-text-field
                        v-validate="'required'"
                        v-model="produced"
                        :error-messages="errors.collect('producedOrder')"
                        :label="$t('producedOrder')"
                        name="producedOrder"
                        outlined
                        dense
                        type="number"
                        min="1"
                      />
                    </v-flex>
                    <v-flex xs12 sm12 md5 lg5 pa-1>
                      <v-autocomplete
                        :label="$t('line-number')"
                        :items="jobs"
                        :filter="customFilter"
                        item-text="line"
                        item-value="line"
                        v-validate="'required'"
                        v-model="line"
                        :error-messages="errors.collect('styles')"
                        name="styles"
                        color="blue-grey lighten-2"
                        outlined
                        dense
                        @input="getJobId(line)"
                      />
                    </v-flex>
                    <v-flex xs12 md4 lg4 pa-1>
                      <v-btn
                        outlined
                        rounded
                        block
                        color="primary"
                        class="text-capitalize"
                        @click="save"
                        >{{ $t("save") }}</v-btn
                      >
                    </v-flex>
                  </v-layout>
                </v-form>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import { api, path } from "@/api";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      // item: [],
      orderId: "",
      selectedOrder: {},
      jobs: [],
      jobId: [],
      employeeId: [],
      jobIds: [],
      errorMessage: "",
      errMessage: "",
      totalPerformance: 0,
      lineId: "",
      dailyTarget: "",
      incentiveItem: "",
      samValue: 0,
      extraPieceMinute: 0
    };
  },
  computed: {
    ...mapState("SelectItem", ["orders"])
  },
  async created() {
    this.orderItem();
    this.filterJobs();
  },

  methods: {
    ...mapActions("SelectItem", ["orderItem"]),
    ...mapActions("inventory", ["postData", "updateData"]),
    async filterJobs() {
      let fj = { where: { done: "0" } };
      this.jobs = (await api.all(path.job, fj)).rows;
    },
    async getJobId(line) {
      this.date = new Date().toISOString();
      this.line = line;
      this.employeeId = [];
      this.jobIds = [];
      let filterJobId = { where: { line: line, done: "0" } };
      this.jobId = (await api.all(path.job, filterJobId)).rows;
      this.jobIds = this.jobId.map(x => x.id);
      this.employeeId = this.jobId.map(x => x.employeeId);
      for (const iterator of this.jobId) {
        this.totalPerformance =
          this.totalPerformance + parseFloat(iterator.perf);
      }

      let filterLine = { where: { number: line } };
      this.lines = (await api.all(path.line, filterLine)).rows;
      for (const iterator of this.lines) {
        this.lineId = iterator.id;
      }
    },
    async getSelectedOrder(val) {
      this.orderId = val;
      this.selectedOrder = await api.get(this.orderId, path.order);
      this.calculateSamValue(val);
    },
    async calculateSamValue(val) {
      let filterStyleNumber = {
        where: { orderId: val }
      };

      let opr = (await api.all(path.oprBltn, filterStyleNumber)).rows;
      if (opr.length > 0) {
        for (const iterator of opr) {
          this.oprBltnId = iterator.id;
        }
        let f = {
          where: {
            oprBltnId: this.oprBltnId
          }
        };

        // fetch operations
        let operations = (await api.all(path.operation, f)).rows;
        if (operations.length > 0) {
          this.samValue = 0;
          for (const iterator of operations) {
            this.samValue = parseFloat(iterator.sam) + this.samValue;
          }
          this.samValue = this.samValue.toFixed(2);
        } else {
          this.$notify({
            type: "danger",
            title: "Empty Style",
            message: `Please Register operation first `
          });

          this.$router.push({ name: "ob" });
        }
      } else {
        this.$notify({
          type: "danger",
          title: "Style Not found",
          message: `Sorry you does not have order in the Style list `
        });

        this.$router.push({ name: "ob" });
      }
    },
    save() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          this.errorMessage = null;
          this.errMessage = "";
          if (
            parseInt(this.selectedOrder.quantity) >=
            parseInt(this.selectedOrder.producedOrder) + parseInt(this.produced)
          ) {
            this.selectedOrder.producedOrder =
              parseInt(this.selectedOrder.producedOrder) +
              parseInt(this.produced);
            var currentDate = new Date();

            let extraPiece =
              parseInt(this.produced) - parseInt(this.dailyTarget);
            this.extraPieceMinute =
              parseInt(extraPiece) * parseFloat(this.samValue);
            this.incentiveItem = {
              productionDate: currentDate,
              day: currentDate.getDate(),
              month: parseInt(currentDate.getMonth()) + 1,
              year: currentDate.getFullYear(),
              extraPieceMinute: this.extraPieceMinute,
              targetPerDay: this.dailyTarget,
              extraPerDay: extraPiece,
              totalPerformance: this.totalPerformance,
              lineId: this.lineId,
              line: this.line,
              employeeId: this.employeeId,
              jobId: this.jobIds,
              orderId: this.orderId
            };
            // ==============================Generate Incentive for Produced Order================================
            this.postData([this.incentiveItem, path.incentive])
              //  api
              //     .create(this.incentiveItem, path.incentive)
              .then(() => {
                this.incentiveItem = {};
                //==============================Update Produced Order================================
                this.updateData([this.selectedOrder, path.order])
                  //  api
                  //     .update(this.selectedOrder, path.order)
                  .then(() => {
                    this.selectedOrder = {};
                    //     ==============================Update Job================================

                    for (const iterator of this.jobId) {
                      iterator.done = "1";
                      api
                        .update(iterator, path.job)
                        .then(() => {
                          this.$notify({
                            type: "success",
                            title: "Create Incentive",
                            message: `Incentive is created successfully.`
                          });
                        })
                        .catch(err => {
                          this.showErrors(err);
                        });
                    }
                    this.$router.push({ name: "incentive-list" });
                  })
                  .catch(err => {
                    this.showErrors(err);
                  });
              })
              .catch(err => {
                this.showErrors(err);
              });
          } else {
            this.$notify({
              type: "danger",
              title: "Invalid input",
              message: `Total produced Can not be greater than Order Quantity!`
            });
          }
        }
      });
    }
  }
};
</script>
