<template>
  <div>
    <v-breadcrumbs :items="camps">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <!-- fgh -->
    <v-container grid-list-xs>
      <v-layout wrap row justify-center>
        <v-flex xs12 sm12 md10 lg10 pa-3>
          <v-card outlined>
            <v-card-text>
              <v-form @submit.prevent="save">
                <form-error-messages :messages="errorMessage" />
                <v-layout row wrap justify-center>
                  <v-flex xs12 sm12 md5 lg5 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="employeeId"
                      :label="$t('Employee Id no & Full Name')"
                      name="employeeId"
                      outlined
                      dense
                      disabled
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md5 lg5 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.responseAllow"
                      :error-messages="errors.collect('responseAllow')"
                      :label="$t('Responsibilty Allow')"
                      name="responseAllow"
                      outlined
                      dense
                      type="number"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md5 lg5 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.homeAllow"
                      :error-messages="errors.collect('homeAllow')"
                      :label="$t('Home Allow')"
                      name="homeAllow"
                      outlined
                      dense
                      type="number"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md5 lg5 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.absentIncentive"
                      :error-messages="errors.collect('absentIncentive')"
                      :label="$t('Absent Incentive')"
                      name="absentIncentive"
                      outlined
                      dense
                      disabled
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.transportPay"
                      :error-messages="errors.collect('transportPay')"
                      :label="$t('Transport Pay')"
                      name="transportPay"
                      outlined
                      dense
                      type="number"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md3 lg3 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.costSharing"
                      :error-messages="errors.collect('costSharing')"
                      :label="$t('Cost Sharing')"
                      name="costSharing"
                      outlined
                      dense
                      type="number"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md3 lg3 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.ironIncentive"
                      :error-messages="errors.collect('ironIncentive')"
                      :label="$t('Iron Incentive')"
                      name="ironIncentive"
                      outlined
                      dense
                      type="number"
                    />
                  </v-flex>
                  <!--  <v-flex xs12 sm12 md3 lg3 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.labourContribution"
                      :error-messages="errors.collect('labourContribution')"
                      :label="$t('Labour Union Contribution')"
                      name="labourContribution"
                      outlined
                      dense
                      type="number"
                    />
                  </v-flex>
                <v-flex xs12 sm12 md4 lg4 pa-1>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.fPrId"
                      :error-messages="errors.collect('fPrId')"
                      :label="$t('F.Pr Id')"
                      name="fPrId"
                      outlined
                      dense
                      type="number"
                    />
                  </v-flex>-->
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
                    >Save Info</v-btn>
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
  name: "UserAccountCreate",
  mixins: [formErrorHandling],

  data() {
    return {
      item: {},
      path: path.master,
      filter: { include: ["employee"] },
      masterId: "",
      employeeId: "",
      camps: [
        {
          text: "Dashboard",
          disabled: false,
          to: "dasboard",
        },
        {
          text: "Salary",
          disabled: true,
        },
        {
          text: "Master",
          disabled: false,
          to: "/app/master/list",
        },
        {
          text: "Add new master",
          disabled: true,
        },
      ],
    };
  },
  async created() {
    const { masterId } = this.$route.params;
    this.item = await api.get(masterId, path.master, this.filter);
    this.masterId = masterId;
    this.employeeId =
      this.item.employee.idno + " " + this.item.employee.fullName;
  },
  methods: {
    save() {
      this.item.date = new Date();
      this.$validator.validateAll().then((valid) => {
        if (valid) {
          api
            .update(this.item, path.master)
            .then(() => {
              this.item = {};
              this.$notify({
                type: "success",
                title: "Update Salary master",
                message: `${this.$t("Salary master")} ${this.$t(
                  "information  successfully changed"
                )}`,
              });
              this.$router.push({ name: "master-list" });
            })
            .catch((err) => {
              this.showErrors(err);
            });
        }
      });
    },
  },
};
</script>
