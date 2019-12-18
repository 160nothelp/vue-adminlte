<template>
  <div>
    <chang_password></chang_password>
    <header class="main-header" >
      <a href="#" class="logo">
        <span class="logo-mini"><b>O</b></span>
        <span class="logo-lg"><b>OPS&nbsp;&nbsp;</b></span>
      </a>
      <nav class="navbar navbar-static-top">
        <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
          <span class="sr-only">Toggle navigation</span>
        </a>
        <div class="navbar-custom-menu">
          <ul class="nav navbar-nav">
            <li class="dropdown user user-menu">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                <img src="static/img/user2-160x160.jpg" class="user-image" alt="User Image">
                <span class="hidden-xs">{{ userName}}</span>
              </a>
              <ul class="dropdown-menu">
                <li class="user-header">
                  <img src="static/img/user2-160x160.jpg" class="img-circle" alt="User Image">
                  <p>{{userName}}</p>
                </li>
                <li class="user-footer">
                  <div class="pull-left">
                    <el-button  class="btn btn-default btn-flat" @click="openDialogVisible" >修改密码</el-button>
                  </div>
                  <div class="pull-right">
                    <a @click="logout" class="btn btn-default btn-flat">登出</a>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  </div>
</template>

<script>
    import {mapMutations} from 'vuex'
    import chang_password from "./chang_password";

    export default {
        name: "adminlte_header",
        props:['userName'],
        data(){
            return{
                dialogFormVisible: false
            }
        },
        methods:{
            logout(){
                this.$axios.get('/api/user/logout').then((response) => {
                    if (response.data['logout']) {
                        this.del_token();
                        this.$router.push({
                            path: '/login'
                        });
                    }
                })
            },
            openDialogVisible(){
                this.dialogFormVisible = true;
                this.set_dialogFormVisible(true);
            },
            ...mapMutations({
                del_token: "del_token",
                set_dialogFormVisible: 'set_dialogFormVisible'
            }),

        },
        components:{
            chang_password
        }
    }
</script>

<style scoped>

</style>
