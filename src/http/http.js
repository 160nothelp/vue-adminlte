import axios from 'axios'
import router from '../router'
import store from '../store'
import { showLoading, hideLoading } from '../loading'
import { Message } from 'element-ui';


axios.defaults.timeout = 50000;
axios.interceptors.request.use(
  config => {
    showLoading();
    if (localStorage.getItem('token')){
      config.headers.Authorization = `JWT ${localStorage.getItem('token')}`;
      //config.headers.common['X-CSRFToken'] = localStorage.getItem('token')
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
    // if(response.data['permission']){
    //   router.replace({
    //     path: '/index',
    //   })
    // }
    return response
  },
  error => {
    hideLoading();
    switch(error.response.status) {
      case 401:
        hideLoading();
        store.commit('del_token');
        // 只有在当前路由不是登录页面才跳转
        router.currentRoute.path !== '/login' &&
        router.replace({
          path: '/login',
        });
        Message.error({message: '请重新登录', duration: 5000});
        break;
      case 403:
        hideLoading();
        router.replace({
          path: '/index',
        });
        break;
      case 502:
        hideLoading();
        store.commit('del_token');
        router.currentRoute.path !== '/login' &&
        router.replace({
          path: '/login',
        });
        Message.error({message: '服务器异常502', duration: 5000});
        break;
      case 500:
        hideLoading();
        Message.error({message: '服务器异常500', duration: 5000});
        break;
    }
    return Promise.reject(error);
  }
);
export default axios
