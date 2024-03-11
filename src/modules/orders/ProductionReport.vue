<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:13px">
        <v-toolbar dense flat>
          <v-btn
            text
            class="text-capitalize"
            @click="$router.push({ name: 'order' })"
          >
            <v-icon class="mx-3">mdi-chevron-left</v-icon>
            {{ $t("go_back") }}
          </v-btn>
          <v-spacer />
          <v-text-field
            v-model="search"
            label="Search"
            single-line
            outlined
            dense
            prepend-inner-icon="search"
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-text-field
            :label="$t('Filter by date')"
            placeholder="yyyy-mm-dd"
            dense
            outlined
            v-model="date"
            hide-details
            name="date"
            type="date"
            @input="getReport"
          />

          <v-spacer />
          <!-- <v-card outlined class="pink">
            <v-layout row wrap> -->
          <v-text-field
            :label="$t('Week start Date')"
            placeholder="yyyy-mm-dd"
            dense
            outlined
            v-model="start"
            hide-details
            name="date"
            type="date"
            @input="getWeekReport"
          />
          <v-spacer></v-spacer>
          <v-text-field
            :label="$t('Week end Date')"
            placeholder="yyyy-mm-dd"
            dense
            outlined
            v-model="end"
            hide-details
            name="date"
            type="date"
            @input="getWeekReport"
          />
          <!-- </v-layout>
          </v-card> -->
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="downloadDataAsCsv('orderProductionReport', dailyReport)"
          >
            <v-icon>file_download</v-icon>
          </v-btn>  
     </v-toolbar>
        <!-- <v-card-title>
        Production report
        <v-spacer></v-spacer>
        
      </v-card-title> -->
        <v-data-table
          :headers="headers"
          :items="dailyReport"
          :search="search"
        ></v-data-table>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";

import { csvDownloadMixin } from "@/shared/mixins";
export default {
  mixins: [csvDownloadMixin],
  data() {
    return {
      search: "",
      date: new Date().toISOString().substr(0, 10),
      end: "",
      start: "",
      headers: [
        { text: "Size", value: "size" },
        { text: "Color", value: "color" },
        { text: "Order number", value: "orderNumber" },
        { text: "Style", value: "styleName" },
        { text: "Quantity", value: "quantity" },
        { text: "Total cutting", value: "totalCutting" },
        { text: "Cutting WIP", value: "cuttingBalance" },
        { text: "Total sewing", value: "totalSewing" },
        { text: "Sewing WIP", value: "sewingBalance" },
        { text: "Total finishing", value: "totalFinishing" },
        { text: "Finishing WIP", value: "finishingBalance" },
        { text: "Total packing", value: "totalPacking" },
        { text: "Packing WIP", value: "packingBalance" },
        { text: "Shipment", value: "shipment" },
        { text: "Shipment date", value: "shipmentDate" }
      ]
    };
  },
  computed: {
    ...mapState("payrolls", ["dailyReport"])
  },
  created() {
    this.getReport(this.date);
  },
  methods: {
    ...mapActions("payrolls", [
      "getOrderStatusDailyReport",
      "getOrderStatusWeeklyReport"
    ]),
    getReport(date) {
      this.getOrderStatusDailyReport(date);
    },
    getWeekReport() {
      if (this.start != "" && this.end != "") {
        var start = new Date(this.start);
        let sm = start.getMonth();
        let sd = start.getDate();
        let sy = start.getFullYear();

        var end = new Date(this.end);
        let em = end.getMonth();
        let ed = end.getDate();
        let ey = end.getFullYear();
        if (sm == em && sd <= ed && sy == ey) {
          this.getOrderStatusWeeklyReport([this.start, this.end]);
        } else {
          this.$notify({
            type: "danger",
            title: "Input error",
            message: `${this.$t(
              "Please select valid date interval in same month?"
            )}`
          });
        }
      }
    }
  }
};
</script>