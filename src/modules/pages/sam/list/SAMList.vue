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
          <v-flex xs12 sm12 md4 lg4 pa-3>List of Registered SAM</v-flex>
          <v-flex xs12 sm12 md4 lg4 pa-3>
            <v-text-field
              flat
              prepend-inner-icon="mdi-magnify"
              color="primary"
              dense
              solo-inverted
              rounded
              v-model="search"
              label="Search style"
              single-line
            />
          </v-flex>
          <v-flex xs12 sm12 md4 lg4 pa-3>
            <div class="text-right">
              <v-btn
                outlined
                rounded
                color="white"
                class="text-capitalize mx-2 primary--text"
                @click="$router.push({ name: 'register-sam' })"
              >Register SAM</v-btn>
            </div>
          </v-flex>
        </v-layout>
        <v-data-table
          :headers="headers"
          :pagination.sync="pagination"
          :loading="loading"
          :items="items"
          item-key="id"
          :total-items="totalItems"
        >
          <template slot="headerCell" slot-scope="props">
            <span class="table-header-text caption font-weight-bold">
              {{
              $t(props.header.text)
              }}
            </span>
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn
              text
              small
              color="success"
              class="text-capitalize"
              @click="$router.push({name:'sam-info',
              params:{ samId:item.id }})"
            >more info</v-btn>

            <v-btn
              text
              small
              color="info"
              class="text-capitalize"
              @click="
                $router.push({
                  name: 'update-sam',
                  params: { samId: item.id }})"
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
import { tableMixin } from "@/shared/mixins";
export default {
  name: "OperationList",
  mixins: [tableMixin],
  data() {
    return {
      component: "SAM",
      ifNoData: "register-sam",
      filter: { include: ["operation"] },
      resource: api,
      path: path.sam,
      resourceName: "SAM",
      searchField: "styleName",
      headers: [
        {
          text: "SAM Code",
          value: "samCode"
        },
        {
          text: "Style Description",
          value: "styleName"
        },
        {
          text: "Style #",
          value: "styleNumber"
        },
        {
          text: "SAM Value",
          value: "sam"
        },

        {
          text: "ACTION",
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
          text: "SAM Bank",
          disabled: true
        }
      ]
    };
  },
  methods: {}
};
</script>
