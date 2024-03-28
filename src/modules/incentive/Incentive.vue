<template>
  <div>
    <v-container grid-list-xs fluid>
      <v-toolbar dense flat>
        <v-tabs v-model="tab">
          <v-tab href="#tab-1" class="text-capitalize">{{
            $t("human_resource")
          }}</v-tab>
          <v-tab href="#tab-2" class="text-capitalize">{{ $t("docs") }}</v-tab>
        </v-tabs>
        <v-spacer></v-spacer>
        <v-btn icon color="primary">
          <v-icon>help</v-icon>
        </v-btn>
      </v-toolbar>
      <v-tabs-items v-model="tab">
        <v-tab-item value="tab-1">
          <router-view></router-view>
        </v-tab-item>
        <v-tab-item value="tab-2"><IncentiveDoc /></v-tab-item>
      </v-tabs-items>
    </v-container>
  </div>
</template>
<script>
import IncentiveDoc from "./IncentiveDoc";
export default {
  components: {
    IncentiveDoc,
  },
  data() {
    return {
      tab: null,
    };
  },
};
</script>