<template>
  <div>
    <v-container grid-list-xs>
      <v-card flat outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-text-field
            flat
            prepend-inner-icon="search"
            color="primary"
            dense
            solo
            hide-details
            v-model="search"
            :label="$t('search-incentive')"
            single-line
          />
          <v-spacer></v-spacer>
          <v-btn
            small
            color="primary"
            class="text-capitalize"
            @click="dialog = true"
            >{{ $t("distribute-incentive") }}</v-btn
          >
        </v-toolbar>
        <v-divider></v-divider>
        <v-data-table
          :headers="headers"
          :items-per-page="10"
          :loading="loading"
          :items="items"
          item-key="id"
          :server-items-length="totalItems"
        >
          <template slot="headerCell" slot-scope="props">
            <span class="table-header-text caption font-weight-bold">
              {{ $t(props.header.text) }}
            </span>
          </template>
          <template v-slot:item.month="{ item }">
            <span>{{ item.day + "/" + item.month + "/" + item.year }}</span>
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn
              text
              small
              class="text-capitalize"
              @click="deleteItem(item.id, path)"
            >
              <v-icon small class="red--text">delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
    <!--  Company Employee dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <CompanyAndEmployee @close="close" />
      </v-card>
    </v-dialog>
    <!-- Company Employee dialog -->
  </div>
</template>

<script>
import { api, path } from "@/api";
import { tableMixin } from "@/shared/mixins";
import CompanyAndEmployee from "@/modules/incentive/percent/CompanyAndEmployee";

export default {
  name: "OperationList",
  mixins: [tableMixin],
  data() {
    return {
      component: "IncentiveShare",
      ifNoData: "incentive-share-list",
      resource: api,
      path: path.incentiveShare,
      resourceName: "IncentiveShare",
      searchField: "month",
      dialog: false,
      headers: [
        {
          text: this.$t("day"),
          value: "month"
        },
        {
          text: this.$t("forCompany"),
          value: "forCompany"
        },
        {
          text: this.$t("forEmployee"),
          value: "forEmployee"
        },
        {
          text: this.$t("forLine"),
          value: "forLine"
        },
        {
          text: this.$t("forOperator"),
          value: "forOperator"
        },
        {
          text: this.$t("action"),
          value: "action",
          sortable: false,
          align: "center"
        }
      ],
      camps: [
        {
          text: "Dashboard",
          disabled: false,
          to: "dasboard"
        },
        {
          text: "Incentive",
          disabled: true
        },
        {
          text: "List",
          disabled: true,
          to: "/app/incentive/list"
        }
      ]
    };
  },
  components: {
    CompanyAndEmployee
  },
  methods: {
    async deleteItems() {
      await api.remove(this.path);
    },
    show(show) {
      this.dialog = show;
    },
    close() {
      this.dialog = false;
    }
  }
};
</script>
