import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    navindex:0,
    uploadUrl:'http://192.168.1.138:8111/upload_excel',
    ad_menus: [
      { text: "统计分析", path: "/admin" },
      { text: "课程管理", path: "/admin/statisticalAnalysis" },
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
      { text: "运行实验管理", path: "/admin/experimentManage" },
      { text: "人员管理", path: "/admin/personnelManage" },
    ],
    tea_menus: [
      { text: "开课管理", path: "/teacher" },
      { text: "备课管理", path: "/teacher/lessonPreparationManagement" },
      { text: "作业管理", path: "/teacher/jobManagement"},
      { text: "实验报告管理", path: "/teacher/experimentalReport"},
      { text: "课堂管理", path: "/teacher/courseManagement" },
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
