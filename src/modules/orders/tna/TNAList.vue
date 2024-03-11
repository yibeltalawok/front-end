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
            @click="$router.push({ name: 'create-tna' })"
            >{{ $t("addNew") }}</v-btn
          >
          <v-btn
            text
            class="csv-download-icon primary--text"
            @click="csv(items)"
          >
            <v-icon large>file_download</v-icon>
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
          :rows-per-page="pagination"
          :loading="loading"
          :items="items"
          item-key="id"
          :server-items-length="totalItems"
          footer-props.items-per-page-text="`${$t('time & action')} per page`"
        >
          <template v-slot:item.action="{ item }">
            <v-btn
              text
              small
              color="success"
              class="text-capitalize"
              @click="toDtailsPageRoute(item)"
              >{{ $t("more_detail") }}</v-btn
            >
            <v-icon
              small
              color="primary"
              class="mr-2 primary--text"
              @click="
                $router.push({
                  name: 'update-tna',
                  params: { tnaId: item.id }
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
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { path, api } from "@/api";
import { tableMixin, csvDownloadMixin } from "@/shared/mixins";
import { mapActions } from "vuex";

export default {
  mixins: [tableMixin, csvDownloadMixin],
  data() {
    return {
      component: "TAC",
      ifNoData: "time-action-create",
      filter: {
        include: ["order"]
      },
      resource: api,
      path: path.timeAction,
      resourceName: "TimeAction",
      searchField: "order.orderNumber",
      csvOut: [],
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
          text: this.$t("orderQuantity"),
          value: "order.quantity"
        },
        {
          text: this.$t("order-recieving-date"),
          value: "recievingDate"
        },
        {
          text: this.$t("order-confirmation-date"),
          value: "confirmationDate"
        },
        {
          text: this.$t("action"),
          value: "action",
          align: "center",
          sortable: false
        }
      ]
    };
  },
  methods: {
    ...mapActions("tna", ["fetchTimeAction"]),

    async toDtailsPageRoute(item) {
      // eslint-disable-next-line no-unused-vars
      await this.fetchTimeAction(item.id).then(rep => {
        this.$router.push({
          name: "tna-detail",
          params: { tnaId: item.id }
        });
      });
    },
    csv(items) {
      var csvOut = items.map(d => {
        return {
          orderNumber: d.order.orderNumber,
          customer: d.order.customer,
          styleNumber: d.order.styleNumber,
          styleName: d.order.styleName,
          quantity: d.order.quantity,

          recievingDate: d.recievingDate,
          confirmationDate: d.confirmationDate,

          startPlannedCutDate: d.startPlannedCutDate,
          startActualCutDate: d.startActualCutDate,
          endPlannedCutDate: d.endPlannedCutDate,
          endActualCutDate: d.endActualCutDate,

          plannedSewingStart: d.plannedSewingStart,
          actualSewingStart: d.actualSewingStart,
          plannedSewingEnd: d.plannedSewingEnd,
          actualSewingEnd: d.actualSewingEnd,

          plannedFinishStart: d.plannedFinishStart,
          actualFinishStart: d.actualFinishStart,
          plannedFinishEnd: d.plannedFinishEnd,
          actualFinishEnd: d.actualFinishEnd,

          plannedPackingStart: d.plannedPackingStart,
          actualPackedStart: d.actualPackedStart,
          plannedPackingEnd: d.plannedPackingEnd,
          actualPackedEnd: d.actualPackedEnd,

          plannedShippingDate: d.plannedShippingDate,
          actualShipedDate: d.actualShipedDate
        };
      });

      this.downloadDataAsCsv("opmsTimeActionCalList", csvOut);
    }
  }
};
</script>