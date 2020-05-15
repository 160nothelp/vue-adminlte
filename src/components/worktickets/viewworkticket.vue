<template>
  <div>
    <el-card>
      <div class="workticket">
        <el-card>
          <div slot="header" class="clearfix">
            <a class="title">{{ticketData.name}}</a>
            <hr class="heng" />
            <div class="appendInfo">
              <a class="ticketinfo create_user">
                <span class="han">工单创建时间：</span>
                {{ticketData.create_time | parseDate}}
              </a>
              <a class="ticketinfo create_user">
                <span class="han">
                  <a class="shu"></a>
                  工单发起人：
                </span>
                {{ticketData.create_user}}
              </a>
              <a class="ticketinfo action_user">
                <span class="han">
                  <a class="shu"></a>
                  工单指派者：
                </span>
                {{ticketData.action_user}}
              </a>
              <a class="ticketinfo action_user">
                <a class="shu"></a>
                <span class="han">最新回复人：</span>
                {{ticketData.edit_user}}
              </a>
              <a class="shu"></a>
              <span class="han">工单类型：</span>
              <a>{{ticketData.type}}</a>
              <a class="shu"></a>
              <span class="han">工单当前状态：</span>
              <el-tag
                :type="STATUS_TYPE[ticketData.ticket_status]"
              >{{STATUS_TEXT[ticketData.ticket_status]}}</el-tag>
            </div>
            <div class="appendInfo" v-if="ticketData.ticket_status!=2">
              <span class="han">工单操作：</span>
              <el-button type="success" size="small" @click="changeStatus">接收</el-button>
              <div class="action">
                <el-radio-group v-model="radio_status">
                  <el-radio label="0">不操作</el-radio>
                  <el-radio label="2">关闭工单</el-radio>
                  <el-radio label="1">更改指派人</el-radio>
                </el-radio-group>
                <div class="action" v-if="radio_status==1">
                  <el-select v-model="rowdata.action_user" filterable placeholder="请选择指派人">
                    <el-option v-for="item in users" :key="item.id" :value="item.username"></el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
          <vue-markdown :source="ticketData.content"></vue-markdown>
          <div v-if="ticketData.ticket_status<2">
            <hr class="heng" />
            <el-upload
              ref="upload"
              :action="uploadurl"
              :on-success="handleSuccess"
              :show-file-list="false"
            >
              <el-button
                slot="trigger"
                size="mini"
                type="danger"
                plain
                icon="upload2"
                :disabled="count>2"
              >上传附件</el-button>
              <div slot="tip" class="el-upload__tip">
                <p>
                  上传文件不超过10m，
                  <a style="color: red">最多只能上传3个文件</a>
                </p>
              </div>
            </el-upload>
            <hr class="heng" />
          </div>

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
                <el-button type="text" icon="el-icon-delete" @click="deleteEnclosure(item.id)"></el-button>
              </li>
            </ul>
          </div>
        </el-card>
      </div>
      <div v-if="ticketData.ticket_status<2">
        <el-form :model="commentForm" ref="mailcontent" label-width="80px">
          <el-form-item label="问题处理:" prop="content">
            <mavon-editor
              style="z-index: 1"
              v-model="mailcontent"
              code_style="monokai"
              :toolbars="toolbars"
              @imgAdd="imgAdd"
              ref="md"
            ></mavon-editor>
            <a class="tips">Tip：截图可以直接 Ctrl + v 粘贴到问题处理里面</a>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-card class="ticketcomment" v-if="commentData.length>0">
        <div v-for="item in commentData" :key="item.id">
          <hr class="heng" />
          <el-row>
            <el-col :span="1">
              <el-button type="primary" plain class="commentuser">{{item.create_user}}</el-button>
            </el-col>
            <el-col :span="20">
              <div class="dialog-box">
                <span class="bot"></span>
                <span class="top"></span>
                <div class="comment">
                  <vue-markdown :source="item.content"></vue-markdown>
                  <p class="commenttime">处理时间：{{item.create_time | parseDate}}</p>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import VueMarkdown from "vue-markdown";
import { getConversionTime } from "@/utils";

