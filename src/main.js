import "material-design-icons-iconfont/dist/material-design-icons.css";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import Vue from "vue";
import App from "./App.vue";
//internal files
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import i18n from "./i18n";
import shared from "@/shared";
import Editor from 'vue-image-markup'
import DateFilter from "./filters/date"

import VueSocketIO from 'vue-socket.io'
import SocketIO from "socket.io-client"

Vue.use(new VueSocketIO({
  debug: true,
  connection: SocketIO('http://localhost:7000/', { transport : ['websocket'] }), //options object is Optional
  vuex: {
    store,
    actionPrefix: "SOCKET_",
    mutationPrefix: "SOCKET_"
  }
})
);


Vue.filter('date', DateFilter)

// third party
import VuetifyConfirm from "vuetify-confirm";
Vue.use(VuetifyConfirm, { vuetify });
Vue.use(Editor)
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'

Vue.use(PerfectScrollbar)
import "vue-notifyjs/themes/default.css";
import Notify from "vue-notifyjs";
Vue.use(Notify, {
  horizontalAlign: "right",
  verticalAlign: "top",
});

import VeeValidate from "vee-validate";
import "./registerServiceWorker";

Vue.use(shared);

Vue.use(VeeValidate);
// ''=====================================
import VueLayers from 'vuelayers'
import 'vuelayers/lib/style.css' // needs css-loader
Vue.use(VueLayers)
// ''=====================================


//html to paper table printer
import VueHtmlToPaper from "vue-html-to-paper";

const options = {
  name: "_blank",
  specs: ["fullscreen=yes", "titlebar=yes", "scrollbars=yes"],
};

Vue.use(VueHtmlToPaper, options);
//html to paper table printer
Vue.config.productionTip = false;
export default new Vue({
  router,
  store,
  vuetify,
  i18n,
  components: {
    Notify
},
  render: (h) => h(App),
}).$mount("#app");
