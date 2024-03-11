<template>
  <div>
    <v-breadcrumbs :items="camps">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>

    <v-container grid-list-xs>
      <v-layout wrap row justify-center>
        <v-flex xs12 sm12 md10 lg10 pa-2>
          <v-card outlined>
            <v-card-text>
              <v-form @submit.prevent="save">
                <form-error-messages :messages="errorMessage" />
                <v-layout row wrap justify-center>
                  <v-flex xs12 sm12 md10 lg10 pa-2>
                    <v-radio-group v-model="item.type" :mandatory="false" lebel="Select Type">
                      <v-layout row wrap>
                        <v-flex>
                          <v-radio :label="$t('normal-day')" value="Normal Day"></v-radio>
                        </v-flex>
                        <v-flex>
                          <v-radio :label="$t('rest-day')" value="Rest Day"></v-radio>
                        </v-flex>
                        <v-flex>
                          <v-radio :label="$t('holiy-day')" value="Public Holly Day"></v-radio>
                        </v-flex>
                      </v-layout>
                    </v-radio-group>
                  </v-flex>
                  <v-flex xs12 sm12 md6 lg6 pa-2>
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
                          :label="$t('select-date')"
                          readonly
                          v-on="on"
                          outlined
                          dense
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="item.date" @input="menu2 = false"></v-date-picker>
                    </v-menu>
                  </v-flex>

                  <v-flex xs12 sm12 md4 lg4 pa-2>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.value"
                      :error-messages="errors.collect('value')"
                      :label="$t('value-in-day')"
                      name="value"
                      outlined
                      dense
                      type="number"
                    />
                  </v-flex>
                </v-layout>
                <v-layout row wrap justify-center>
                  <v-flex xs12 sm12 md5 lg5 pa-2>
                    <v-btn
                      outlined
                      color="primary"
                      rounded
                      class="text-capitalize"
                      block
                      @click="save"
                    >{{$t('save')}}</v-btn>
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

export default {
  name: "RegisterSlabe",
  mixins: [formErrorHandling],

  data() {
    return {
      item: {},
      menu2: false,
      camps: [],
      payrollId: ""
    };
  },
  async created() {
    const { payrollId } = this.$route.params;
    this.payrollId = payrollId;
    this.item.payrollId = payrollId;
    this.camps = [
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
        text: "Payroll Master Info",
        disabled: false,
        to: "/app/payroll/master/" + payrollId + "/info"
      },
      {
        text: "Over Time",
        disabled: false,
        to: "/app/over-time/" + payrollId + "/list"
      },
      {
        text: "Create Over Time",
        disabled: true
      }
    ];
  },
  methods: {
    save() {
      let d = new Date(this.item.date);
      this.item.month = d.getMonth() + 1;
      this.item.year = d.getFullYear();
      api
        .create(this.item, path.overtime)
        .then(() => {
          this.item = {};
          this.$notify({
            type: "success",
            title: "Register Over Time",
            message: `${this.$t("Over Time")} ${this.$t(
              " successfully registered!"
            )}`
          });
          this.$router.push({ name: "over-time-list", params: this.payrollId });
        })
        .catch(err => {
          this.showErrors(err);
        });
    }
  }
};
</script>
