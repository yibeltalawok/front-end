<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <div class="mx-2">
            <v-combobox
              prepend-inner-icon="mdi-filter-variant"
              flat
              solo
              hide-details
              dense
              :label="$t('filter-by-order')"
              :items="orders"
              item-text="title"
              @input="filterByOrder"
            />
          </div>

          <v-spacer></v-spacer>
          <v-btn
            small
            @click="exportCsv(items)"
            color="primary"
            class="mx-2 text-capitalize"
          >
            <v-icon>mdi-export</v-icon>{{ $t("export-csv") }}
          </v-btn>
        </v-toolbar>
        <v-divider />
        <v-data-table
          :headers="headers"
          :items-per-page="10"
          :loading="loading"
          :items="items"
          item-key="id"
          :server-items-length="totalItems"
          footer-props.items-per-page-text="`${$t('users')} per page`"
        >
          <template v-slot:item.createdAt="{ item }">
            <span>{{
              new Date(item.createdAt).toLocaleDateString("en-US")
            }}</span>
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn small text color="red" @click="deleteItem(item.id, path)">
              <v-icon>delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>



<script>
import { api, path } from "@/api";

import { csvDownloadMixin } from "@/shared/mixins";
export default {
  mixins: [csvDownloadMixin],
  data() {
    return {
      items: [],
      path: path.packedIn,
      loading: false,
      totalItems: 0,
      orders: [],
      filter: {
        include: ["packingCarton", "order", "packingList"]
      },
      resource: api,
      resourceName: "Packed IN",
      searchField: "type",
      headers: [
        {
          text: this.$t("date"),
          value: "createdAt"
        },
        {
          text: this.$t("carton-no"),
          value: "packingCarton.cartonNo"
        },
        {
          text: this.$t("color"),
          value: "color"
        },
        {
          text: this.$t("size"),
          value: "size"
        },
        {
          text: this.$t("bundleNo"),
          value: "bundleNo"
        },
        {
          text: this.$t("quantity"),
          value: "bQty"
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
  async created() {
    this.orders = (await api.all(path.order)).rows.map(x => {
      return {
        id: x.id,
        title: x.orderNumber + " (" + x.styleName + ")"
      };
    });
    this.loadData(this.filter);
  },
  methods: {
    async loadData(filter) {
      this,this.loading = true;
      this.items = (await api.all(path.packedIn, filter)).rows;
      this.loading = false;
      this.totalItems = this.items.length;
    },
    filterByOrder(val) {
      let filter = {
        include: ["packingCarton", ["order"]],
        where: {
          orderId: val.id
        }
      };
      this.loadData(filter);
    },
    exportCsv(values) {
      let items = values.map(x => {
        return {
          packedDate: new Date(x.createdAt).toLocaleDateString("en-US"),
          orderNumber: x.order.orderNumber,
          styleNumber: x.order.styleNumber,
          styleName: x.order.styleName,
          customer: x.order.customer,
          orderQty: x.order.quantity,
          cartonNo: x.packingCarton.cartonNo,
          bundleNo: x.bundleNo,
          color: x.color,
          size: x.size,
          bQty: x.bQty,
          shippingMark: x.packingList.heading.shippingMark,
          codeArticle: x.packingList.heading.codeArticle,
          talle: x.packingList.heading.talle,
          grossWeight: x.packingList.summary.grossWeight,
          netWeight: x.packingList.summary.netWeight,
          ctnMEAS: x.packingList.summary.ctnMEAS,
          totalCtn: x.packingList.summary.totalCTNs
        };
      });
      this.downloadDataAsCsv("PackedInList", items);
    },

    async deleteItem(id, path) {
      const confirmed = await this.$confirm(this.$t("are_you_sure"), {
        buttonTrueText: this.$t("yes"),
        buttonFalseText: this.$t("no")
      });
      if (confirmed) {
        await this.resource.remove(id, path);
        this.$notify({
          type: "success",
          title: "Success",
          message: `${this.resourceName} ${this.$t("deleted")} ${this.$t(
            "successfully"
          )}.`
        });
        this.loadData();
      }
    }
  }
};
</script>
