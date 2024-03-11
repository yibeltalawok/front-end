
<template>
  <v-app>
    <v-breadcrumbs :items="camps">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>

    <v-container grid-list-xs>
      <v-card outlined>
        <v-layout row wrap justify-center>
          <v-flex xs12 sm12 md2 lg2 pa-3>{{ $t("list-of-overtime") }}</v-flex>

          <v-flex xs12 sm12 md4 lg4 pa-1>
            <v-autocomplete
              :label="$t('filter-by-month')"
              v-model="selectedMonth"
              :items="months"
              item-text="month"
              item-value="number"
              outlined
              dense
              @input="getOvertime(selectedMonth)"
            />
          </v-flex>
          <v-flex xs12 sm12 md2 lg2 pa-3>
            <div class="text-right">
              <v-btn
                rounded
                outlined
                color="primary"
                class="text-capitalize"
                @click="
                  $router.push({ name: 'create-over-time', params: payrollId })
                "
                >{{ $t("addNew") }}</v-btn
              >
            </div>
          </v-flex>
        </v-layout>
        <v-data-table
          :headers="headers"
          :items="overtime"
          item-key="id"
          :rows-per-page="10"
        >
          <template slot="headerCell" slot-scope="props">
            <span class="table-header-text caption font-weight-bold">{{
              $t(props.header.text)
            }}</span>
          </template>
          <template v-slot:item.date="{ item }">
            <span>{{ new Date(item.date).toLocaleDateString("en-US") }}</span>
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn
              text
              small
              color="success"
              class="text-capitalize"
              @click="
                $router.push({
                  name: 'update-over-time',
                  params: { overtimeId: item.id }
                })
              "
            >
              <v-icon small class="primary--text">edit</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import { api, path } from "@/api";
export default {
  name: "Overtime",
  data() {
    return {
      resource: api,
      path: path.overtime,
      filter: {},
      overtime: [],
      resourceName: "OverTime",
      searchField: "date",
      payrollId: "",
      selectedMonth: "",
      headers: [
        {
          text: this.$t("date"),
          value: "date",
          align: "center"
        },
        {
          text: this.$t("over-time-type"),
          value: "type",
          align: "center"
        },
        {
          text: this.$t("over-time-hour"),
          value: "value",
          align: "center"
        },
        {
          text: this.$t("action"),
          value: "action",
          sortable: false,
          align: "center"
        }
      ],
      camps: [],
      months: [
        { month: "January", number: "1" },
        { month: "February", number: "2" },
        { month: "March", number: "3" },
        { month: "April", number: "4" },
        { month: "May", number: "5" },
        { month: "June", number: "6" },
        { month: "July", number: "7" },
        { month: "August", number: "8" },
        { month: "September", number: "9" },
        { month: "October", number: "10" },
        { month: "November", number: "11" },
        { month: "December", number: "12" }
      ]
    };
  },
  async created() {
    const { payrollId } = this.$route.params;
    this.payrollId = payrollId;
    let date = new Date();
    this.getOvertime(date.month);
    this.camps = [
      {
        text: "Dashboard",
        disabled: false,
        to: "dasboard"
      },
      {
        text: "Salary",
        disabled: true
      },
      {
        text: "Payroll Master",
        disabled: false,
        to: "/app/payroll/master/list"
      },
      {
        text: "Payroll Master Info",
        disabled: false,
        to: "/app/payroll/master/" + payrollId + "/info"
      },
      {
        text: "Over Time",
        disabled: true,
        to: "/app/over-time/" + payrollId + "/list"
      }
    ];
  },
  methods: {
    async getOvertime(month) {
      let filter = {
        where: { payrollId: this.payrollId, month: month }
      };
      this.overtime = (await api.all(path.overtime, filter)).rows;
    }
  }
};
</script>
