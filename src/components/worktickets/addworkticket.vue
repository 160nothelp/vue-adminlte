<template>
  <div class="components-container">
    <el-card>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="标题" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="工单类型" prop="type">
          <div class="table-button">
            <el-select v-model="ruleForm.type" placeholder="请选择工单类型">
              <el-option v-for="item in types" :key="item.id" :value="item.name"></el-option>
            </el-select>

            <router-link to="/editworktype/">
              <el-button type="primary">添加类型</el-button>
            </router-link>
          </div>
        </el-form-item>
        <el-form-item label="工单内容" prop="content">
          <mavon-editor
            style="z-index: 1"
            v-model="ruleForm.content"
            code_style="monokai"
            :toolbars="toolbars"
            @imgAdd="imgAdd"
            ref="md"
          ></mavon-editor>
          <a class="tips">Tip：截图可以直接 Ctrl + v 粘贴到工单内容里面</a>
        </el-form-item>
        <el-form-item label="工单等级" prop="level">
          <el-rate
            v-model="ruleForm.level"
            :colors="['#99A9BF', '#F7BA2A', '#ff1425']"
            show-text
            :texts="['E', 'D', 'C', 'B', 'A']"
          ></el-rate>
          <a class="tips">Tip：星数代表问题紧急程度，星数越多，代表越紧急</a>
        </el-form-item>
        <el-form-item>
          <hr class="heng" />
          <el-upload
            ref="upload"
            :action="uploadurl"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :file-list="fileList"
          >
            <el-button slot="trigger" size="small" type="primary" :disabled="count>2">上传文件</el-button>(可以不用上传)
            <div slot="tip" class="el-upload__tip">
              <p>
                上传文件不超过10m，
                <a style="color: red">最多只能上传3个文件</a>
              </p>
            </div>
          </el-upload>
          <hr class="heng" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="postForm('ruleForm')">提交</el-button>
          <el-button type="danger"  @click="resetForm('ruleForm')">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getConversionTime } from "../../utils";

export default {
  data() {
    return {
      ruleForm: {
        name: "",
        type: "",
        content: "",
        create_user: localStorage.getItem("username"),
        level: 2,
        action_user: localStorage.getItem("username"),
        edit_user: ""
      },
      rules: {
        name: [{ required: true, message: "请输入工单标题", trigger: "blur" }],
        content: [
          { required: true, message: "请输入工单内容", trigger: "blur" }
        ],
        type: [{ required: true, message: "请选择工单类型", trigger: "blur" }],
        level: [
          {
            required: true,
            type: "number",
            message: "请确认工单等级",
            trigger: "blur"
          }
        ]
      },
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        ol: true, // 有序列表
        help: true,
        subfield: false, // 单双栏模式
        preview: true // 预览
      },
      enclosureForm: {
        ticket: "",
        create_user: localStorage.getItem("username"),
        file: ""
      },
      types: [],
      count: 0,
      fileList: [],
      uploadurl: "/api/tools/fileupload",
      route_path: this.$route.path.split("/")
    };
  },
  methods: {
    imgAdd(pos, file) {
      var md = this.$refs.md;
      const formData = new FormData();
      formData.append("username", this.enclosureForm.create_user);
      formData.append("file", file);
      formData.append("create_time", getConversionTime(file.lastModified));
      formData.append("type", file.type);
      formData.append("archive", this.route_path[1]);
      this.$axios.post("/api/tools/upload", formData).then(response => {
        md.$imglst2Url([[pos, response.data.file]]);
      });
    },
    getTypes() {
      this.$axios.get("/api/workticket/tickettypes").then(response => {
        this.types = response.data;
      });
    },
    handleSuccess(file, fileList) {
      this.fileList.push(fileList.raw);
      this.count += 1;
    },
    handleRemove(file, fileList) {
      this.fileList.remove(file);
      this.count -= 1;
    },
    postForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post("/api/workticket/worktickers", this.ruleForm)
            .then(response => {
              if (response.statusText === "Created") {
                this.$message({
                  type: "success",
                  message: "恭喜你，新建成功"
                });
              }
              for (var fileList of this.fileList) {
                const formData = new FormData();
                formData.append("username", this.enclosureForm.create_user);
                formData.append("file", fileList);
                formData.append("create_time", getConversionTime(fileList.uid));
                formData.append("type", fileList.type);
                formData.append("archive", this.route_path[1]);
                this.$axios.post("/api/tools/upload", formData).then(res => {
                  this.enclosureForm.file = res.data.filepath;
                  this.enclosureForm.ticket = response.data.id;
                  this.$axios.post(
                    "/api/workticket/ticketenclosures",
                    this.enclosureForm
                  );
                });
              }
              this.$router.push("/worktickets");
            });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
  created() {
    this.getTypes();
  }
};
</script>

<style scoped>
>>> input[type="file"] {
  display: none;
}
</style>
