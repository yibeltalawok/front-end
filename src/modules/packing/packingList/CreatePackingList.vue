<template>
  <div>
    <v-container grid-list-xs fluid>
      <v-card outlined style="border-radius:12px">
        <v-toolbar dense flat>
          <v-btn
            text
            color="primary"
            class="text-capitalize"
            @click="$router.push({name:'packing'})"
          >
            <v-icon class="mx-1">arrow_back</v-icon>
            {{$t('go_back')}}
          </v-btn>
          <v-spacer></v-spacer>
          <v-card flat width="320px">
            <v-combobox
              solo
              flat
              :items="[
        {
          title: $t('assorted-size-and-assorted-color'),
          value: 1,
          route: 'create-packList'
        },
        {
          title: $t('solid-size-and-assorted-color'),
          value: 2,
          route: 'packListTwo'
        },
        {
          title: $t('assorted-size-and-solid-color'),
          value: 3,
          route: 'packListThree'
        },
        {
          title: $t('solid-size-and-solid-color'),
          value: 4,
          route: 'packListFour'
        }
      ]"
              item-text="title"
              item-value="value"
              dense
              hide-details
              :label="$t('select-packing-type')"
              @input="selectType"
            />
          </v-card>
        </v-toolbar>
        <v-divider></v-divider>
        <v-progress-linear v-if="loading" :indeterminate="true" />
        <v-card-text>
          <router-view></router-view>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      types: [
        {
          title: "Assorted size and Assorted color",
          value: 1,
          route: "create-packList"
        },
        {
          title: "Solid size and assorted color",
          value: 2,
          route: "packListTwo"
        },
        {
          title: "Assorted size and solid color",
          value: 3,
          route: "packListThree"
        },
        {
          title: "Solid size and Solid color",
          value: 4,
          route: "packListFour"
        }
      ]
    };
  },
  methods: {
    selectType(val) {
      this.loading = true;
      this.$router
        .push({ name: val.route })
        .then(() => (this.loading = !this.loading));
    }
  }
};
</script>