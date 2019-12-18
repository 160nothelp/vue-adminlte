export const login_token = state => state.login_token;
export const get_userlist = state => {
  if (state.userlist){
    return state.userlist
  }else
    return JSON.parse(localStorage.getItem('userlist'))
};
export const get_dialogFormVisible = state => state.dialogFormVisible;
