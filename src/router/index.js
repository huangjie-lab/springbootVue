import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/login.vue'
import Home from '../components/home.vue'
import UserList from '../components/admin/UserList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children:[
      {
        path:'/user',
        component:UserList
      }
    ]
  },
  {
    path:'/login',
    component:Login
  },
]

const router = new VueRouter({
  routes
})

// 全局路由前置导航守卫
router.beforeEach((to,from,next)=>{
  if(to.path === '/login') return next();
  const userInfo = window.sessionStorage.getItem('user');
  if(!userInfo) return next('/login');
  next();
})

export default router
