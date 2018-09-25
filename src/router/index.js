import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/Login'
import home from '@/components/Home'
import users from '@/components/users/user'
import rights from '@/components/rights/Right'
import roles from '@/components/rights/Roles'
import categories from '@/components/products/categories'
import goods from '@/components/products/goods'
import add from '@/components/products/goods-add'
import params from '@/components/products/params'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/',
      name: 'home',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      children: [
        {
          path: '/Users',
          name: 'users',
          component: users
        },
        {
          path: '/rights',
          name: 'rights',
          component: rights
        },
        {
          path: '/Roles',
          name: 'roles',
          component: roles
        },
        {
          path: '/Categories',
          name: 'categories',
          component: categories
        },
        {
          path: '/Goods',
          name: 'goods',
          component: goods
        },
        {
          path: '/Goods-add',
          name: 'add',
          component: add
        },
        {
          path: '/Params',
          name: 'params',
          component: params
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token')
  if (token || to.path === '/login') {
    next()
  } else {
    next('/login')
  }
})
export default router
