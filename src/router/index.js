import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../views/index.vue'
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
   
    component: index,
    children:[
      {
        path: '/',
        name: 'statisticalAnalysis',//统计分析
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/statisticalAnalysis.vue')
      },
      {
        path: '/personnelManage',//管理员端人员管理
        name: 'personnelManage',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/personnelManage.vue')
      },
      {
        path: '/experimentManage',//运行实验管理
        name: 'experimentManage',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/experimentManage.vue')
      }
      
    ]
  },
  {
    path:'/teacher',//教师端
    component: index,
    children:[
      {
        path: '/',//开课管理
        name: 'newCourseManagement',
        component: () => import(/* webpackChunkName: "about" */ '../views/teacher/newCourseManagement.vue')
      },
      {
        path: '/jobManagement',//作业管理
        name: 'jobManagement',
        component: () => import(/* webpackChunkName: "about" */ '../views/teacher/jobManagement.vue')
      },
      {
        path: '/experimentalReport',//实验报告
        name: 'experimentalReport',
        component: () => import(/* webpackChunkName: "about" */ '../views/teacher/experimentalReport.vue')
      },
      {
        path: '/courseManagement',//课程管理
        name: 'courseManagement',
        component: () => import(/* webpackChunkName: "about" */ '../views/teacher/courseManagement.vue')
      },
      {
        path: '/lessonPreparationManagement',//备课管理
        name: 'lessonPreparationManagement',
        component: () => import(/* webpackChunkName: "about" */ '../views/teacher/lessonPreparationManagement.vue'),
       

      },
      {  
        path: '/couseDetail',//备课管理-课程详情
        name: 'couseDetail',
        component: () => import(/* webpackChunkName: "about" */ '../views/teacher/lp_courseDetail.vue'),
      }
     
    ]
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',//页面登录
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/login.vue')
  }
]

const router = new VueRouter({
  //mode: 'history',
  routes,
})


router.beforeEach((to, from, next) => {
  //对于登录页面不拦截
  if (to.path === '/login') {
    // 接下来的函数
    next();
  } else {
    //var会将作用域放大，let只是局部的作用域
    let username = sessionStorage.getItem('p_p-userName');
    if (username === null || username === '') {
      next('/login');
    } else {
      next();
    }
  }
});
export default router
