import * as types from './mutation-types'

const mutations = {
	[types.set_token](state,login_token) {
    localStorage.token = login_token;
		state.login_token = login_token
	},
  [types.del_token](state){
    localStorage.removeItem('token');
    state.login_token = null
  },
  [types.set_userlist](state,userlist){
    localStorage.setItem('userlist', JSON.stringify(userlist));
    state.userlist = userlist
  },
  [types.set_dialogFormVisible](state,dialogFormVisible){
	  state.dialogFormVisible = dialogFormVisible
  },
  [types.set_create_vpn](state, status){
	  state.create_vpn = status;
    localStorage.setItem('create_vpn', status)
  },
  [types.del_create_vpn](state){
	  localStorage.removeItem('create_vpn');
    state.create_vpn = null
  },
  [types.set_create_forward](state, status){
	  state.create_forward = status;
    localStorage.setItem('create_forward', status)
  },
  [types.del_create_forward](state){
	  localStorage.removeItem('create_forward');
    state.create_forward = null
  },
};

export default mutations
