import Vue from 'vue'
import Router from 'vue-router'

import Login from '../components/user/login'
import Lte from '../components/adminlte/lte'
import Hosts from '../components/hosts_slb/hosts_page'
import Slb from '../components/hosts_slb/slb_page'
import Search from '../components/hosts_slb/search'
import EcsDeatil from '../components/hosts_slb/ecs_detail'
import switch_gtm from "../components/gtm/switch_gtm"
import permission_denied from "../components/user/permission_denied"
import worktickets from '../components/worktickets/worktickets'
import addworkticket from '../components/worktickets/addworkticket.vue'
import viewworkticket from '../components/worktickets/viewworkticket.vue'
import editworkticket from '../components/worktickets/editworkticket.vue'
import editworktype from '../components/worktickets/editworktype.vue'
import tmp_cyt_iptables from '../components/gtm/tmp_cyt_iptables.vue'
import shadowsocks_vpn from "../components/gtm/shadowsocks_vpn";
import create_vpn_task from "../components/gtm/create_vpn_task";
import forward from "../components/gtm/forward";
import create_forward_task from "../components/gtm/create_forward_task";
import dashboard from "../components/index_dashboard/dashboard";


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
          redirect: 'index'
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
          path: 'index',
          meta: {
            title: 'ops'
          },
          component: dashboard
        },
        {
          path: 'worktickets',
          meta: {
            title: 'ops'
          },
          component: worktickets
        },
        {
          path: 'addworkticket',
          meta: {
            title: 'ops'
          },
          component: addworkticket
        },
        {
          path: 'viewworkticket/:item',
          meta: {
            title: 'ops'
          },
          component: viewworkticket
        },
        {
          path: 'editworkticket/:item',
          meta: {
            title: 'ops'
          },
          component: editworkticket
        },
        {
          path: 'editworktype',
          meta: {
            title: 'ops'
          },
          component: editworktype
        },
        {
          path: 'cyt-iptables',
          meta: {
            title: 'ops'
          },
          component: tmp_cyt_iptables
        },
        {
          path: 'create_shadowsocks_vpn',
          meta: {
            title: 'ops'
          },
          component: shadowsocks_vpn
        },
        {
          path: 'create_forward',
          meta: {
            title: 'ops'
          },
          component: forward
        }
        ]
    },
    {
      path: '/create_vpn_task/:amount/:item',
      name: 'cvt',
      component: create_vpn_task,
      meta: {
        title: 'ops'
      }
    },
    {
      path: '/create_forward_task/:amount/:item',
      name: 'cft',
      component: create_forward_task,
      meta: {
        title: 'ops'
      }
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
