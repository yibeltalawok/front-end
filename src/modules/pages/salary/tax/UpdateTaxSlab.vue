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
                  <v-flex xs12 sm12 md5 lg5 pa-2>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.initial"
                      :error-messages="errors.collect('initial')"
                      :label="$t('initial')"
                      name="from"
                      outlined
                      dense
                      type="number"
                      min="0"
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md5 lg5 pa-2>
                    <v-text-field
                      v-validate="'required'"
                      v-model="item.end"
                      :error-messages="errors.collect('end')"
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
import { api, path } from "@/api";
import { formErrorHandling } from "@/shared/mixins";
import { mapActions } from "vuex";

export default {
  name: "RegisterSlabe",
  mixins: [formErrorHandling],

  data() {
    return {
      item: {},
      path: path.taxSlab,
      slabId: "",
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
      numberRules: [
        v =>
          v <= this.maxLength ||
          `${this.errorName} must be less than ${this.maxLength} `,
        v =>
          v >= this.minLength ||
          `${this.errorName} must be greater than ${this.minLength} `
      ]
    };
  },
  async created() {
    const { slabId } = this.$route.params;
    this.item = await api.get(slabId, path.taxSlab);
  },
  methods: {
    ...mapActions("inventory", ["updateData"]),
    save() {
      this.errorMessage = null;
      this.updateData([this.item, path.taxSlab])
        .then(() => {
          this.item = {};
          this.$notify({
            type: "success",
            title: "Update Tax Slab",
            message: `${this.$t("Tax Slab")} ${this.$t(
              "information  successfully changed"
            )}`
          });
          this.$router.push({ name: "tax-slab-list" });
        })
        .catch(err => {
          this.showErrors(err);
        });
      // api
      //   .update(this.item, path.taxSlab)
      //   .then(() => {
      //     this.item = {};
      //     this.$notify({
      //       type: "success",
      //       title: "Update Tax Slab",
      //       message: `${this.$t("Tax Slab")} ${this.$t(
      //         "information  successfully changed"
      //       )}`
      //     });
      //     this.$router.push({ name: "tax-slab-list" });
      //   })
      //   .catch(err => {
      //     this.showErrors(err);
      //   });
    }
  }
};
</script>
