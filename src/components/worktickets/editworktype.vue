<template>
  <div>
    <el-card>
      <div class="table-button">
        <el-button type="primary" icon="el-icon-plus" @click="show_status=true">新建类别</el-button>
      </div>
      <br />
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="工单类型id"></el-table-column>
        <el-table-column prop="name" label="工单类型名称"></el-table-column>
        <el-table-column prop="desc" label="描述" sortable="custom"></el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" icon="delete" @click.native="delType(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="创建类别" :visible.sync="show_status">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="工单类别" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入工单类别"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input type="textarea" :rows="3" v-model="ruleForm.desc" placeholder="请输入描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="show_status=false">取 消</el-button>
        <el-button type="primary" @click="postForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      show_status: false,
      ruleForm: {
        name: "",
        desc: ""
      },
      rules: {
        name: [{ required: true, message: "请输入工单类型", trigger: "blur" }]
      }
    };
  },
  methods: {
    fetchData() {
      this.$axios.get("/api/workticket/tickettypes").then(response => {
        this.tableData = response.data;
      });
    },
    postForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const formData = new FormData();
          formData.append("name", this.ruleForm.name);
          formData.append("desc", this.ruleForm.desc);
          this.$axios
            .post("/api/workticket/tickettypes", formData)
            .then(response => {
              this.show_status = false;
              if (response.statusText === "Created") {
                this.ruleForm.name = "";
                this.ruleForm.desc = "";
                this.fetchData();
              }
            });
        }
      });
    },
    delType(scope) {
      this.$axios
        .delete(`/api/workticket/tickettypes/${scope.row.id}`)
        .then(response => {
          this.fetchData();
        });
    }
  },
  created() {
    this.fetchData();
  }
};
</script>
<style scoped>
</style>