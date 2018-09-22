import Vue from 'vue'
import App from './App'
import router from './router'
import VeeValidate from 'vee-validate'
import VeeValidateLocaleJa from 'vee-validate-locale-ja'

VeeValidate.Validator.localize('ja', VeeValidateLocaleJa)
Vue.use(VeeValidate, {
  locale: 'ja'
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
