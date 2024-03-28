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
                v-model="item.minPerformance"
                :error-messages="errors.collect('target')"
                :label="$t('For Company')"
                name="target"
                outlined
                dense
                type="number"
                min="0"
                @input="checkMinPerformance(item.minPerformance)"
              />
            </v-flex>
            {{performances}}
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
      filter: { include: ["job", { order: ["sam"] }] },
      user: AccountService.getProfile(),
      resource: api,
      path: path.incentive,
      performances: [],
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
      incentiveId: ""
    };
  },
  components: {},
  async created() {
    const { incentiveId } = this.$route.params;
    this.item = await api.get(incentiveId, path.incentive, this.filter);
    this.incentiveId = incentiveId;

    let filterJob = { where: { jobId: this.item.job.id } };
    this.performances = await api.all(path.performance, filterJob);
  },

  methods: {
    checkMinPerformance(minPerformance) {
      if (parseFloat(minPerformance) > 100 || parseFloat(minPerformance) < 0) {
        (this.item.minPerformance = ""), alert("Invalid Input");
      }
    },
    save() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          this.item.id = this.incentiveId;
          let totalPerformance = 0;
          for (const iterator of this.performances) {
            totalPerformance =
              parseFloat(iterator.performance) + totalPerformance;
          }
          alert();
          //   api
          //     .update(this.item, path.incentive)
          //     .then(() => {
          //       this.item = {};

          //       this.$notify({
          //         type: "primary",
          //         title: this.$t("primary"),
          //         text: `${this.$t("user")} ${this.$t("created_primaryfully")}`
          //       });
          //       location.reload();
          //     })
          //     .catch(err => {
          //       this.showErrors(err);
          //     });
        }
      });
    }
  }
};
</script>
