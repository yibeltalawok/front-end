<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="$router.push({ name: 'permon' })"
          >
            <v-icon class="mx-1">arrow_back</v-icon>{{ $t("go_back") }}
          </v-btn>
          <v-spacer></v-spacer>

          <v-text-field
            flat
            prepend-inner-icon="filter_list"
            color="primary"
            dense
            solo
            hide-details
            v-model="performanceFilter"
            type="number"
            :label="$t('filter-performance-greater-than')"
          />

          <v-btn
            color="primary"
            class="text-capitalize white--text"
            :disabled="disable"
            @click="save"
            >{{ $t("save") }}</v-btn
          >
        </v-toolbar>
        <v-divider></v-divider>
        <v-data-table
          :headers="headers"
          :items="performance"
          class="elevation-0"
        >
          <!-- Colored Chips -->
          <template v-slot:item.value="{ item }">
            <v-chip :color="getColor(item.value)" dark
              >{{ item.value }} %</v-chip
            >
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { api, path } from "@/api";
export default {
  data() {
    return {
      ltFilter: {
        include: ["job"]
      },
      disable: true,
      perf: [],
      item: [],
      jobs: [],
      lostTimes: [],
      performance: [],
      employeePerformance: [],
      JobPerf: [],
      minAvailiable: 0,
      date: "",
      weekDay: "",
      performanceFilter: "",
      days: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      resource: api,
      path: path.performance,
      resourceName: "Performance",
      searchField: "performance.job.employee.idno"
    };
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("line"),
          value: "line"
        },
        {
          text: this.$t("fullName"),
          value: "operatorName",
          sortable: false
        },
        {
          text: this.$t("operationName"),
          value: "operationName",
          sortable: false
        },
        {
          text: this.$t("pieces-produced"),
          value: "done"
        },
        {
          text: this.$t("lost_time"),
          value: "lostTime"
        },
        {
          text: this.$t("efficiency"),
          value: "efficency"
        },
        {
          text: this.$t("performance") + " (%)",
          value: "value",
          filter: value => {
            if (!this.performanceFilter) return true;

            return value > parseInt(this.performanceFilter);
          }
        }
      ];
    }
  },
  async created() {
    let performance = [];
    this.perf = await api.create({}, path.calculatePerformance).then(result => {
      performance = result;
    });
    this.performance = performance;
    this.date = new Date().toISOString();
    // const dateNow = this.date.substring(0, 10);
    let d = new Date();
    this.item = this.performance.map(x => {
      return {
        date: this.date,
        day: d.getDate(),
        month: d.getMonth() + 1,
        year: d.getFullYear(),
        line: x.line, //s.number,
        efficency: x.efficency,
        value: x.value,
        employeeId: x.operatorId,
        jobId: x.id
      };
    });
    this.employeePerformance = this.performance.map(x => {
      return {
        id: x.operatorId,
        prfrm: x.value
      };
    });
    this.JobPerf = this.performance.map(x => {
      return {
        id: x.id,
        perf: x.value
      };
    });
    this.disable = this.performance.length > 0 ? false : true;
  },
  methods: {
    save() {
      api
        .create(this.item, path.performance)
        .then(() => {
          //update performance for each job
          this.JobPerf.forEach(p => {
            api.update(p, path.job);
          });
          this.employeePerformance.forEach(emp => {
            api.update(emp, path.employee);
          });
        })
        .then(() => {
          this.$router.push({ name: "permon" });
          this.$notify({
            type: "success",
            title: "Todays Performance Registered",
            message: `Performance information successfully saved.`
          });
        })
        .catch(() => {
          this.$notify({
            type: "error",
            title: "Failure",
            message: `Failed to submit the information. Try later on.`
          });
        });
    },
    getColor(value) {
      if (value > 60) return "green";
      else if (value > 30) return "orange";
      else return "red";
    }
  }
};
</script>
