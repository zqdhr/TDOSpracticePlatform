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



Vue.use(ElementUI);
Vue.use(toastRegistry)

Vue.prototype.$Base64 = Base64;
Vue.config.productionTip = false

import Directives from './util/directives'
Vue.use(Directives)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
