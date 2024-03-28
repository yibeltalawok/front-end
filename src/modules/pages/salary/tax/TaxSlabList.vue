
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
          <v-flex xs12 sm12 md4 lg4 pa-3>{{$t('list-of-tax-slabs')}}</v-flex>
          <v-flex xs12 sm12 md4 lg4 pa-3>
            <div class="text-right">
              <v-btn
                rounded
                outlined
                color="primary"
                class="text-capitalize"
                @click="$router.push({ name: 'create-tax-slab' })"
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
        >
          <template slot="headerCell" slot-scope="props">
            <span class="table-header-text caption font-weight-bold">{{ $t(props.header.text) }}</span>
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn
              text
              small
              color="success"
              class="text-capitalize"
              @click="
                $router.push({
                  name: 'update-tax-slab',
                  params: { slabId: item.id },
                })
              "
            >
              <v-icon small class="primary--text">edit</v-icon>
            </v-btn>

            <v-btn
              text
              small
              color="success"
              class="text-capitalize"
              @click="deleteItem(item.id, path)"
            >
              <v-icon small class="red--text">delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
        <!-- my
        <table>
         <tr><td>{{aa.initial}} </td><td>{{aa.deduction}} </td><td>{{aa.extraDeduction}} </td><td>{{aa.end}} </td></tr>
       </table>
        my -->
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import { api, path } from "@/api";
import { tableMixin, csvDownloadMixin } from "@/shared/mixins";
//my
import {mapState} from "vuex"
//my
export default {
  name: "Slave",
  mixins: [tableMixin, csvDownloadMixin],
  data() {
    return {
      component: "Tax Slab",
      ifNoData: "create-tax-slab",
      filter: {},
      resource: api,
      path: path.taxSlab,
      resourceName: "Salve",
      searchField: "percent",
      status: "work",
      headers: [
        {
          text: this.$t("initial"),
          value: "initial"
        },
        {
          text: this.$t("end"),
          value: "end"
        },
        {
          text: this.$t("deduction"),
          value: "deduction"
        },
        {
          text: this.$t("extraDeduction"),
          value: "extraDeduction"
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
          text: "Salary",
          disabled: true
        },
        {
          text: "Tax Slab",
          disabled: true
        }
      ]
    };
  },
  
//my
  computed: {
    ...mapState("taxslab",["aa"])
  },
//my
};
</script>
