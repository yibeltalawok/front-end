<template>
  <div>
    <v-toolbar dense flat>
      <v-btn
        text
        class="text-capitalize primary--text"
        @click="$router.push({ name: 'payroll-master-list' })"
      >
        <v-icon class="mx-3">mdi-chevron-left</v-icon>
        {{ $t("go_back") }}
      </v-btn>
    </v-toolbar>
    <v-divider></v-divider>
    <v-container grid-list-xs>
      <v-layout wrap row justify-center>
        <v-flex xs12 sm12 md8 lg8 pa-3>
          <v-card outlined>
            <v-card-text>
              <v-form @submit.prevent="save">
                <form-error-messages :messages="errorMessage" />
                <v-layout row wrap justify-center>
                  <v-flex xs12 sm12 md6 lg6 pa-1>
                    <v-text-field
                      :label="$t('fullName')"
                      v-model="employee"
                      outlined
                      disabled
                      dense
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md6 lg6 pa-1>
                    <v-text-field
                      :label="$t('advancedReceivable')"
                      v-model="item.advancedRecievable"
                      :rules="inputRules"
                      outlined
                      dense
                    />
                  </v-flex>

                  <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-text-field
                      :label="$t('penality')"
                      v-model="item.penality"
                      :rules="inputRules"
                      outlined
                      dense
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.payback"
                      :error-messages="errors.collect('payback')"
                      :label="$t('payback')"
                      name="payback"
                      outlined
                      dense
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.miscPayment"
                      :error-messages="errors.collect('miscPayment')"
                      :label="$t('miscPayment')"
                      name="miscPayment"
                      outlined
                      dense
                    />
                  </v-flex>
                </v-layout>
                <v-layout row wrap justify-center>
                  <v-flex xs12 sm12 md6 lg6 pa-3>
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
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { api, path } from "@/api";
import { formErrorHandling } from "@/shared/mixins";

import { mapActions } from "vuex";
export default {
  name: "UserAccountCreate",
  mixins: [formErrorHandling],

  data() {
    return {
      item: {},
      path: path.payroll,
      employee: "",
      filter: { include: ["employee"] },
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
          disabled: false,
          to: "/app/payroll/master/list"
        },
        {
          text: "Update Payroll master",
          disabled: true
        }
      ]
    };
  },
  async created() {
    const { payrollId } = this.$route.params;
    this.item = await api.get(payrollId, path.payroll, this.filter);
    this.employee =
      this.item.employee.idno + " [" + this.item.employee.fullName + "] ";
  },
  methods: {
    ...mapActions("inventory", ["updateData"]),
    save() {
      this.item.date = new Date();
      this.updateData([this.item, this.path])
        .then(() => {
          this.errMessage = "";
          this.item = {};
          this.$notify({
            type: "success",
            title: "Update Payroll",
            message: `${this.$t("Payroll Master")} ${this.$t(
              " information is changed!!!"
            )}`
          });
          this.$router.push({ name: "payroll-master-list" });
        })
        .catch(err => {
          this.showErrors(err);
        });
      // api
      //   .update(this.item, this.path)
      //   .then(() => {
      //     this.errMessage = "";
      //     this.item = {};
      //     this.$notify({
      //       type: "success",
      //       title: "Update Payroll",
      //       message: `${this.$t("Payroll Master")} ${this.$t(
      //         " information is changed!!!"
      //       )}`
      //     });
      //     this.$router.push({ name: "payroll-master-list" });
      //   })
      //   .catch(err => {
      //     this.showErrors(err);
      //   });
    }
  }
};
</script>
