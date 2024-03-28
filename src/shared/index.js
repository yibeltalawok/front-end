import components from "./components";
import filters from "./filters";
import plugins from "./plugins";

export default {
  install(Vue) {
    Vue.use(components);
    Vue.use(filters);
    Vue.use(plugins);
  }
};
