<template>
  <div>
    <v-breadcrumbs :items="camps">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>

    <v-container grid-list-xs>
      <v-card outlined>
        <v-layout row wrap justify-center>
          <v-flex xs12 sm12 md6 lg6 pa-3>{{$t('working-hour')}}</v-flex>
          <v-flex xs12 sm12 md6 lg6 pa-3>
            <div class="text-right">
              <v-btn
                outlined
                rounded
                color="primary"
                class="text-capitalize"
                @click="$router.push({name:'workhour-create'})"
              >{{$t('addNew')}}</v-btn>
            </div>
          </v-flex>
        </v-layout>
        <v-data-table
          :headers="headers"
          :items-per-page="10"
          :loading="loading"
          :items="items"
          item-key="id"
          :server-items-length="totalItems"
          footer-props.items-per-page-text="`${$t('drivers')} per page`"
        >
          <template slot="headerCell" slot-scope="props">
            <span class="table-header-text caption font-weight-bold">{{ $t(props.header.text) }}</span>
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn
              text
              color="primary"
              @click="$router.push({name:'workhour-update',
              params:{ workhourId:item.id }})"
            >
              <v-icon class="mr-2">edit</v-icon>
            </v-btn>
            <v-btn text color="red" @click="deleteItem(item.id, path)">
              <v-icon>delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>



<script>
import { api, path } from "@/api/";

import { tableMixin } from "@/shared/mixins";

export default {
  name: "WorkingHoursList",
  mixins: [tableMixin],
  data() {
    return {
      filter: {},
      path: path.workHour,
      resource: api,
      resourceName: "Work Hours",
      searchField: "day",

      headers: [
        {
          text: this.$t("description"),
          align: "left",
          value: "desc"
        },
        {
          text: this.$t("day"),
          align: "left",
          value: "day"
        },
        {
          text: this.$t("from"),
          align: "left",
          value: "from"
        },
        {
          text: this.$t("to"),
          align: "left",
          value: "to"
        },
        {
          text: this.$t("action"),
          value: "action",
          align: "center",
          sortable: false
        }
      ],
      camps: [
        {
          text: "Dashboard",
          disabled: false,
          to: "dasboard"
        },
        {
          text: "Setting",
          disabled: true
        },
        {
          text: "Working Hour",
          disabled: true,
          to: "app/"
        }
      ]
    };
  }
};
</script>