<template>
  <v-app>
    <v-container grid-list-xs>
      <v-card outlined>
        <v-toolbar dense flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="$router.push({ name: 'incentive-list' })"
          >
            <v-icon>arrow_back</v-icon>
            {{ $t("go_back") }}
          </v-btn>
          <v-spacer />

          <!-- <v-flex xs12 sm12 md4 lg4 pa-3>{{ $t("list-of-slabs") }}</v-flex> -->
          <v-text-field
            class="mt-7"
            flat
            prepend-inner-icon="mdi-magnify"
            color="primary"
            dense
            solo-inverted
            rounded
            v-model="search"
            :label="$t('search-slab')"
            single-line
          />
          <v-spacer></v-spacer>
          <v-btn
            rounded
            outlined
            color="primary"
            class="text-capitalize"
            @click="$router.push({ name: 'create-slabe' })"
            >{{ $t("addNew") }}</v-btn
          >
        </v-toolbar>
        <v-data-table
          :headers="headers"
          :pagination.sync="pagination"
          :loading="loading"
          :items="items"
          item-key="id"
          :total-items="totalItems"
        >
          <template slot="headerCell" slot-scope="props">
            <span class="table-header-text caption font-weight-bold">{{
              $t(props.header.text)
            }}</span>
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn
              text
              small
              color="success"
              class="text-capitalize"
              @click="
                $router.push({
                  name: 'update-slabe',
                  params: { slabeId: item.id }
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
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import { api, path } from "@/api";
import { tableMixin, csvDownloadMixin } from "@/shared/mixins";
export default {
  name: "Slave",
  mixins: [tableMixin, csvDownloadMixin],
  data() {
    return {
      component: "Incentive-slab",
      ifNoData: "create-slabe",
      filter: {},
      resource: api,
      path: path.slabe,
      resourceName: "Salve",
      searchField: "percent",
      status: "work",
      headers: [
        {
          text: this.$t("from") + "(%)",
          value: "from"
        },
        {
          text: this.$t("to") + " (%)",
          value: "to"
        },
        {
          text: this.$t("percent") + " (%)",
          value: "percent"
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
          text: "Slabe",
          disabled: true,
          to: "/app/incentive/list"
        }
      ]
    };
  }
};
</script>
