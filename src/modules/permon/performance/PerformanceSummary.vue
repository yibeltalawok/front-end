<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px">
        <v-toolbar flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="$router.push({ name: 'permon' })"
          >
            <v-icon class="mx-1">arrow_back</v-icon>{{ $t("go_back") }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="date"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                class="mt-7"
                v-model="date"
                :label="$t('search-by-month')"
                outlined
                dense
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              @input="filterByMonth"
              type="month"
              scrollable
            >
            </v-date-picker>
          </v-dialog>
          <v-spacer></v-spacer>
          <v-text-field
            class="mt-7"
            v-model="search"
            :label="$t('search')"
            outlined
            dense
            prepend-inner-icon="mdi-magnify"
          ></v-text-field>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-divider></v-divider>
        <v-data-table :headers="headers" :items="item" :search="search">
        </v-data-table> </v-card
    ></v-container>
  </div>
</template>
<script>
import { path, api } from "@/api";
export default {
  data() {
    return {
      search: "",
      path: path.createSummary,
      headers: [
        {
          text: this.$t("idno"),
          value: "idno"
        },
        { text: this.$t("fullName"), value: "fullName" },
        { text: this.$t("department"), value: "department" },
        { text: this.$t("subDept"), value: "subDept" },
        { text: this.$t("performance"), value: "avePerformance" }
      ],
      item: [],
      date: new Date().toISOString().substr(0, 7),
      modal: false
    };
  },
  created() {
    let date = new Date();
    this.loadData(date.getMonth() + 1, date.getFullYear());
  },
  methods: {
    async loadData(month, year) {
      let performance = [];
      await api.create({ month: month, year: year }, this.path).then(result => {
        performance = result;
      });
      this.item = performance;
    },
    filterByMonth() {
      let d = new Date(this.date);
      this.modal = false;
      this.loadData(d.getMonth() + 1, d.getFullYear());
    }
  }
};
</script>