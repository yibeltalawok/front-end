<template>
  <div>
    <nav-bar />
    <side-bar />

    <v-overlay :value="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>
    <v-content class="mainclass">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
      <!-- Scroll-up button -->
      <v-btn
        v-scroll="onScroll"
        v-show="fab"
        fab
        dark
        fixed
        bottom
        right
        color="pink"
        small
        @click="toTop"
      >
        <v-icon>arrow_upward</v-icon>
      </v-btn>
    </v-content>
    <app-footer />
  </div>
</template>

<script>
import NavBar from "./NavBar.vue";
import SideBar from "./SideBar.vue";
import AppFooter from "./Footer";
// eslint-disable-next-line no-unused-vars
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      fab: true
    };
  },
  components: {
    NavBar,
    SideBar,
    AppFooter
  },
  computed: {
    ...mapState("core", ["loading"])
  },
  methods: {
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 20;
    },
    toTop() {
      this.$vuetify.goTo(0);
    }
  }
};
</script>

<style scoped>
.mainclass::-webkit-scrollbar {
  display: none;
}
</style>