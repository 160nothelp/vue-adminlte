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
  }
};

export default mutations
