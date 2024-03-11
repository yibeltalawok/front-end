<template>
  <div>
    <v-breadcrumbs :items="camps">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>

    <v-container grid-list-xs>
      <v-card>
        <v-divider :inset="inset"></v-divider>
        <v-layout row justify-center align-center>
          <v-form @submit.prevent="save">
            <form-error-messages :messages="errorMessage" />
            <v-flex xs12 sm12 md12 lg12 pa-1>
              <v-text-field
                v-validate="'required'"
                v-model="forLine"
                :error-messages="errors.collect('target')"
                :label="$t('For Line')"
                name="target"
                outlined
                dense
                type="number"
                min="0"
                @input="culculateForOperator(forLine)"
              />
            </v-flex>
            <v-flex xs12 sm12 md12 lg12 pa-1>
              <v-text-field
                v-validate="'required'"
                v-model="forOperator"
                :error-messages="errors.collect('target')"
                :label="$t('For Operator')"
                name="target"
                outlined
                dense
                type="number"
                min="1"
                @input="culculateforLine(forOperator)"
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
                >Save</v-btn>
              </div>
            </v-flex>
          </v-form>
        </v-layout>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { api, path } from "@/api";
export default {
  name: "Incentive",
  data() {
    return {
      resourceName: "Incentive",
      item: {},
      roleItem: {},
      filter: { include: ["line", "sam"] },
      errMessage: "",
      resource: api,
      path: path.incentive,
      forLine: "",
      forOperator: "",
      forL: "",
      forO: "",
      lineCapacity: "",
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
      operator: [],
      employeeId: [],
      performance: [],
      totalPerformance: 0,
      history: {},
      per: []
    };
  },
  components: {},
  async created() {
    const { incentiveId } = this.$route.params;
    this.item = await api.get(incentiveId, path.incentive, this.filter);

    this.incentiveId = incentiveId;
  },

  methods: {
    culculateForOperator(forLine) {
      if (parseFloat(forLine) > 100 || parseFloat(forLine) < 0) {
        this.forOperator = "";
        this.forLine = "";
        alert("Invalid Input");
      } else {
        this.forOperator = 100 - parseFloat(forLine);
      }
    },
    culculateforLine(forOperator) {
      if (parseFloat(forOperator) > 100 || parseFloat(forOperator) < 0) {
        this.forOperator = "";
        this.forLine = "";
        alert("Invalid Input");
      } else {
        this.forLine = 100 - parseFloat(forOperator);
      }
    },
    save() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          this.item.id = this.incentiveId;
          this.item.forLine = (
            (parseFloat(this.forLine) * parseFloat(this.item.forEmployee)) /
            100
          ).toFixed(2);
          this.item.forOperator = (
            (parseFloat(this.forOperator) * parseFloat(this.item.forEmployee)) /
            100
          ).toFixed(2);
          this.forL = this.item.forLine;
          this.forO = this.item.forOperator;

          api
            .update(this.item, path.incentive)
            .then(() => {
              this.item = {};

              this.$notify({
                type: "primary",
                title: this.$t("primary"),
                text: `${this.$t("user")} ${this.$t("created_primaryfully")}`
              });
              //this.saveIncentiveForOperator();
              location.reload();
            })
            .catch(err => {
              this.showErrors(err);
            });
        }
      });
    }
  }
};
</script>
