<template>
  <div>
    <v-container grid-list-xs fluid>
      <v-card outlined style="border-radius: 12px">
        <v-toolbar dense flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="$router.push({ name: 'cost-per-sam' })"
          >
            <v-icon class="mx-1">arrow_back</v-icon>
            {{ $t("go_back") }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-card flat>
            <v-text-field
              flat
              append-icon="search"
              color="primary"
              dense
              solo
              hide-details
              v-model="search"
              :label="$t('search')"
            />
          </v-card>
        </v-toolbar>
        <v-divider></v-divider>
        <v-data-table
          :headers="headers"
          :pagination.sync="pagination"
          :loading="loading"
          :items="items"
          item-key="id"
          :total-items="totalItems"
        >
          <template slot="headerCell" slot-scope="props">
            <span class="table-header-text caption font-weight-bold">
              {{ $t(props.header.text) }}
            </span>
          </template>
          <template v-slot:item.date="{ item }">{{
            new Date(item.date).toLocaleDateString("en-US")
          }}</template>
          <template v-slot:item.action="{ item }">
            <v-btn
              text
              small
              color="success"
              class="text-capitalize"
              @click="deleteItem(item.id, path)"
            >
              <v-icon small class="red--text">delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { api, path } from "@/api";
import { tableMixin } from "@/shared/mixins";
export default {
  name: "OperationalCostList",
  mixins: [tableMixin],
  data() {
    return {
      component: "Operational Cost",
      ifNoData: "register-operational-cost",
      resource: api,
      path: path.costPerSam,
      resourceName: "Cost per sam summary ",
      searchField: "styleName",
      item: {},
      headers: [
        {
          text: this.$t("date"),
          value: "date",
        },
        {
          text: this.$t("total") + this.$t("SAM-produced"),
          value: "totalSamProduced",
        },
        {
          text: this.$t("operational_cost"),
          value: "operationalCost",
        },
        {
          text: this.$t("cost-per-SAM"),
          value: "costPerSam",
        },

        {
          text: this.$t("action"),
          value: "action",
        },
      ],
      camps: [
        {
          text: "Dashboard",
          disabled: false,
          to: "dasboard",
        },
        {
          text: "Operational Cost",
          disabled: false,
          to: "/app/operational-cost/list",
        },
        {
          text: "Cost per SAM",
          disabled: false,
          to: "/app/operational-cost/SAM",
        },
        {
          text: "Cost Per SAM History",
          disabled: true,
        },
      ],
    };
  },

  methods: {},
};
</script>
