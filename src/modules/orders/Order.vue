<template>
  <div>
    <v-container grid-list-xs>
      <v-toolbar dense flat>
        <v-tabs v-model="tab">
          <v-tab href="#tab-1" class="text-capitalize">{{ $t("order") }}</v-tab>
          <v-tab href="#tab-2" class="text-capitalize">{{ $t("docs") }}</v-tab>
        </v-tabs>
        <v-spacer></v-spacer>
        <v-btn
          small
          text
          rounded
          outlined
          class="text-capitalize mainbtn darken-1 mx-1"
          @click="$router.push({ name: 'production-report' })"
          >{{ $t("production-and-W/p-summ") }}</v-btn
        >
        <v-btn
          small
          text
          rounded
          outlined
          class="text-capitalize mainbtn darken-1 mx-1"
          @click="$router.push({ name: 'order-rec' })"
          >{{ $t("Reconciliation1") }}</v-btn
        >
        <v-btn
          rounded
          small
          text
          outlined
          class="text-capitalize mainbtn darken-1 mx-1"
          @click="$router.push({ name: 'tna' })"
        >
          <v-icon small>event</v-icon>
          <span class="mx-3">{{ $t("tna1") }}</span>
        </v-btn>
        <v-btn
          rounded
          small
          text
          outlined
          class="text-capitalize mainbtn darken-1 mx-1"
          @click="export_csv"
        >
          <v-icon small>event</v-icon>
          <span class="mx-3">{{ $t("Generate-CSV-for-Both") }}</span>
        </v-btn>
        <v-btn icon color="primary">
          <v-icon>help</v-icon>
        </v-btn>
      </v-toolbar>
      <v-tabs-items v-model="tab">
        <v-tab-item value="tab-1">
          <router-view></router-view>
        </v-tab-item>
        <v-tab-item value="tab-2"><OrderDoc /></v-tab-item>
      </v-tabs-items>
    </v-container>
  </div>
</template>
<script>
import { api, path } from "@/api";
import OrderDoc from "./OrderDoc";
export default {
  data() {
    return {
      tab: null,
      color: "primary",
      navs: [
        {
          title: "Orders",
          route: "orders",
          status: "active",
        },
        {
          title: "Status",
          route: "order-status",
          status: "inactive",
        },
        {
          title: "Reconciliation1",
          route: "order-rec",
          status: "inactive",
        },
        {
          title: "tna1",
          route: "tna",
          status: "inactive",
        },
      ],
      camps: [
        {
          text: "Dashboard",
          disabled: false,
        },
        {
          text: "Order",
          disabled: true,
        },
      ],
    };
  },
  components: {
    OrderDoc,
  },
  methods: {
    async export_csv() {
      let filter = {
        include: ["order"],
      };
      let tnaData = (await api.all(path.timeAction, filter)).rows.map((d) => {
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
          actualShipedDate: d.actualShipedDate,
        };
      });
      let reconcilation = (await api.all(path.reconciliation, filter)).rows.map(
        (d) => {
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
            rejectedPiece: d.rejectedPiece,
          };
        }
      );
      let items = [];
      if (tnaData.length > 0) {
        for (const iterator of tnaData) {
          items.push(iterator);
        }
      }
      if (reconcilation.length > 0) {
        items.push(
          {},
          {
            a: "",
            title: "Order Reconcolation CSV File",
          },
          {
            column1: this.$t("Order #"),
            column2: this.$t("Customer"),
            column3: this.$t("Style #"),
            column4: this.$t("Style column"),
            column5: this.$t("Order Quantity"),
            column6: this.$t("Planned Fabric Consumption per piece"),
            column7: this.$t("Actual Fabric Consumption  per piece"),
            column8: this.$t("Total Planned Fabric"),
            column9: this.$t("Actual Fabric Consumed"),
            column10: this.$t("Extra Fabric Consumed"),
            column11: this.$t("Actual Shipment"),
            column12: this.$t("rejected Piece"),
          }
        );
        for (const iterator of reconcilation) {
          items.push(iterator);
        }
      }
      let fileName = "Reconcilation and time action";
      let delimiter = ",";
      let arrayHeader = [
        this.$t("Order #"),
        this.$t("Customer"),
        this.$t("Style #"),
        this.$t("Style column"),
        this.$t("Order Quantity"),
        this.$t("Order Recieving Date"),
        this.$t("Order Confirmation Date"),
        this.$t("Planned Cut Start Date"),
        this.$t("Actual Cut Start Date"),
        this.$t("Planned Cut End Date"),
        this.$t("Actual Cut End Date"),
        this.$t("Planned Sewing Start Date"),
        this.$t("Actual Sewing Start Date"),
        this.$t("Planned Sewing End Date"),
        this.$t("Actual Sewing End Date"),
        this.$t("Planned Finish Start Date"),
        this.$t("Actual Finish Start Date"),
        this.$t("Planned Finish End Date"),
        this.$t("Actual Finish End Date"),
        this.$t("Planned Packing Start Date"),
        this.$t("Actual Packed Start Date"),
        this.$t("Planned Packing End Date"),
        this.$t("Actual Packing End Date"),
        this.$t("Planned Shipping Date"),
        this.$t("Actual Shipping Date"),
      ];

      let header = arrayHeader.join(delimiter) + "\n";
      let csv = header;
      if (items.length > 0) {
        items.forEach((obj) => {
          let row = [];
          for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
              row.push(obj[key]);
            }
          }
          csv += row.join(delimiter) + "\n";
        });

        let csvData = new Blob([csv], { type: "text/csv" });
        let csvUrl = URL.createObjectURL(csvData);

        let hiddenElement = document.createElement("a");
        hiddenElement.href = csvUrl;
        hiddenElement.target = "_blank";
        hiddenElement.download = fileName + ".csv";
        hiddenElement.click();
      } else {
        this.$notify({
          type: "danger",
          title: "Data not found",
          message: `Both does not contain data.`,
        });
      }
    },
  },
};
</script>

<style scoped>
.mainbtn {
  color: #ecbb44;
}
</style>