<template>
  <div>
    <v-container grid-list-xs>
      <v-toolbar dense flat>
        <v-tabs v-model="tab">
          <v-tab href="#tab-1" class="text-capitalize">{{$t('bundles')}}</v-tab>
          <v-tab href="#tab-2" class="text-capitalize">{{$t('bundle-history')}}</v-tab>
          <v-tab href="#tab-3" class="text-capitalize">{{$t('docs')}}</v-tab>
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
        <v-tab-item value="tab-2"><BundleHistory /></v-tab-item>
        <v-tab-item value="tab-3"><BundleDoc /></v-tab-item>
      </v-tabs-items>
    </v-container>
  </div>
</template>
<script>
import BundleDoc from "./BundleDoc";
import BundleHistory from "./BundleHistory";
export default {
  components:{
    BundleDoc,
    BundleHistory
  },
  data() {
    return {
      tab: null
    };
  }
};
</script>