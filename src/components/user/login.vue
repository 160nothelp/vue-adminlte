<template>
    <div class="container">
      <!-- 居中样式-->
      <div class="col-md-4 col-md-offset-4">
        <form class="form-login" @submit.prevent="onSubmit">
<!--          <div class="alert alert-warning" role="alert" v-if="login_status === 'u'" >{{ login_message }}</div>-->
<!--          <div class="alert alert-warning" role="alert" v-else-if="login_status === 'a'" >{{ login_message }}</div>-->
          <el-alert title="" type="error" center v-if="login_message.length" :closable="false">{{login_message}}</el-alert>
          <h2 class="text-center">欢迎登陆</h2>
          <div class="form-group">
            <label for="id_username">用户名:</label>
            <input type="text" name="username" class="form-control" id="id_username" placeholder="Username" autofocus required v-model="username">
          </div>
          <div class="form-group">
            <label for="id_password">密码:</label>
            <input type="password" name="password" class="form-control" id="id_password" placeholder="Password" required v-model="password">
          </div>
          <button type="reset" class="btn btn-default pull-left">重置</button>
          <button type="submit" class="btn btn-default pull-right">登录</button>
        </form>
      </div>
    </div>

</template>

<script>
    import qs from 'qs'
    import {mapMutations} from 'vuex'
    export default {
        name: "login",
        mounted() {
            document.getElementsByTagName("body")[0].className="login";
        },
        data(){
            return{
                username: [],
                password: [],
                login_status: [],
                login_message: [],

            }
        },
        methods: {
            onSubmit(){
                this.$axios.post('/api/user/login', {'username': this.username, 'password': this.password}).then(response => {
                    this.set_token(response.data['token']);
                    this.$axios.post('/api/sso-wiki/oss-wiki-sigup-check', {'username': this.username, 'password': this.password}).then(
                      response => {
                        if (response.data['status'] === 233){
                          this.$message({
                            type: "warning",
                            message: "wiki密码不同步!"
                          });
                        }else if(response.data['status'] === 201){
                          this.$axios.get(`/wiki/_accounts/login_api/${this.username}/${this.password}/`)
                        } else if(response.data['permission'] === 'pass'){
                          console.log('no wiki');
                        } else {
                          this.$message({
                            type: "warning",
                            message: "wiki出现了怪怪的错误!"
                          });
                        }
                      }
                    );
                    this.$router.push({
                        path: '/'
                    });
                }).catch((error) => {
                    if("non_field_errors" in error.response.data){
                        this.login_message = '用户名密码错误';
                    }
                })

            },
            ...mapMutations({
                set_token: "set_token"
            })
        },
        beforeDestroy: function() {
            document.body.removeAttribute("class","login");
        }
    }
</script>

<style scoped>
  @import "../../common/css/login.css";
</style>
