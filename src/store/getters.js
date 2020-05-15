export const login_token = state => state.login_token;
export const get_userlist = state => {
  if (state.userlist){
    return state.userlist
  }else
    return JSON.parse(localStorage.getItem('userlist'))
};
export const get_dialogFormVisible = state => state.dialogFormVisible;
export const get_create_vpn = state => {
  if (state.create_vpn){
    return state.create_vpn
  }else {
    return localStorage.getItem('create_vpn')
  }
};
export const get_create_forward = state => {
  if (state.create_forward){
    return state.create_forward
  }else {
    return localStorage.getItem('create_forward')
  }
};

