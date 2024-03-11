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
              <v-form @submit.prevent="save" ref="form" lazy-validation>
                <form-error-messages :messages="errorMessage" />
                <v-layout row wrap justify-center>
                  <v-flex xs12 sm12 md5 lg5 pa-2>
                    <v-text-field
                      v-model="item.initial"
                      v-validate="'required'"
                      :error-messages="errors.collect('initial')"
                      :label="$t('initial')"
                      name="initial"
                      outlined
                      dense
                      min="0"
                      type="number"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md5 lg5 pa-2>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.end"
                      :label="$t('end')"
                      name="end"
                      outlined
                      dense
                      type="number"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md5 lg5 pa-2>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.deduction"
                      :error-messages="errors.collect('deduction')"
                      :label="$t('deduction')"
                      name="deduction"
                      outlined
                      dense
                      type="number"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md5 lg5 pa-2>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.extraDeduction"
                      :error-messages="errors.collect('extraDeduction')"
                      :label="$t('extraDeduction')"
                      name="extraDeduction"
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
import { mapActions } from "vuex";
export default {
  name: "RegisterSlabe",
  mixins: [formErrorHandling],

  data() {
    return {
      // attendanceLists: {},
      item: {},
      value: [],
      path: path.taxSalb,
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
          text: "Tax Salb",
          disabled: false,
          to: "/app/tax/salb/list"
        },
        {
          text: "Create Slab",
          disabled: true
        }
      ],
      inputRules: [v => !!v || "This field is required"]
    };
  },
  async created() {
    this.getAttendanceList();
  },

  methods: {
    ...mapActions("taxslab", ["getAttendanceList"]),
    ...mapActions("inventory", ["postData"]),
    save() {
      // this.getAttendanceList(this.item)
      this.postData([this.item, path.taxSlab])
        .then(() => {
          this.errMessage = "";
          this.item = {};
          this.$notify({
            type: "success",
            title: "Register Salb",
            message: `${this.$t("Tax ")} ${this.$t(
              "Slab successfully registered!"
            )}`
          });
          this.$router.push({ name: "tax-slab-list" });
        })
        .catch(err => {
          this.showErrors(err);
        });

      //   this.$validator.validateAll().then(valid => {
      //     if (valid) {
      //       api
      //         .all(this.item, path.taxSlab)
      //         .then(() => {
      //           this.errMessage = "";
      //           this.item= {};
      //           this.$notify({
      //             type: "success",
      //             title: "Register Salb",
      //             message: `${this.$t("Tax ")} ${this.$t(
      //               "Slab successfully registered!"
      //             )}`
      //           });
      //           //this.$router.push({ name: "tax-slab-list" });
      //         })
      //         .catch(err => {
      //           this.showErrors(err);
      //         });
      //     }
      //   });
    }
  }
};
</script>
