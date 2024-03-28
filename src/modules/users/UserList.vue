<template>
  <div>
    <v-container grid-list-xs>
      <v-card outlined style="border-radius: 12px">
        <v-toolbar dense flat>
          <div>
            <v-text-field
              hide-details
              flat
              prepend-inner-icon="search"
              color="primary"
              dense
              solo
              rounded
              v-model="search"
              :label="$t('search-user')"
            />
          </div>
          <v-spacer></v-spacer>
          <v-btn
            rounded
            small
            class="text-capitalize primary"
            @click="$router.push({ name: 'user-create' })"
            >{{ $t("addNew") }}</v-btn
          >
          <v-btn icon @click="downloadDataAsCsv('opmsEmployeeList')">
            <downloadicon />
          </v-btn>
          <v-btn icon> <refresh /> </v-btn>
          <v-btn icon> <morevert /> </v-btn>
        </v-toolbar>
        <v-divider />
        <v-data-table
          :headers="headers"
          :items-per-page="10"
          :loading="loading"
          :items="items"
          item-key="id"
          :server-items-length="totalItems"
          footer-props.items-per-page-text="`${$t('users')} per page`"
        >
          <template slot="headerCell" slot-scope="props">
            <span class="table-header-text caption font-weight-bold">{{
              $t(props.header.text)
            }}</span>
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn
              small
              text
              color="primary"
              @click="
                $router.push({
                  name: 'user-update',
                  params: { userId: item.id },
                })
              "
            >
              <v-icon class="mr-2">edit</v-icon>
            </v-btn>
            <v-btn small text color="red" @click="deleteItem(item.id, path)">
              <v-icon>delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>



<script>
import { api, path } from "@/api";
import { tableMixin, csvDownloadMixin } from "@/shared/mixins";
import downloadicon from "./../../assets/icons/filedownload.svg";
import refresh from "./../../assets/icons/refresh.svg";
import morevert from "./../../assets/icons/more_vert.svg";

export default {
  name: "UserList",
  mixins: [tableMixin, csvDownloadMixin],
  components: {
    downloadicon,
    refresh,
    morevert,
  },
  data() {
    return {
      path: path.user,
      filter: {
        limit: 100,
        offset: 0,
        include: ["userRole"],
        where: {},
      },
      resource: api,
      resourceName: "User",
      searchField: "fullName",
      headers: [
        {
          text: this.$t("fullName"),
          value: "fullName",
        },
        {
          text: this.$t("role"),
          value: "userRole.name",
        },
        {
          text: this.$t("email"),
          value: "email",
          sortable: false,
        },
        {
          text: this.$t("phoneNumber"),
          align: "left",
          value: "phoneNo",
        },
        {
          text: this.$t("action"),
          value: "action",
          align: "center",
          sortable: false,
        },
      ],
    };
  },
};
</script>
