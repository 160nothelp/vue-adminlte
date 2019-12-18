import axios from 'axios'
import router from './router'
import store from './store'
import { showLoading, hideLoading } from './loading'


axios.defaults.timeout = 50000;
axios.interceptors.request.use(
  config => {
    showLoading();
    if (localStorage.getItem('token')){
      config.headers.common['X-CSRFToken'] = localStorage.getItem('token')
    }
    return config
  },
  err => {
    hideLoading();
    return Promise.reject(err)
  },
);

axios.interceptors.response.use(
  response => {
    hideLoading();
    if(response.data['nologin']) {
      store.commit('del_token');
        // 只有在当前路由不是登录页面才跳转
        router.currentRoute.path !== '/login' &&
        router.replace({
          path: '/login',
        })
    }
    if(response.data['permission']){
      router.replace({
        path: '/permission-denied',
      })
    }
    return response
  },
  error => {
    if (error.response) {
      hideLoading();
    }
  }
);
export default axios
