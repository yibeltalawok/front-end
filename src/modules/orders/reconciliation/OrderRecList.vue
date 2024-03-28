<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-text-field
            v-model="search"
            solo
            flat
            dense
            hide-details
            :label="$t('search')"
            prepend-inner-icon="search"
          />

          <v-spacer></v-spacer>

          <v-btn
            rounded
            small
            class="text-capitalize primary"
            @click="$router.push({ name: 'create-order-rec' })"
            >{{ $t("addNew") }}</v-btn
          >
          <v-btn
            text
            class="csv-download-icon primary--text"
            @click="csv(items)"
          >
            <v-icon>file_download</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>refresh</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-data-table
          :headers="headers"
          :rows-per-page="10"
          :loading="loading"
          :items="items"
          item-key="id"
          :server-items-length="totalItems"
          footer-props.items-per-page-text="`Order rec per page`"
        >
          <template v-slot:item.action="{ item }">
            <v-menu bottom left transition="slide-x-transition" offset-y>
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  rounded
                  small
                  v-on="on"
                  color="primary"
                  class="text-capitalize"
                  >{{ $t("clickHere") }}</v-btn
                >
              </template>

              <v-card>
                <v-card-text>
                  <v-btn
                    text
                    small
                    color="success"
                    class="text-capitalize"
                    @click="
                      $router.push({
                        name: 'order-rec-detail',
                        params: { recId: item.id }
                      })
                    "
                    >{{ $t("more_detail") }}</v-btn
                  >
                  <v-icon
                    small
                    color="primary"
                    class="mr-2 primary--text"
                    @click="
                      $router.push({
                        name: 'update-order-rec',
                        params: { recId: item.id }
                      })
                    "
                    >edit</v-icon
                  >
                  <v-icon
                    color="red"
                    small
                    class="ml-2"
                    @click="deleteItem(item.id, path)"
                    >delete</v-icon
                  >
                </v-card-text>
              </v-card>
            </v-menu>
            <!-- -->
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>


<script>
import { path, api } from "@/api";
import { tableMixin, csvDownloadMixin } from "@/shared/mixins";
export default {
  mixins: [tableMixin, csvDownloadMixin],
  data() {
    return {
      component: "order-reconciliation",
      ifNoData: "create-order-rec",
      filter: {
        include: ["order"]
      },
      resource: api,
      path: path.reconciliation,
      resourceName: "Reconciliation",
      searchField: "order.orderNumber",
      scvOut: [],
      headers: [
        {
          text: this.$t("orderNumber"),
          value: "order.orderNumber"
        },
        {
          text: this.$t("styleNumber"),
          value: "order.styleNumber"
        },
        {
          text: this.$t("styleName"),
          value: "order.styleName"
        },
        {
          text: this.$t("planned-consumption-per-piece"),
          value: "plannedFabricConsumed"
        },
        {
          text: this.$t("actual-consumption-per-piece"),
          value: "fabricConsumption"
        },
        {
          text: this.$t("total-planned-fabric"),
          value: "totalPlennedFabric"
        },
        {
          text: this.$t("action"),
          value: "action",
          sortable: false
        }
      ],
      camps: [
        {
          text: "Dashboard",
          disabled: false,
          to: "dasboard"
        },
        {
          text: "Order",
          disabled: false,
          to: "/app/order/list"
        },
        {
          text: "Order reconciliation",
          disabled: true
        }
      ]
    };
  },
  methods: {
    csv(items) {
      var csvOut = items.map(d => {
        return {
          orderNumber: d.order.orderNumber,
          customer: d.order.customer,
          styleNumber: d.order.styleNumber,
          styleName: d.order.styleName,
          quantity: d.order.quantity,
          plannedFabricConsumed: d.plannedFabricConsumed,
          fabricConsumption: d.fabricConsumption,
          totalPlennedFabric: d.totalPlennedFabric,
          actualFabricConsumed: d.actualFabricConsumed,
          extra: d.extra,
          actualShipment: d.actualShipment,
          rejectedPiece: d.rejectedPiece
        };
      });

      this.downloadDataAsCsv("opmsOrderRecList", csvOut);
    }
  }
};
</script>