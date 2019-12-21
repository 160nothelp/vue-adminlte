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
                let dataObj_ = {'username': this.username, 'password': this.password};
                let dataObj = qs.stringify(dataObj_);
                this.$axios({
                    method: 'post',
                    url: '/api/user/login',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: dataObj,
                }).then((response)=>{
                    this.login_status = response.data['status'];
                    if (this.login_status === 'u'){
                        this.login_message = '登陆失败，账号或密码错误'
                    }else if (this.login_status === 'a'){
                        this.login_message = '账号未启用，请联系管理员'
                    }else {
                        this.set_token(response.data['token']);
                        this.$router.push({
                            path: '/'
                        });
                    }
                })
                // this.$axios.post('/api/user/login_', {'username': this.username, 'password': this.password}).then(response => {
                //     this.set_token(response.data['token']);
                //     this.$router.push({
                //         path: '/'
                //     });
                // })

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
  @import "../common/css/login.css";
</style>
