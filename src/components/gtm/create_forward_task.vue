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
              <el-col :span="6">公网ip:<div><el-input
                style=""
                type="textarea"
                class="filter-item"
                readonly
                v-model="forward_pip"
              >
              </el-input></div></el-col>
              <el-col :span="6">内网ip:<div><el-input
                style=""
                type="textarea"
                class="filter-item"
                readonly
                v-model="forward_iip"
              >
              </el-input></div></el-col>
              <el-col :span="6">端口:<div><el-input
                style=""
                class="filter-item"
                readonly
                v-model="forward_port"
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
        name: "create_forward_task",
      data(){
          return {
             id: "",
            amount: '',
            task_id: '',
            forward_port: "",
            forward_pip: '',
            forward_iip: '',
            intervalId : '',
            result: 0,
            title: '正在创建forward',
        }
      },
      methods: {
          fetchData() {
            this.$axios.get(`/api/ops/create-forward/${this.id}`).then(response => {
              this.forward_port = response.data['forward_port'];
            })
          },
        post_task() {
            if (this.get_create_forward === '1'){
              this.del_create_forward();
              showLoading();
              this.$axios.post('/api/ops/create-forward-task',
                {'forward_template': this.id, 'amount': this.amount}).then(response => {
                  this.task_id = response.data['id'];
                  let ResultRefreshObj = setInterval(() => {
                    this.GetTaskResult(response.data['id']);
                    }, 2000);
                  this.intervalId = ResultRefreshObj
                }
              )
            }
        },
        GetTaskResult(){
            this.$axios.get(`/api/ops/create-forward-task/${this.task_id}`).then(response => {
              this.result = parseInt(response.data['result']);
              if (response.data['status'] === '2') {
                if (response.data['_false'] === null || response.data['_false'] === '') {
                  this.forward_pip = response.data["forward_pip"];
                  this.forward_iip = response.data["forward_iip"];
                  hideLoading();
                  this.title = '创建成功';
                }else {
                  hideLoading();
                  this.title = '创建失败';
                  this.$message({
                    type: "error",
                    message: "创建失败，联系运维!"
                  });
                  this.forward_pip = response.data['_false'];
                }
                clearInterval(this.intervalId);
              }
            })
        },
        ...mapMutations({
          del_create_forward: 'del_create_forward'
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
            'get_create_forward'
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
