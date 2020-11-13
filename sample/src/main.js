import Vue from 'vue'
import App from './App.vue'
import axios from 'axios';
Vue.prototype.$http = axios;
import 'element-ui/lib/theme-chalk/index.css';
import { extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';
 
// Add the required rule
extend('required', {
  ...required,
  message: 'This field is required'
});
 
// Add the email rule
extend('email', {
  ...email,
  message: 'This field must be a valid email'
});
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
