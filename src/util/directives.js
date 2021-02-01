import emoji from './emoji'
// 自定义指令
const directives = {
    emoji
}

export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
  },
}