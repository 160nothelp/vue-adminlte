<template>
  <div>
    <el-card>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="标题" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="工单类型" prop="type">
          <el-select v-model="ruleForm.type" placeholder="请选择工单类型">
            <el-option v-for="item in types" :key="item.id" :value="item.name"></el-option>
          </el-select>
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
        <el-form-item label="附件">
          <el-upload
            ref="upload"
            :action="uploadurl"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
          >
            <el-button slot="trigger" size="mini" type="success" plain :disabled="count>2">上传</el-button>
            <div slot="tip" class="el-upload__tip">
              <p>
                <a style="color: red">最多只能上传3个文件</a>
              </p>
            </div>
          </el-upload>
          <hr class="heng" />
          <div v-if="enclosureData.length>0" class="ticketenclosure">
            <ul>
              <li
                v-for="item in enclosureData"
                :key="item.id"
                v-if="item.file"
                style="list-style:none"
              >
                <i class="fa fa-paperclip"></i>
                <a
                  :href="apiurl + '/upload/' + item.file"
                  :download="item.file"
                >{{item.file.split('/')[1]}}</a>
                <el-tooltip class="item" effect="dark" content="删除附件" placement="right">
                  <el-button type="text" icon="el-icon-delete" @click="deleteEnclosure(item.id)"></el-button>
                </el-tooltip>
              </li>
            </ul>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">更新</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getConversionTime } from "@/utils";

export default {
  data() {
    return {
      id: "",
      count: 0,
      types: [],
      ruleForm: {},
      enclosureData: [],
      enclosureForm: {
        ticket: "",
        create_user: localStorage.getItem("username"),
        file: ""
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
        preview: true, // 预览
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        ol: true, // 有序列表
        help: true
      },
      STATUS_TEXT: {
        "0": "未接收",
        "1": "正在处理",
        "2": "已完成",
        "3": "搁置"
      },
      uploadurl: "/api/tools/fileupload",
      apiurl: window.location.protocol + "//" + window.location.host,
      route_path: this.$route.path.split("/")
    };
  },
  methods: {
    fetchData() {
      this.$axios
        .get(`/api/workticket/worktickers/${this.id}`)
        .then(response => {
          this.ruleForm = response.data;
          this.ticket_id = this.ruleForm.id;
        });
    },
    fetchEnclosureData() {
      this.$axios
        .get("/api/workticket/ticketenclosures", {
          params: {
            ticket__id: this.id
          }
        })
        .then(response => {
          this.enclosureData = response.data;
          this.count = response.data.length;
        });
    },
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
    beforeAvatarUpload(file) {
      const formData = new FormData();
      formData.append("username", this.username);
      formData.append("file", file);
      formData.append("create_time", getConversionTime(file.lastModified));
      formData.append("type", file.type);
      formData.append("archive", this.route_path[1]);
      this.$axios
        .post("/api/tools/upload", formData)
        .then(response => {
          this.enclosureForm.file = response.data.filepath;
          this.enclosureForm.ticket = this.id;
          this.$axios.post(
            "/api/workticket/ticketenclosures",
            this.enclosureForm
          );
          if (response.statusText === "Created") {
            this.$message({
              type: "success",
              message: "恭喜你，上传成功"
            });
            this.fetchEnclosureData();
          }
        })
        .catch(error => {
          this.$message.error("上传失败");
          this.$refs.upload.clearFiles();
          console.log(error);
        });
    },
    deleteEnclosure(id) {
      this.$axios.delete(`/api/workticket/ticketenclosures/${id}`);
      setTimeout(this.fetchEnclosureData, 1000);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .get(`/api/workticket/worktickers/${this.id}`)
            .then(response => {
              const ticket_status = response.data.ticket_status;
              if (ticket_status > 0) {
                this.$message.error(
                  "抱歉，当前工单状态为：" +
                    this.STATUS_TEXT[ticket_status] +
                    "，已经不能再修改"
                );
              } else {
                this.$axios
                  .put(`/api/workticket/worktickers/${this.id}`, this.ruleForm)
                  .then(response => {
                    this.$message({
                      type: "success",
                      message: "恭喜你，更新成功"
                    });
                    this.$router.push("/worktickets");
                  });
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  created() {
    this.id = this.$route.params.item;
    this.fetchData();
    this.fetchEnclosureData();
  }
};
</script>

<style scoped>
>>> input[type="file"] {
  display: none;
}
</style>
