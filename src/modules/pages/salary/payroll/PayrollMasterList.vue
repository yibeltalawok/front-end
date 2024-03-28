<template>
  <div>
    <v-toolbar dense flat>
      <v-spacer />
      <v-btn
        small
        text
        class="primary white--text text-capitalize"
        @click="$router.push({ name: 'summary-sheet' })"
        >{{ $t("create-summary-sheet") }}</v-btn
      >
      <v-spacer />
      <v-btn
        small
        text
        class="primary white--text text-capitalize"
        @click="$router.push({ name: 'payroll-calculation' })"
        >{{ $t("payroll-calculation") }}</v-btn
      >
      <v-spacer />
      <v-btn
        small
        text
        class="primary white--text text-capitalize"
        @click="$router.push({ name: 'salary-sleep' })"
        >{{ $t("salary-slip") }}</v-btn
      >
      <v-spacer />
      <v-btn
        small
        text
        class="primary white--text text-capitalize"
        @click="$router.push({ name: 'finance-copy' })"
        >{{ $t("finance-copy") }}</v-btn
      >

      <v-spacer />
      <v-btn
        small
        text
        class="primary white--text text-capitalize"
        @click="show()"
        >{{ $t("total-work-day") }}</v-btn
      >
    </v-toolbar>
    <v-container grid-list-xs>
      <v-card outlined>
        <v-layout row wrap justify-center>
          <v-flex xs12 sm12 md3 lg3 pa-3>
            <h2 class="grey--text">{{ $t("payroll-master-list") }}</h2>
          </v-flex>
          <v-flex xs12 sm12 md4 lg4 pa-3>
            <v-text-field
              hide-details
              flat
              prepend-inner-icon="search"
              color="primary"
              dense
              solo-inverted
              rounded
              v-model="search"
              :label="$t('search') + ' ' + $t('payrol')"
            />
          </v-flex>
          <v-flex xs12 sm12 md5 lg5 pa-3>
            <div class="text-right">
              <v-btn
                outlined
                rounded
                color="primary"
                class="text-capitalize"
                @click="$router.push({ name: 'create-payroll-master' })"
                >{{ $t("addNew") }}</v-btn
              >
            </div>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-data-table
          :headers="headers"
          :rows-per-page="10"
          :loading="loading"
          :items="items"
          :search="search"
          item-key="id"
          footer-props.items-per-page-text="`${$t('master')} per page`"
        >
          <template slot="headerCell" slot-scope="props">
            <span class="table-header-text caption font-weight-bold">{{
              $t(props.header.text)
            }}</span>
          </template>
          <template v-slot:item.joiningDate="{ item }">
            <span>{{
              new Date(item.joiningDate).toLocaleDateString("en-US")
            }}</span>
          </template>
          <template v-slot:item.pensionDeduction="{ item }">
            <span>{{
              (parseFloat(item.employee.salary) * 0.07).toFixed(2)
            }}</span>
          </template>
          <template v-slot:item.pensionContribution="{ item }">
            <span>{{ parseFloat(item.employee.salary) * 0.11 }}</span>
          </template>
          <template v-slot:item.action="{ item }">
            <v-menu bottom left transition="slide-x-transition" offset-y>
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  rounded
                  small
                  v-on="on"
                  color="primary"
                  class="text-capitalize"
                  >{{ $t("clickHere") }}</v-btn
                >
              </template>

              <v-card>
                <v-card-text>
                  <v-btn
                    text
                    small
                    color="info"
                    class="text-capitalize"
                    @click="
                      $router.push({
                        name: 'payroll-master-info',
                        params: { payrollId: item.id }
                      })
                    "
                    >{{ $t("more_detail") }}</v-btn
                  >

                  <v-btn
                    text
                    small
                    color="primary"
                    class="text-capitalize"
                    @click="
                      $router.push({
                        name: 'update-payroll-master',
                        params: { payrollId: item.id }
                      })
                    "
                  >
                    <v-icon small>edit</v-icon>
                  </v-btn>

                  <v-btn
                    text
                    small
                    color="red"
                    class="text-capitalize"
                    @click="deleteItem(item.id, path)"
                  >
                    <v-icon small>delete</v-icon>
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-menu>
          </template>
        </v-data-table>
      </v-card>
      <!-- Rating Register-->
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <!-- <v-divider :inset="inset"></v-divider> -->
          <v-layout column justify-center align-center>
            <h2>{{ $t("total-working-days-of-current-date") }}</h2>
            <v-form @submit.prevent="save">
              <form-error-messages :messages="errorMessage" />
              <v-flex xs12 sm12 md12 lg12 pa-1>
                <v-text-field
                  :label="$t('total-work-day')"
                  v-model="value"
                  v-validate="'required'"
                  :error-messages="errors.collect('value')"
                  name="value"
                  outlined
                  dense
                />
              </v-flex>
              <v-flex xs12 sm12 md11 lg11>
                <div class="text-center">
                  <v-btn
                    rounded
                    outlined
                    block
                    color="primary"
                    class="text-capitalize"
                    @click="save"
                    >{{ $t("save") }}</v-btn
                  >
                </div>
              </v-flex>
            </v-form>
          </v-layout>
          <br />
        </v-card>
      </v-dialog>
      <!-- Line And Operator dialog -->
    </v-container>
  </div>
