<template>
  <div class="bg">
    <v-container grid-list-xs>
      <v-layout row wrap justify-center align-center>
        <v-flex xs12 sm12 md12 lg12 pa-2>
          <div class="d-none d-md-block" style="height:150px"></div>
          <p class="text-center py-2">
            No
            <span class="info--text text-capitalize">{{component}}</span> data is available yet.
          </p>
          <div class="text-center">
            <v-btn
              color="primary"
              class="text-capitalize"
              @click="$router.push({
                 name:route
             })"
            >Ceate New {{component}}</v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      route: "",
      component: ""
    };
  },
  created() {
    const { route, component } = this.$route.params;
    this.route = route;
    this.component = component;
  }
};
</script>

<style lang="css">
.bg {
  background-image: url("/bg2.jpg");
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>