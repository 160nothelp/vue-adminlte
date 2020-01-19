import Vue from 'vue'
import Router from 'vue-router'

import Login from '../components/login'
import Lte from '../components/lte'
import Hosts from '../components/hosts_page'
import Slb from '../components/slb_page'
import Search from '../components/search'
import EcsDeatil from '../components/ecs_detail'
import switch_gtm from "../components/switch_gtm"
import permission_denied from "../components/permission_denied"
import worktickets from '../components/worktickets/worktickets'

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: 'ops'
      }
    },
    {
      path: '/',
      name: 'lte',
      component: Lte,
      children: [
        {
          path: '/',
          redirect: 'hosts'
        },
        {
          path: 'hosts',
          meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
            title: 'ops'
          },
          component: Hosts
        },
        {
          path: 'slb',
          meta: {
            requireAuth: true,
            title: 'ops'
          },
          component: Slb
        },
        {
          path: 'search',
          meta: {
            requireAuth: true,
            title: 'ops'
          },
          component: Search
        },
        {
          path: 'datail/:item',
          name: 'Details',
          meta: {
            requireAuth: true,
            title: 'ops'
          },
          component: EcsDeatil
        },
        {
          path: 'get-domain',
          meta: {
            requireAuth: true,
            title: 'ops'
          },
          component: switch_gtm
        },
        {
          path: 'permission-denied',
          meta: {
            title: 'ops'
          },
          component: permission_denied
        },
        {
          path: 'worktickets',
          meta: {
            title: 'ops'
          },
          component: worktickets
        },
        ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (localStorage.getItem('token')) {// 通过vuex state获取当前的token是否存在
      next();
    }
    else {
      next({
        path: '/login',
      })
    }
  }
  else {
    next();
  }
});

export default router
