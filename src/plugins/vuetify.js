import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#0062BF",
        primaryDark: "#388E3C",
        secondary: "#091e30",
        accent: "#f6f7f9",
        error: "#f44336",
        warning: "#ffeb3b",
        info: "#2196f3",
        success: "#01AE53",
      },
      dark: {
        primary: "#01AE53",
        background: "#f6f7f9"
      }
    },
  },
});
