<template>
  <div>
    <v-container grid-list-xs fluid>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="$router.push({ name: 'incentive-summary-list' })"
          >
            <v-icon>arrow_back</v-icon>
            {{ $t("go_back") }}
          </v-btn>
          <v-card flat width="200px" class="mx-3">
            <v-text-field
              :label="$t('line')"
              v-model="line"
              outlined
              dense
              class="mt-7"
              @input="getDate"
            ></v-text-field>
          </v-card>
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
                :disabled="disable"
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

          <v-text-field
            name="name"
            class="mt-7"
            outlined
            disabled
            dense
            label="ttlMinEarned"
            v-model="ttlMinEarned"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-text-field
            name="name"
            class="mt-7"
            outlined
            disabled
            dense
            label="ttl Earning"
            v-model="ttlEarning"
          ></v-text-field>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card>
          <v-data-table :headers="headers" :items="summary" :search="search">
            <template slot="headerCell" slot-scope="props">
              <span class="table-header-text caption font-weight-bold">{{
                $t(props.header.text)
              }}</span>
            </template>
          </v-data-table>
          <v-overlay :absolute="absolute" :value="overlay">
            <v-btn color="success" @click="calculate">Calculate</v-btn>
            <v-btn color="error" class="ml-7" @click="close">Close</v-btn>
          </v-overlay>
        </v-card>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import { api, path } from "@/api";
export default {
  data() {
    return {
      disable: true,
      absolute: true,
      opacity: 1,
      overlay: false,
      summary: [],
      path: path.incentiveSummaryL,
      date: new Date().toISOString().substr(0, 7),
      line: "",
      ttlMinEarned: "",
      ttlEarning: "",
      modal: false,
      headers: [
        {
          text: "Operator Name",
          value: "fullName"
        },
        {
          text: "IDNo",
          value: "idno"
        },
        {
          text: "Performance",
          value: "performance"
        },
        {
          text: "Discipline",
          value: "discipline"
        },
        {
          text: "Quality",
          value: "quality"
        },
        {
          text: "Cummulative Perfo",
          value: "cummulative"
        },
        {
          text: "Individual incentive",
          value: "individual"
        },
        {
          text: "Group incentive",
          value: "group"
        },
        {
          text: "Total incentive",
          value: "total"
        }
      ]
    };
  },
  created() {
    let date = new Date();
    this.loadData(date.getMonth() + 1, date.getFullYear(), "1");
  },

  methods: {
    async loadData(month, year, line) {
      let filter = {
        where: {
          month: month,
          year: year,
          line: line
        }
      };
      this.month = month;
      this.year = year;
      this.line = line;
      this.summary = (await api.all(this.path, filter)).rows;
      if (this.summary.length > 0) {
        this.overlay = false;
        this.line = this.summary[0].line;
        this.ttlMinEarned = this.summary[0].ttlMinEarned;
        this.ttlEarning = this.summary[0].ttlEarning;
      } else {
        this.overlay = true;
      }
    },
    getDate() {
      this.disable = false;
    },
    filterByMonth() {
      let d = new Date(this.date);
      this.modal = false;
      this.loadData(d.getMonth() + 1, d.getFullYear(), this.line);
    },
    calculate() {
      let item = this.month + "-" + this.year + "-" + this.line;
      this.$router.push({
        name: "incentive-summary",
        params: {
          item: item
        }
      });
    },
    close() {
      this.overlay = false;
    }
  }
};
</script>