<template>
  <div>
    <el-card>
      <el-card>
        <el-row :gutter="20">
          <el-col :span="12" :offset="6">
            <div>
              <h1 style="text-align:center; margin-top: 40px">
                <a class="title" style="color: black">{{title}}
                </a>
              </h1>
            </div>
          </el-col>
          <el-col :span="12" :offset="6" style="margin-top: 160px">
            <span style="font-size: 30px">创建进度：</span>
            <el-progress :text-inside="true" :stroke-width="26" :percentage="this.result"></el-progress>
          </el-col>
          <el-col :span="12" :offset="6" style="margin-top: 80px">
            <hr class="heng" style="margin-top: 40px"/>
            <el-row type="flex" justify="space-between">
              <el-col :span="6">ip:<div><el-input
                style=""
                type="textarea"
                class="filter-item"
                readonly
                v-model="vpn_ip"
              >
              </el-input></div></el-col>
              <el-col :span="6">端口:<div><el-input
                style=""
                class="filter-item"
                readonly
                v-model="vpn_port"
              >
              </el-input></div></el-col>
              <el-col :span="6">密码:<div><el-input
                style=""
                class="filter-item"
                readonly
                v-model="vpn_password"
              >
              </el-input></div></el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-card>
    </el-card>
  </div>
</template>

<script>
  import { showLoading, hideLoading } from '../../loading'
  import {mapGetters}  from 'vuex'
  import { mapMutations } from "vuex";
    export default {
        name: "create_vpn_task",
      data(){
          return {
             id: "",
            amount: '',
            task_id: '',
            vpn_port: "",
            vpn_password: "",
            vpn_ip: '',
            intervalId : '',
            result: 0,
            title: '正在创建vpn',
        }
      },
      methods: {
          fetchData() {
            this.$axios.get(`/api/ops/create-shadowsocket/${this.id}`).then(response => {
              this.vpn_password = response.data['vpn_password'];
              this.vpn_port = response.data['vpn_port'];
            })
          },
        post_task() {
            if (this.get_create_vpn === '1'){
              this.del_create_vpn();
              showLoading();
              this.$axios.post('/api/ops/create-shadowsocket-task',
                {'vpn_template': this.id, 'amount': this.amount}).then(response => {
              this.task_id = response.data['id'];
              let ResultRefreshObj = setInterval(() => {
                this.GetTaskResult(response.data['id']);
                }, 2000);
              this.intervalId = ResultRefreshObj
            })
            }
        },
        GetTaskResult(){
            this.$axios.get(`/api/ops/create-shadowsocket-task/${this.task_id}`).then(response => {
              this.result = parseInt(response.data['result']);
              if (response.data['status'] === '2') {
                if (response.data['_false'] === null || response.data['_false'] === ''){
                  this.vpn_ip = response.data["vpn_ip"];
                  clearInterval(this.intervalId);
                  hideLoading();
                  this.title = '创建成功';
                }else {
                  hideLoading();
                  this.title = '创建失败';
                  this.$message({
                    type: "error",
                    message: "创建失败，联系运维!"
                  });
                  this.vpn_ip = response.data['_false'];
                }
                clearInterval(this.intervalId);
              }
            })
        },
        ...mapMutations({
          del_create_vpn: 'del_create_vpn'
        })
      },
      created() {
          this.id = this.$route.params.item;
          this.amount = this.$route.params.amount;
          this.fetchData();
          this.post_task();
      },
      computed: {
          ...mapGetters([
            'get_create_vpn'
          ])
      }
    }
</script>

<style scoped>
  .el-row {
      margin-bottom: 300px;
      &:last-child {
        margin-bottom: 0;
      }
  }
  .el-col {
    border-radius: 4px;
  }
</style>
