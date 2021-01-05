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
    path:'/teacher',
    component: index,
    children:[
      {
        path: '/jobManage',//教师端作业管理
        name: 'jobManage',
        component: () => import(/* webpackChunkName: "about" */ '../views/teacher/jobManage.vue')
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