export default {
  data() {
    return {
      id: "",
      ticketData: {},
      ticket_id: "",
      count: 0,
      rowdata: {
        action_user: "",
        edit_user: ""
      },
      users: [],
      radio_status: "0",
      mailcontent: "",
      enclosureData: {},
      commentData: {},
      commentForm: {
        ticket: "",
        create_user: localStorage.getItem("username"),
        content: "【问题处理】"
      },
      enclosureForm: {
        ticket: "",
        create_user: localStorage.getItem("username"),
        file: ""
      },
      STATUS_TEXT: {
        "0": "未接收",
        "1": "正在处理",
        "2": "已完成",
        "3": "搁置"
      },
      STATUS_TYPE: {
        "0": "danger",
        "1": "success",
        "2": "info",
        "3": "warning"
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
      uploadurl: "/api/tools/fileupload",
      route_path: this.$route.path.split("/"),
      apiurl: window.location.protocol + "//" + window.location.host
    };
  },
  components: {
    VueMarkdown
  },
  methods: {
    fetchData() {
      this.$axios
        .get(`/api/workticket/worktickers/${this.id}`)
        .then(response => {
          this.ticketData = response.data;
          this.ticket_id = this.ticketData.id;
          this.rowdata.action_user = this.ticketData.action_user;
          this.rowdata.edit_user = this.ticketData.edit_user;
        });
    },
    getUsers() {
      this.$axios.get("/api/user/users").then(response => {
        this.users = response.data;
      });
    },
    CommentData() {
      this.$axios
        .get("/api/workticket/ticketcomments", {
          params: {
            ticket__id: this.id
          }
        })
        .then(response => {
          this.commentData = response.data;
        });
      this.commentForm.content = "";
    },
    changeStatus() {
      const data = {
        ticket_status: 1,
        action_user: localStorage.getItem("username")
      };
      this.$axios
        .patch(`/api/workticket/worktickers/${this.ticket_id}`, data)
        .then(() => {
          this.fetchData();
        });
    },
    handleSuccess(file, fileList) {
      const formData = new FormData();
      formData.append("username", this.enclosureForm.create_user);
      formData.append("file", fileList.raw);
      formData.append("create_time", getConversionTime(fileList.uid));
      formData.append("type", fileList.raw.type);
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
          setTimeout(this.EnclosureData, 1000);
          if (response.statusText === "Created") {
            this.$message({
              type: "success",
              message: "恭喜你，上传成功"
            });
          }
        })
        .catch(error => {
          this.$message.error("上传失败");
          this.$refs.upload.clearFiles();
          console.log(error);
        });
    },
    EnclosureData() {
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
    deleteEnclosure(id) {
      this.$axios.delete(`/api/workticket/ticketenclosures/${id}`);
      setTimeout(this.EnclosureData, 1000);
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
    submitForm() {
      this.$confirm(
        "你的操作即将提交，提交完成后会立即跳转到工单列表页面!",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(response => {
        this.commentForm.ticket = this.ticket_id;
        this.rowdata.edit_user = this.commentForm.create_user;
        if (this.radio_status === "1") {
          this.commentForm.content =
            "【工单状态变化】工单被" +
            this.commentForm.create_user +
            "重新指派给" +
            this.rowdata.action_user +
            "," +
            this.mailcontent;
        } else if (this.radio_status === "2") {
          this.rowdata.ticket_status = this.ticketData.ticket_status = this.radio_status;
          this.commentForm.content =
            "【工单状态变化】工单被" +
            this.commentForm.create_user +
            "关闭！" +
            this.mailcontent;
        } else {
          this.commentForm.content = "【问题处理】" + this.mailcontent;
        }
        this.$axios
          .post("/api/workticket/ticketcomments", this.commentForm)
          .then(response => {
            this.patchForm(this.rowdata);
            this.$router.push("/worktickets");
          });
      });
    },
    patchForm(rowdata) {
      this.$axios.patch(
        `/api/workticket/worktickers/${this.ticket_id}`,
        rowdata
      );
    }
  },
  created() {
    this.id = this.$route.params.item;
    this.fetchData();
    this.getUsers();
    this.EnclosureData();
    this.CommentData();
  }
};
</script>

<style lang="scss" scoped>
/deep/ input[type="file"] {
  display: none;
}

.clearfix {
  &:after {
    content: "";
    display: table;
    clear: both;
  }
}

.shu {
  margin: 0 5px;
  height: 100px;
  width: 1px;
  border-left: 1px rgba(52, 52, 52, 0.38) solid;
}

.editticket {
  margin: 50px;
  width: 80%;
}
.title {
  font-size: 28px;
  font-weight: 700;
  padding-left: 10px;
}
.appendInfo {
  padding: 5px;
  margin: 5px;
}
.action {
  display: inline;
  margin-left: 20px;
}
.han {
  margin-left: 5px;
}
.content {
  margin: 20px 5px;
}
.ticketcomment {
  margin-top: 20px;
  background-color: rgba(48, 250, 81, 0.17);
  .dialog-box {
    position: relative;
    left: 100px;
    margin-left: -30px;
    span {
      width: 0;
      height: 0;
      font-size: 0;
      overflow: hidden;
      position: absolute;
      &.bot {
        border-width: 16px;
        border-style: solid dashed dashed;
        border-color: transparent rgba(48, 250, 81, 0.38) transparent
          transparent;
        top: 10px;
        left: -30px;
      }
    }
    .comment {
      border: solid 1px blue;
      padding: 6px;
      margin-bottom: 10px;
      min-height: 50px;
      .commenttime {
        float: right;
      }
    }
  }
}
</style>
