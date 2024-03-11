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
    <v-container grid-list-xs>
      <v-layout wrap row justify-center>
        <v-flex xs12 sm12 md10 lg10 pa-3>
          <v-card outlined>
            <v-card-text>
              <v-form @submit.prevent="save" ref="form" lazy-validation>
                <form-error-messages :messages="errorMessage" />
                <v-layout row wrap justify-center>
                  <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-autocomplete
                      :label="$t('select-id')"
                      v-model="item.employeeId"
                      :rules="inputRules"
                      :items="employee"
                      item-text="idno"
                      item-value="id"
                      outlined
                      dense
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-autocomplete
                      :label="$t('select-full-name')"
                      v-model="item.employeeId"
                      :rules="inputRules"
                      :items="employee"
                      item-text="fullName"
                      item-value="id"
                      outlined
                      dense
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-1>
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
                      v-model="item.payback"
                      :label="$t('payback')"
                      name="payback"
                      outlined
                      dense
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-text-field
                      v-model="item.miscPayment"
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
import { path } from "@/api";
import { formErrorHandling } from "@/shared/mixins";
import { mapActions, mapState } from "vuex";
export default {
  name: "UserAccountCreate",
  mixins: [formErrorHandling],

  data() {
    return {
      item: { miscPayment: 0, payback: 0 },
      path: path.payroll,
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
          text: "Add new Payroll master",
          disabled: true
        }
      ],
      inputRules: [v => !!v || "This field is required"]
    };
  },
  async created() {
    this.employeeItem();
  },
  computed: {
    ...mapState("SelectItem", ["employee"])
  },
  methods: {
    ...mapActions("SelectItem", ["employeeItem"]),
    ...mapActions("inventory", ["postData"]),
    save() {
      if (this.$refs.form.validate()) {
        this.item.date = new Date();

        this.postData([this.item, this.path])
          .then(() => {
            this.errMessage = "";
            this.item = {};
            this.$notify({
              type: "success",
              title: "Register",
              message: `${this.$t("New Salary Master")} ${this.$t(
                " information is created!"
              )}`
            });
            this.$router.push({ name: "payroll-master-list" });
          })
          .catch(err => {
            this.showErrors(err);
          });

        // api
        //   .create(this.item, this.path)
        //   .then(() => {
        //     this.errMessage = "";
        //     this.item = {};
        //     this.$notify({
        //       type: "success",
        //       title: "Register",
        //       message: `${this.$t("New Salary Master")} ${this.$t(
        //         " information is created!"
        //       )}`
        //     });
        //     this.$router.push({ name: "payroll-master-list" });
        //   })
        //   .catch(err => {
        //     this.showErrors(err);
        //   });
      }
    }
  }
};
</script>
