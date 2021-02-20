import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


/*视频样式 */
import "video.js/dist/video-js.css";
import "vue-video-player/src/custom-theme.css";

/*edit编辑器的样式 */
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import './assets/less/common.less'
import toastRegistry from './components/toast/index'
//ElementUI.Dialog.props.lockScroll.default = false;
import Base64 from './util/base64.js' 


import htmlToPdf from '@/util/htmlToPdf'
// 使用Vue.use()方法就会调用工具方法中的install方法
Vue.use(htmlToPdf)
Vue.use(ElementUI);
Vue.use(toastRegistry)

Vue.prototype.$Base64 = Base64;
Vue.config.productionTip = false


Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

import Directives from './util/directives'
Vue.use(Directives)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
