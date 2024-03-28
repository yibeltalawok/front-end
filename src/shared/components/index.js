import FormErrorMessages from "./FormErrorMessages.vue";
import InternalErrorAlert from "./InternalErrorAlert.vue";
import NetworkErrorAlert from "./NetworkErrorAlert.vue";
import errorloading from "./dataloadingerror.vue";
import loadingdata from "./loadingdata.vue";


export default {
  install(Vue) {
    Vue.component("form-error-messages", FormErrorMessages);
  }
};

export { 
  NetworkErrorAlert, 
  InternalErrorAlert, 
  errorloading, 
  loadingdata 
};
