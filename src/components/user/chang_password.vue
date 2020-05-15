<template>
  <el-dialog title="修改密码" :visible.sync="dialogFormVisible" :show-close="false" :destroy-on-close="true" >
<!--    <div class="alert alert-warning" role="alert" v-if="change_message">{{change_message}}</div>-->
    <el-alert title="" type="error" center v-if="change_message" :closable="false">{{change_message}}</el-alert>
    <el-form :model="form" ref="change_password">
      <el-form-item label="旧密码：" :label-width="formLabelWidth" prop="oldpassword" :rules="[
      { required: true, message: '旧密码不能为空'},
    ]">
        <el-input type="password" v-model="form.oldpassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码：" :label-width="formLabelWidth" prop="newpassword" :rules="[
      { required: true, message: '新密码不能为空'},
    ]">
        <el-input type="password" v-model="form.newpassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" :label-width="formLabelWidth" prop="checkpassword" :rules="[
      { required: true, message: '确认密码不能为空'},
    ]">
        <el-input type="password" v-model="form.checkpassword" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialogVisible">取 消</el-button>
      <el-button type="primary" @click="Change_password">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
    import {mapMutations} from 'vuex'

    export default {
        name: "chang_password",
        data(){
            return{
                form: {
                    oldpassword: '',
                    newpassword: '',
                    checkpassword: '',
                },
                formLabelWidth: '120px',
                change_message: ''
            }
        },
        methods: {
            closeDialogVisible() {
                // 清空form表单的数据
                this.$refs.change_password.resetFields();
                this.set_dialogFormVisible(false);
                this.change_message = ''
            },
            ...mapMutations({
                del_token: "del_token",
                set_dialogFormVisible: 'set_dialogFormVisible'
            }),
            Change_password() {
                this.$axios.post('/api/user/change-password', {'old_password': this.form.oldpassword,
                    'new_password': this.form.newpassword, 'check_password': this.form.checkpassword}).then((response) => {
                    this.closeDialogVisible();
                    this.del_token();
                    this.$router.push({
                        path: '/login'
                    })
                    }).catch((error) => {
                    this.change_message = error.response.data
                })
            }
        },

        computed: {
            dialogFormVisible(){
                return this.$store.getters['get_dialogFormVisible']
            }
        }
    }
</script>

<style scoped>

</style>
