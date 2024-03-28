<template>
  <div>
    <v-container grid-list-xs>
      <div >
        <v-card-text>
          <v-form @submit.prevent="save">
            <form-error-messages :messages="errorMessage" />
            <v-layout row wrap justify-center>
              <v-flex xs12 sm12 md3 lg3 pa-2>
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="item.date"
                      :label="$t('date')"
                      v-validate="'required'"
                      :error-messages="errors.collect('date')"
                      name="date"
                      readonly
                      v-on="on"
                      outlined
                      dense
                      @input="selectDM(item.date)"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="item.date"
                    @input="menu2 = false"
                  ></v-date-picker>
                </v-menu>
              </v-flex>

              <v-flex xs12 sm12 md3 lg3 pa-3>
                <v-combobox
                  :label="$t('select') + ' ' + $t('narration')"
                  v-model="item.narration"
                  :items="narration"
                  item-text="narration"
                  item-value="id"
                  v-validate="'required'"
                  :error-messages="errors.collect('narration')"
                  name="narration"
                  outlined
                  dense
                  @input="searchType(item.narration)"
                />
              </v-flex>

              <v-flex xs12 sm12 md3 lg3 pa-3>
                <v-text-field
                  v-validate="'required'"
                  v-model="item.type"
                  :error-messages="errors.collect('type')"
                  :label="$t('type')"
                  name="type"
                  outlined
                  dense
                />
              </v-flex>

              <v-flex xs12 sm12 md3 lg3 pa-3>
                <v-text-field
                  v-validate="'required'"
                  v-model="item.amount"
                  :error-messages="errors.collect('amount')"
                  :label="$t('amount')"
                  name="amount"
                  outlined
                  dense
                  type="number"
                  min="1"
                />
              </v-flex>
            </v-layout>
            <v-layout row wrap justify-center>
              <v-flex xs12 sm12 md4 lg4 pa-3>
                <v-btn
                  color="primary"
                  outlined
                  rounded
                  block
                  class="text-capitalize"
                  @click="save"
                  >{{ $t("save") }}</v-btn
                >
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
      </div>
    </v-container>
  </div>
</template>

