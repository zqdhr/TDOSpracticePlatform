import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    navindex:0,
    uploadUrl:'http://192.168.1.11:8088/upload_excel',
    ad_menus: [
      { text: "统计分析", path: "/" },
      { text: "课程管理", path: "/statisticalAnalysis" },
      {
        text: "库",
        path: "",
        children: [
          { text: "实验库", path: "" },
          { text: "课件库", path: "" },
          { text: "镜像库", path: "" },
          { text: "题库", path: "" },
        ],
        showChilren: false,
      },
      { text: "运行实验管理", path: "/experimentManage" },
      { text: "人员管理", path: "/personnelManage" },
    ],
    tea_menus: [
      { text: "开课管理", path: "/teacher" },
      { text: "备课管理", path: "/lessonPreparationManagement" },
      { text: "作业管理", path: "/jobManagement"},
      { text: "实验报告管理", path: "/experimentalReport"},
      { text: "课堂管理", path: "/courseManagement" },
    ]
    
  
  },
  mutations: {
    updateNavindex(state, value) {
      state.navindex = value
    }
  },
  actions: {
  },
  modules: {
  }
})
