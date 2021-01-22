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
    redirect: '/admin',
    children:[
      {
        path: '/admin',
        name: 'statisticalAnalysis',//统计分析
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/statisticalAnalysis.vue')
      },
      {
        path: '/admin/personnelManage',//管理员端人员管理
        name: 'personnelManage',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/personnelManagement.vue')
      },
      {
        path: '/admin/experimentManage',//运行实验管理
        name: 'experimentManage',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/experimentManagement.vue')
      },
      {
        path: '/admin/courseManagement',//课程管理
        name: 'courseManagement',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/courseManagement.vue')
      },
      {
        path: '/admin/newCourse',//新建课程
        name: 'newCourse',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/newCourse.vue'),
        meta:{navindex:1},
      },
      {
        path: '/admin/courseDetail',//新建课程
        name: 'courseDetail',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/lp_courseDetail.vue'),
        meta:{navindex:1},
      },
      {
        path: '/admin/experimentLibrary',//实验库
        name: 'experimentLibrary',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/experimentLibrary.vue'),
        meta:{navindex:2},
      },

      {
        path: '/admin/ImageRepository',//镜像库
        name: 'ImageRepository',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/ImageRepository.vue'),
        meta:{navindex:2},
      },
      
      {
        path: '/admin/coursewareLibrary',//课件库
        name: 'coursewareLibrary',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/coursewareLibrary.vue'),
        meta:{navindex:2},
      },
      {
        path: '/admin/questionbankManagement',//题库
        name: 'questionbankManagement',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/questionbankManagement.vue'),
        meta:{navindex:2},
      },

      

   
      
    ]
  },
  {
    path:'/teacher',//教师端
    component: index,
    redirect: '/teacher/newCourseManagement',
    children:[
      {
        path: '/teacher/newCourseManagement',//开课管理
        name: 'newCourseManagement',
        component: () => import(/* webpackChunkName: "about" */ '../views/teacher/newCourseManagement.vue')
      },
      {
        path: '/teacher/jobManagement',//作业管理
        name: 'jobManagement',
        component: () => import(/* webpackChunkName: "about" */ '../views/teacher/jobManagement.vue')
      },
      {
        path: '/teacher/experimentalReport',//实验报告
        name: 'experimentalReport',
        component: () => import(/* webpackChunkName: "about" */ '../views/teacher/experimentalReport.vue')
      },
      {
        path: '/teacher/courseManagement',//课程管理
        name: 'courseManagement',
        component: () => import(/* webpackChunkName: "about" */ '../views/teacher/courseManagement.vue')
      },
      {
        path: '/teacher/lessonPreparationManagement',//备课管理
        name: 'lessonPreparationManagement',
        component: () => import(/* webpackChunkName: "about" */ '../views/teacher/lessonPreparationManagement.vue'),
       

      },
      {  
        path: '/teacher/couseDetail',//备课管理-课程详情
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
  },
  {
    path: '/home',//页面登录
    name: 'home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
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
    let admin_username = sessionStorage.getItem('p_p-admin_userName');
    let teacher_username = sessionStorage.getItem('p_p-teacher_userName');
    let user_id =  sessionStorage.getItem('userId');

    if(!(user_id &&user_id!=null)){
      next('/login');
    }
    if(to.path.indexOf("admin") != -1){
        if (admin_username === null || admin_username === '') {
          next('/login');
        } else {
          next();
        }
    }
    if(to.path.indexOf("teacher") != -1){
        if (teacher_username === null || teacher_username === '') {
          next('/login');
        } else {
          next();
        }
    }
    next();
  }
});
export default router