</template>


<script>
import { api, path } from "@/api";
import { tableMixin, csvDownloadSalaryMixin } from "@/shared/mixins";
export default {
  name: "PayrollList",
  mixins: [tableMixin, csvDownloadSalaryMixin],
  data() {
    return {
      search: "",
      component: "Payroll Master",
      ifNoData: "create-payroll-master",
      length: 0,
      filter: {
        include: ["employee"]
      },
      resource: api,
      resourceName: "User",
      searchField: "employee.idno",
      path: path.payroll,
      dialog: false,
      registred: false,
      errorMessage: null,
      value: "",
      day: {},
      headers: [
        {
          text: this.$t("idno"),
          value: "employee.idno",
          align: "center"
        },
        {
          text: this.$t("fullName"),
          value: "employee.fullName"
        },
        {
          text: this.$t("department"),
          value: "employee.department"
        },
        {
          text: this.$t("subDept"),
          value: "employee.subDept"
        },
        {
          text: this.$t("salary"),
          value: "employee.salary",
          align: "center"
        },
        {
          text: this.$t("pensionDeduction") + "(7%)",
          value: "pensionDeduction",
          align: "center"
        },
        {
          text: this.$t("pensionContribution") + "(11%)",
          value: "pensionContribution",
          align: "center"
        },
        {
          text: this.$t("action"),
          value: "action",
          sortable: false,
          align: "center"
        }
      ],
      camps: [
        {
          text: "Dashboard",
          disabled: false,
          to: "dasboard"
        },
        {
          text: "Salary",
          disabled: true
        },
        {
          text: "Payroll Master",
          disabled: true
        }
      ]
    };
  },
  methods: {
    show() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    async checkExists() {
      let d = new Date();
      let f = { where: { month: d.getMonth() + 1 } };
      this.day = (await api.all(path.workDay, f)).rows;
      if (this.day.length != 0) {
        alert("ok");
        this.registred = true;
      }
    },
    async save() {
      let date = new Date();
      let f = { where: { month: date.getMonth() + 1 } };
      this.day = (await api.all(path.workDay, f)).rows;
      this.$validator.validateAll().then(valid => {
        if (valid) {
          //  let d = new Date();
          if (this.day.length == 0) {
            this.day = {
              noDays: this.value,
              month: date.getMonth() + 1,
              date: date
            };
            api
              .create(this.day, path.workDay)
              .then(() => {
                this.day = {};
                this.$notify({
                  type: "success",
                  title: this.$t("Add Work Day"),
                  message: `${this.$t("New Wok Day is")} ${this.$t(
                    "registered Successfully"
                  )}`
                });
              })
              .catch(err => {
                this.showErrors(err);
              });
          } else {
            this.day = this.day[0];
            this.day = {
              date: new Date(),
              month: this.day.month,
              noDays: this.value,
              id: this.day.id
            };
            api
              .update(this.day, path.workDay)
              .then(() => {
                this.day = {};
                this.$notify({
                  type: "success",
                  title: this.$t("Update Work Day"),
                  message: `${this.$t("Wok Day is")} ${this.$t(
                    "registered Successfully changed!!"
                  )}`
                });
              })
              .catch(err => {
                this.showErrors(err);
              });
          }
        }
      });
    }
  }
};
</script>