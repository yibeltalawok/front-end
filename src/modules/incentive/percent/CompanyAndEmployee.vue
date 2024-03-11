<template>
  <div>
    <v-toolbar dense flat class="primary">
      <v-layout justify-center>
        <h1 class="white--text">{{ $t("distribute-incentive") }}</h1>
      </v-layout>
    </v-toolbar>

    <v-container grid-list-xs>
      <v-card>
        <v-divider :inset="inset"></v-divider>
        <v-layout row justify-center align-center>
          <v-form @submit.prevent="save">
            <form-error-messages :messages="errorMessage" />
            <br />
            <v-layout row justify-center align-center>
              <v-flex xs12 sm12 md12 lg12 pa-2>
                <v-autocomplete
                  :label="$t('select-month')"
                  v-model="item.month"
                  :items="months"
                  item-text="month"
                  item-value="number"
                  outlined
                  dense
                  @input="searchShare(item.month)"
                />
              </v-flex>
              <v-flex xs12 sm12 md6 lg6 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="item.forCompany"
                  :error-messages="errors.collect('target')"
                  :label="$t('forCompany')"
                  name="target"
                  outlined
                  dense
                  type="number"
                  min="0"
                  @input="culculateForEmployee(item.forCompany)"
                />
              </v-flex>
              <v-flex xs12 sm12 md6 lg6 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="item.forEmployee"
                  :error-messages="errors.collect('target')"
                  :label="$t('forEmployee')"
                  name="target"
                  outlined
                  dense
                  type="number"
                  min="1"
                  @input="culculateForCompany(item.forEmployee)"
                />
              </v-flex>
              <v-flex xs12 sm12 md6 lg6 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="item.forLine"
                  :error-messages="errors.collect('target')"
                  :label="$t('forLine')"
                  name="target"
                  outlined
                  dense
                  type="number"
                  min="0"
                  @input="culculateForOperator(item.forLine)"
                />
              </v-flex>
              <v-flex xs12 sm12 md6 lg6 pa-2>
                <v-text-field
                  v-validate="'required'"
                  v-model="item.forOperator"
                  :error-messages="errors.collect('target')"
                  :label="$t('forOperator')"
                  name="target"
                  outlined
                  dense
                  type="number"
                  min="1"
                  @input="culculateforLine(item.forOperator)"
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
                  <br />
                  <br />
                </div>
              </v-flex>
            </v-layout>
          </v-form>
        </v-layout>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { api, path } from "@/api";
import AccountService from "@/shared/services";
import { tableMixin, printMixin, csvDownloadMixin } from "@/shared/mixins";
//import QrcodeVue from "qrcode.vue";
export default {
  name: "Incentive",
  mixins: [tableMixin, printMixin, csvDownloadMixin],
  data() {
    return {
      resourceName: "Incentive",
      item: {},
      roleItem: {},
      filter: { include: ["line", "sam"] },
      user: AccountService.getProfile(),
      errMessage: "",
      resource: api,
      path: path.incentive,
      camps: [
        {
          text: "Dashboard",
          disabled: false,
          to: "dasboard"
        },
        {
          text: "Incentive",
          disabled: false,
          to: "/app/incentive/list"
        },
        {
          text: "Incentive Informaiton",
          disabled: true
        }
      ],
      incentiveId: "",
      selectedMonth: "",
      months: [
        { month: "January", number: "1" },
        { month: "February", number: "2" },
        { month: "March", number: "3" },
        { month: "April", number: "4" },
        { month: "May", number: "5" },
        { month: "June", number: "6" },
        { month: "July", number: "7" },
        { month: "August", number: "8" },
        { month: "September", number: "9" },
        { month: "October", number: "10" },
        { month: "November", number: "11" },
        { month: "December", number: "12" }
      ],
      exist: false
    };
  },
  components: {},

  methods: {
    culculateForEmployee(forCompany) {
      if (parseFloat(forCompany) > 100 || parseFloat(forCompany) < 0) {
        this.item.forEmployee = "";
        this.item.forCompany = "";
        alert("Invalid Input");
      } else {
        this.item.forEmployee = 100 - parseFloat(forCompany);
      }
    },
    culculateForCompany(forEmployee) {
      if (parseFloat(forEmployee) > 100 || parseFloat(forEmployee) < 0) {
        this.item.forEmployee = "";
        this.item.forCompany = "";
        alert("Invalid Input");
      } else {
        this.item.forCompany = 100 - parseFloat(forEmployee);
      }
    },
    culculateForOperator(forLine) {
      if (parseFloat(forLine) > 100 || parseFloat(forLine) < 0) {
        this.item.forOperator = "";
        this.item.forLine = "";
        alert("Invalid Input");
      } else {
        this.item.forOperator = 100 - parseFloat(forLine);
      }
    },
    culculateforLine(forOperator) {
      if (parseFloat(forOperator) > 100 || parseFloat(forOperator) < 0) {
        this.item.forOperator = "";
        this.item.forLine = "";
        alert("Invalid Input");
      } else {
        this.item.forLine = 100 - parseFloat(forOperator);
      }
    },
    async searchShare(month) {
      let date = new Date();
      this.item.year = date.getFullYear();
      this.item.day = date.getDate();
      let f = { where: { month: month, year: this.item.year } };
      let share = (await api.all(path.incentiveShare, f)).rows;
      if (share.length == 0) {
        this.exist = false;
      } else {
        this.exist = true;
        for (const iterator of share) {
          this.item.id = iterator.id;
        }
      }
    },
    save() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          if (!this.exist) {
            api
              .create(this.item, path.incentiveShare)
              .then(() => {
                this.errMessage = "";
                this.item = {};
                this.$notify({
                  type: "success",
                  title: "Register Share",
                  message: `${this.$t("New ")} ${this.$t(
                    " information is successfully created"
                  )}`
                });
              })
              .catch(err => {
                this.showErrors(err);
              });
          } else {
            api
              .update(this.item, path.incentiveShare)
              .then(() => {
                this.item = {};
                this.$notify({
                  type: "success",
                  title: "Update Share",
                  message: `${this.$t("Share")} ${this.$t(
                    "information  successfully changed"
                  )}`
                });
              })
              .catch(err => {
                this.showErrors(err);
              });
          }
        }
      });
      this.loadData();
    }
  }
};
</script>
