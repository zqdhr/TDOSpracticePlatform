import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../views/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: index,
    children:[
      {
        path: '/',
        name: '',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/statisticalAnalysis.vue')
      },
      {
        path: '/personnelManage',
        name: 'personnelManage',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/personnelManage.vue')
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
  routes
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
