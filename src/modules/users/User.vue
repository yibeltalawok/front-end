<template>
  <div>
    <v-container grid-list-xs fluid>
      <v-toolbar dense flat>
        <v-tabs v-model="tab">
          <v-tab href="#tab-1" class="text-capitalize">{{ $t("users") }}</v-tab>
          <v-tab href="#tab-2" class="text-capitalize">{{ $t("role") }} </v-tab>
          <v-tab href="#tab-3" class="text-capitalize">{{ $t("docs") }}</v-tab>
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
        <v-tab-item value="tab-2"><Role /></v-tab-item>
        <v-tab-item value="tab-3"><UserDoc /></v-tab-item>
      </v-tabs-items>
    </v-container>
  </div>
</template>
<script>
import UserDoc from "./UserDoc";
import Role from "../role/list/RoleList";
export default {
  components: {
    UserDoc,
    Role,
  },
  data() {
    return {
      tab: null,
    };
  },
};
</script>