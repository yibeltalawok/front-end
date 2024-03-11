<template>
  <v-menu width="250px" offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-bind="attrs"
        v-on="on"
        hide-details
        flat
        prepend-inner-icon="mdi-magnify"
        color="primary"
        dense

        rounded
        v-model="search"
        :label="$t('search')"
        class="hidden-sm-and-down"
        @input="searchItem"
      />
    </template>
    <v-card v-if="searchValues.length>0">
      <v-list nav dense>
        <v-list-item-group v-model="menu" color="primary">
          <v-list-item v-for="menu in searchValues" :key="menu" @click="routeToPage(menu.route)">
            <v-list-item-avatar>
              <v-icon>{{menu.icon}}</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="body-1 text-capitalize">{{$t(menu.title)}}</v-list-item-title>
              <v-list-item-subtitle>No Description was given.</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-menu>
</template>
<script>
import { menusData } from "@/modules/menuData";
export default {
  data() {
    return {
      search: "",
      items: [],
      searchValues: [],
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      await menusData.map((x) =>
        x.links.map((y) => {
          this.items.push({
            title: y.title,
            route: y.route,
            icon: y.icon,
          });
        })
      );
    },
    searchItem() {
      let pattern = new RegExp(this.search, "gi");
      this.searchValues = this.items.filter(
        (x) => x.title.match(pattern) && this.search.length >= 2
      );
    },
    routeToPage(route) {
      this.$router.push({ name: route });
      this.search = "";
      this.searchValues = [];
    },
  },
};
</script>