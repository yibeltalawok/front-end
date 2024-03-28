<template>
  <div>
    <v-breadcrumbs :items="camps">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-container grid-list-xs>
      <v-card outlined>
        <v-data-table dense :headers="headers" :items="performances" item-key="`id`">
          <template v-slot:item.date="{ item }">
            <span>
              {{
              new Date(item.date).toISOString().substring(0, 10)
              }}
            </span>
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
      performances: [],
      camps: [
        {
          text: "Dashboard",
          disabled: false,
          to: "dasboard"
        },
        {
          text: "Employee",
          disabled: false,
          to: "/app/employee/list"
        },
        {
          text: "Performance history",
          disabled: true
        }
      ]
    };
  },
  async created() {
    const { employeeId } = this.$route.params;
    let filter = {
      where: { employeeId: employeeId },
      include: { jobs: ["operation"] }
    };
    this.performances = (await api.all(path.performance, filter)).rows;
  }
};
</script>