<script>
import { api, path } from "@/api";
import { formErrorHandling } from "@/shared/mixins";
export default {
  name: "CostEntry",
  mixins: [formErrorHandling],

  data() {
    return {
      item: {},
      path: path.operationalCost,
      narration: [
        { narration: "Salary", type: "Direct Cost" },
        { narration: "Pension", type: "Direct Cost" },
        { narration: "Bonus", type: "Direct Cost" },
        { narration: "Food Allowance", type: "Direct Cost" },
        { narration: "Transport", type: "Direct Cost" },
        { narration: "Overtime", type: "Direct Cost" },
        { narration: "Production Allowance", type: "Direct Cost" },
        { narration: "Canteen Allowance", type: "Direct Cost" },
        { narration: "Utilities", type: "Indirect Cost" },
        { narration: "Depreciation", type: "Indirect Cost" },
        { narration: "Rent", type: "Indirect Cost" },
        { narration: "Taxes", type: "Indirect Cost" },
        { narration: "Other expense (Admin)", type: "Indirect Cost" },
        { narration: "Other expense (Production)", type: "Direct Cost" },

        { narration: "Salary-Production", type: "Direct Cost" },
        { narration: "Salary-Admin staff", type: "Indirect Cost" },
        { narration: "Salary-Marketing staff", type: "Indirect Cost" },
        { narration: "Over time-Production", type: "Direct Cost" },
        { narration: "Over time-Admin staff", type: "Indirect Cost" },
        { narration: "Transport -Production", type: "Direct Cost" },
        { narration: "Transport -Admin staff", type: "Indirect Cost" },
        {
          narration: "Food & Incentive Allowance-Production",
          type: "Direct Cost",
        },
        { narration: "Other Allowance-Production", type: "Direct Cost" },
        {
          narration: "Other Allowance-Admin & Marketing",
          type: "Indirect Cost",
        },
        { narration: "Utility cost-Production", type: "Direct Cost" },

        { narration: "Travel & Accommodation-Production", type: "Direct Cost" },
        {
          narration: "Travel & Accommodation-Admin & Marketing",
          type: "Indirect Cost",
        },
        {
          narration: "Advertising & Promotion-Admin & Marketing",
          type: "Indirect Cost",
        },
        {
          narration: "Fuel, oil, & lubricant-Admin & Marketing",
          type: "Indirect Cost",
        },
        { narration: "Fuel,oil, & lubricant-Production", type: "Direct Cost" },
        { narration: "Communication cost-Production", type: "Direct Cost" },
        {
          narration: "Communication cost-Admin & Marketing",
          type: "Indirect Cost",
        },
        { narration: "Pension Contribution-Production", type: "Direct Cost" },
        {
          narration: "Pension Contribution-Admin & Marketing",
          type: "Indirect Cost",
        },
        { narration: "Refreshment/Entertainment", type: "Indirect Cost" },
        { narration: "Uniform & Outlits-Production", type: "Direct Cost" },
        { narration: "Uniform&Outlits-Admin&Marketing", type: "Indirect Cost" },
        { narration: "Daily Labourer-Production", type: "Direct Cost" },
        //-------------------------------------------------------
        { narration: "Daily Labourer-Admin&Marketing", type: "Indirect Cost" },
        { narration: "Medical & Supplies-Production", type: "Direct Cost" },
        {
          narration: "Medical & Supplies-Admin&Marketing",
          type: "Indirect Cost",
        },
        { narration: "Machinery Rent-Production", type: "Indirect Cost" },
        { narration: "Consultancy-Admin & Marketing", type: "Indirect Cost" },
        { narration: "Property Insurance", type: "Indirect Cost" },
        { narration: "Shop Office Rent-Marketing", type: "Indirect Cost" },
        {
          narration: "Stationaries & Cleaning Supplies-Production",
          type: "Indirect Cost",
        },
        {
          narration: "Statinaries & Cleaning Supplies-Admin&Marketing",
          type: "Indirect Cost",
        },
        { narration: "Bank Interest", type: "Indirect Cost" },
        {
          narration: "Personal Accident Insurance-Production",
          type: "Direct Cost",
        },
        {
          narration: "Personal Accident Insurance-Admin& Marketing",
          type: "Indirect Cost",
        },
        {
          narration: "Repair, Maintenance & Spare parts",
          type: "Indirect Cost",
        },
      ],
    };
  },
  methods: {
    async searchType(narration) {
      for (const iterator of this.narration) {
        if (iterator.narration == narration) {
          this.item.type = iterator.type;
        }
      }
    },
    save() {
      const valid = this.$validator.validateAll();
      if (valid) {
        this.invalidDate = "";
        var date = new Date(this.item.date);
        this.item.day = date.getDate();
        this.item.month = date.getMonth() + 1;
        this.item.year = date.getFullYear();
        // alert(this.item.day + "  " + this.item.month + "  " + this.item.year);
        if (parseInt(this.item.month) > 0 && parseInt(this.item.month) <= 12) {
          api
            .create(this.item, this.path)
            .then(() => {
              /* eslint-disable no-unused-vars */
              this.$router.push({ name: "operational-cost-list" }).catch(err => { 
      // Ignore the vuex err regarding  navigating to the page they are already on.
      if (err.name != "NavigationDuplicated") {
       // But print any other errors to the console
       //eslint-disable-next-line no-console
        console.error(err);
      }
    })
              this.item = {};
              this.$notify({
                type: "success",
                title: "Register Operational Cost",
                message: `${this.$t("Operational Cost")} ${this.$t(
                  " information is successfully registered"
                )}`,
              });
            })
            .catch((err) => {
              this.showErrors(err);
            });
        }
      }
      this.dialog = false;
    },
  },
};
</script>
