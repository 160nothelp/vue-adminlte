<template>
  <div class="components-container">
    <el-card>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="白名单" prop="white_ip">
          <el-input v-model="ruleForm.white_ip" placeholder="填入ip，一次一条"></el-input>
        </el-form-item>
        <el-form-item label="结果" prop="result">
          <el-input v-model="ruleForm.result" placeholder="处理结果" readonly></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="postForm('ruleForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { showLoading, hideLoading } from "../../loading";

export default {
  data() {
    return {
      ruleForm: {
        white_ip: "",
        result: ""
      },
      rules: {
        white_ip: [
          { required: true, message: "请输入IP", trigger: "blur" },
          {
            required: true,
            pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
            message: "请输入正确的ip",
            trigger: "blur"
          }
        ]
      },
      intervalId: ""
    };
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    postForm(formName) {
      showLoading();
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post("/api/ops/tmp-cyt-iptables", this.ruleForm)
            .then(response => {
              if (response.statusText === "Created") {
                let ResultRefreshObj = setInterval(() => {
                  this.getWhitetaskresult(response.data["id"]);
                }, 2000);
                this.intervalId = ResultRefreshObj;
              } else {
                hideLoading();
              }
            });
        } else {
          hideLoading();
        }
      });
    },
    getWhitetaskresult(task_id) {
      this.$axios.get(`/api/ops/tmp-cyt-iptables/${task_id}`).then(response => {
        this.ruleForm.result = response.data["result"];
        if (response.data["status"] === "2") {
          clearInterval(this.intervalId);
          hideLoading();
        }
      });
    }
  }
};
</script>
<style scoped>
</style>