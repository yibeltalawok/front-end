<template>
  <div>
    <v-container grid-list-xs>
      <v-card flat outlined style="border-radius: 12px">
        <v-toolbar dense flat>
          <v-text-field
            flat
            prepend-inner-icon="search"
            dense
            solo
            hide-details
            v-model="search"
            :label="$t('search-incentive')"
            single-line
          />
          <v-spacer></v-spacer>
          <v-btn
            small
            outlined
            color="amber"
            class="text-capitalize"
            @click="$router.push('slabe-list')"
            >{{ $t("incentive-slab") }}</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            small
            outlined
            color="amber"
            class="text-capitalize"
            @click="$router.push('weightage')"
            >{{ $t("weightage") }}</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            small
            outlined
            color="amber"
            class="text-capitalize"
            @click="$router.push({ name: 'incentive-share-list' })"
            >{{ $t("distribute-incentive") }}</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            small
            outlined
            color="amber"
            class="text-capitalize"
            @click="$router.push({ name: 'incentive-summary-list' })"
            >{{ $t("incentive-summary") }}</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            small
            outlined
            color="amber"
            class="text-capitalize"
            @click="$router.push({ name: 'create-incentive' })"
            >{{ $t("addNew") }}</v-btn
          >
        </v-toolbar>
        <v-divider></v-divider>
        <v-data-table
          :headers="headers"
          :items-per-page="10"
          :loading="loading"
          :items="items"
          item-key="id"
        >
          <template slot="headerCell" slot-scope="props">
            <span class="table-header-text caption font-weight-bold">
              {{ $t(props.header.text) }}
            </span>
          </template>
          <template v-slot:item.productionDate="{ item }">
            <span>{{
              new Date(item.productionDate).toLocaleDateString("en-US")
            }}</span>
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn
              text
              small
              color="success"
              class="text-capitalize"
              @click="
                $router.push({
                  name: 'incentive-info',
                  params: { incentiveId: item.id },
                })
              "
              >{{ $t("more_detail") }}</v-btn
            >
            <v-btn
              text
              small
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
  name: "OperationList",
  mixins: [tableMixin],
  data() {
    return {
      component: "Incentive",
      ifNoData: "order-list",
      filter: { include: ["order", "line"] },
      resource: api,
      path: path.incentive,
      resourceName: "Incentive",
      searchField: "productionDate",
      dialog: false,
      headers: [
        {
          text: this.$t("date"),
          value: "productionDate",
        },
        {
          text: this.$t("line-number"),
          value: "lineNo",
        },
        {
          text: this.$t("styleName"),
          value: "order.styleName",
        },
        {
          text: this.$t("targetPerDay"),
          value: "targetPerDay",
        },
        {
          text: this.$t("extraPerDay"),
          value: "extraPerDay",
        },
        {
          text: this.$t("action"),
          value: "action",
          sortable: false,
          align: "center",
        },
      ],
      camps: [
        {
          text: "Dashboard",
          disabled: false,
          to: "dasboard",
        },
        {
          text: "Incentive",
          disabled: true,
        },
        {
          text: "List",
          disabled: true,
          to: "/app/incentive/list",
        },
      ],
    };
  },
  methods: {
    async deleteItems() {
      await api.remove(this.path);
    },
    show(show) {
      this.dialog = show;
    },
    close() {
      this.dialog = false;
    },
  },
};
</script>
<style scoped>
</style>
