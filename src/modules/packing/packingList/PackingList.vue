<template>
  <div>
    <v-container grid-list-xs fluid>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <div>
            <v-text-field
              hide-details
              prepend-inner-icon="search"
              color="primary"
              dense
              solo
              flat
              v-model="search"
              :label="$t('search-packing-list')"
              single-line
            />
          </div>
          <v-spacer></v-spacer>
          <v-btn
            small
            color="primary"
            class="text-capitalize"
            @click="$router.push({ name: 'create-packList' })"
            >{{ $t("addNew") }}</v-btn
          >
          <v-btn icon>
            <v-icon>refresh</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-data-table
          :headers="headers"
          :items-per-page="10"
          :loading="loading"
          :items="items"
          item-key="id"
          :server-items-length="totalItems"
          footer-props.items-per-page-text="`${$t('employee')} per page`"
        >
          <template v-slot:item.createdAt="{ item }">
            <span>{{
              new Date(item.createdAt).toLocaleDateString("en-US")
            }}</span>
          </template>
          <template v-slot:item.action="{ item }">
            <v-menu bottom left transition="slide-x-transition" offset-y>
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  rounded
                  small
                  v-on="on"
                  color="primary"
                  class="text-capitalize"
                  >{{ $t("clickHere") }}</v-btn
                >
              </template>

              <v-card>
                <v-card-text>
                  <v-btn
                    text
                    small
                    color="success"
                    dense
                    flat
                    class="text-capitalize"
                    @click="moreInfo(item.id, item.type)"
                    >{{ $t("more_detail") }}</v-btn
                  >
                  <v-btn
                    text
                    small
                    color="success"
                    class="text-capitalize"
                    @click="deleteItem(item.id, path)"
                  >
                    <v-icon small class="red--text">delete</v-icon>
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-menu>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { tableMixin } from "@/shared/mixins";
import { api, path } from "@/api";
export default {
  mixins: [tableMixin],
  data() {
    return {
      resource: api,
      resourceName: "User",
      searchField: "heading.styleNumber",
      path: path.packingList,
      headers: [
        {
          text: this.$t("date"),
          value: "createdAt"
        },
        {
          text: this.$t("shippingMark"),
          value: "heading.shippingMark"
        },
        {
          text: this.$t("codeArticle"),
          value: "heading.codeArticle"
        },
        {
          text: this.$t("talle"),
          value: "heading.talle"
        },
        {
          text: this.$t("quantity"),
          value: "heading.quantity"
        },
        {
          text: this.$t("styleNumber"),
          value: "heading.styleNumber"
        },
        {
          text: this.$t("orderNumber"),
          value: "heading.orderNumber"
        },
        {
          text: this.$t("orderQuantity"),
          value: "heading.orderQuantity"
        },
        {
          text: this.$t("action"),
          value: "action",
          align: "center",
          sortable: false
        }
      ]
    };
  },
  methods: {
    moreInfo(id, type) {
      if (type == "1") {
        this.$router.push({
          name: "type-one-detail",
          params: { packingId: id }
        });
      }
      if (type == "2") {
        this.$router.push({
          name: "type-two-detail",
          params: { packingId: id }
        });
      }

      if (type == "3") {
        this.$router.push({
          name: "type-three-detail",
          params: { packingId: id }
        });
      }
      if (type == "4") {
        this.$router.push({
          name: "type-four-detail",
          params: { packingId: id }
        });
      }
    }
  }
};
</script>