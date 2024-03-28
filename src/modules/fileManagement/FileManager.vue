<template>
  <div>
    <v-container grid-list-xs fluid>
      <v-toolbar dense flat>
        <v-tabs v-model="tab">
          <v-tab href="#tab-1" class="text-capitalize">Files</v-tab>
          <v-tab href="#tab-2" class="text-capitalize">Docs</v-tab>
        </v-tabs>
        <v-spacer></v-spacer>
        <v-btn icon color="primary">
          <v-icon>help</v-icon>
        </v-btn>
      </v-toolbar>
      <v-tabs-items v-model="tab">
        <v-card flat class="my-5" style="border-radius:13px">
          <v-tab-item value="tab-1">
            <router-view></router-view>
          </v-tab-item>
          <v-tab-item value="tab-2">
            <v-card>
              <v-card-text>
                <p>Morbi nec metus. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Nunc sed turpis.</p>

                <p>Suspendisse feugiat. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In hac habitasse platea dictumst. Fusce ac felis sit amet ligula pharetra condimentum.</p>

                <p>Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Nam commodo suscipit quam. In consectetuer turpis ut velit. Sed cursus turpis vitae tortor. Aliquam eu nunc.</p>

                <p>Etiam ut purus mattis mauris sodales aliquam. Ut varius tincidunt libero. Aenean viverra rhoncus pede. Duis leo. Fusce fermentum odio nec arcu.</p>

                <p
                  class="mb-0"
                >Donec venenatis vulputate lorem. Aenean viverra rhoncus pede. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. Fusce commodo aliquam arcu. Suspendisse enim turpis, dictum sed, iaculis a, condimentum nec, nisi.</p>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item value="tab-3">
            <v-card>
              <v-card-text>
                <p>Fusce a quam. Phasellus nec sem in justo pellentesque facilisis. Nam eget dui. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In dui magna, posuere eget, vestibulum et, tempor auctor, justo.</p>

                <p
                  class="mb-0"
                >Cras sagittis. Phasellus nec sem in justo pellentesque facilisis. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nam at tortor in tellus interdum sagittis.</p>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-card>
      </v-tabs-items>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tab: null,
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",

      files: [
        {
          title: "Template",
          route: "file",
        },
        {
          title: "Production QR Code",
          route: "prod-qrcode",
        },
        {
          title: "JSON",
          route: "json",
        },
      ],
    };
  },
  methods: {
    refreshPage() {
      location.reload();
    },
    routePage(route) {
      this.$router.push({ name: route });
    },
  },
};
</script>