<template>
  <div>
    <section class="content-header">
      <h1>
        CM_线路切换
        <small>CM_GTM</small>
      </h1>
      <ol class="breadcrumb">
        <li>
          <a href="#">
            <i class="fa"></i>主页
          </a>
        </li>
        <li class="active">CM_GTM</li>
      </ol>
      <hr />
    </section>
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-2"></div>
          <div class="col-md-6">
            <el-form ref="form" :model="form" label-width="100px">
              <el-form-item label="线路查询">
                <textarea
                  v-model="form.desc"
                  :disabled="true"
                  style="line-height:2.0; background-color:black;min-height:50px;height:180px;width:500px;color:rgb(45,232,29)"
                ></textarea>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :disabled="button" @click="GetDomainStatus">刷新</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="col-md-4"></div>
        </div>
        <el-divider content-position="left">结果</el-divider>
        <div class="row">
          <div class="col-md-2"></div>
          <div class="col-md-6">
            <el-input class="dialog-input-text" v-model="result" :disabled="true"></el-input>
          </div>
          <div class="col-md-4"></div>
        </div>
        <el-divider content-position="left">默认线路选择</el-divider>
        <div class="row">
          <div class="col-md-2"></div>
          <div class="col-md-6">
            <el-select v-model="default_line" placeholder="请选择">
              <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item.host_name"
                :value="item.default_line"
              ></el-option>
            </el-select>
          </div>
          <div class="col-md-4"></div>
        </div>
        <el-divider content-position="left">切换</el-divider>
        <br />
        <div class="row">
          <div class="col-md-2"></div>
          <div class="col-md-6 col-md-offset-1">
            <el-button-group>
              <el-button type="primary" icon="el-icon-edit" @click="PostSwitch('gtm')">切换到GTM高防线路</el-button>
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="PostSwitch('default')"
              >切换到Default默认线路</el-button>
            </el-button-group>
          </div>
          <div class="col-md-4"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { showLoading, hideLoading } from "../../loading";

export default {
  name: "switch_gtm",
  data() {
    return {
      form: {
        desc: "查询时间：获取中\n查询结果：获取中\n"
      },
      result: "",
      intervalId: "",
      debug: 0,
      default_line: "",
      options: "",
      websock: null,
      button: false,
      notify: null
    };
  },
  mounted() {
    this.open2();
  },
  methods: {
    GetDefaultChiose() {
      this.$axios.get("/api/ops/_switch-gtm").then(response => {
        this.options = response.data;
        this.default_line = response.data[0]['default_line']
      });
    },
    PostSwitch(a) {
      this.result = "";
      showLoading();
      this.$axios
        .post("/api/ops/_switch-gtm", {
          type: a,
          default_line: this.default_line
        })
        .then(response => {
          let ResultRefreshObj = setInterval(() => {
            this.GetSwitchTaskResult();
          }, 2000);
          this.intervalId = ResultRefreshObj;
        });
    },
    GetSwitchTaskResult() {
      this.debug += 1;
      this.$axios.get("/api/ops/get-switch-status").then(response => {
        if (response.data["status"] === "pass") {
        } else {
          this.result = response.data["result"];
          if (response.data["status"] === "all") {
            clearInterval(this.intervalId);
            hideLoading();
          }
          if (this.debug === 90) {
            this.result = "阿里云接口超时";
            clearInterval(this.intervalId);
            hideLoading();
          }
        }
      });
    },
    GetDomainStatus() {
      this.form.desc = "查询时间：获取中\n查询结果：获取中\n";
      this.button = true;
      this.initWebSocket();
    },
    initWebSocket() {
      //初始化weosocket
      const wsuri = "ws://" + window.location.host + "/api/ops/get-domain-line";
      //const wsuri = "ws://cmdb.godeng.com/api/ops/get-domain-line";
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
      this.websocketsend(JSON.stringify({ run: 1 }));
    },
    websocketonerror() {
      //连接建立失败重连
      this.initWebSocket();
    },
    websocketonmessage(e) {
      //数据接收
      const redata = JSON.parse(e.data);
      let domain_line = "";
      if (redata["null"]) {
        domain_line =
          "查询时间：" +
          redata["time"] +
          "\n查询结果：\n" +
          "\t域名总数：" +
          redata["total"] +
          "\n\t默认线路域名：" +
          redata["counter"] +
          "\n\t高防线路域名：" +
          redata["other"] +
          "\n\t解析异常域名：" +
          redata["null"];
      } else {
        domain_line =
          "查询时间：" +
          redata["time"] +
          "\n查询结果：\n" +
          "\t域名总数：" +
          redata["total"] +
          "\n\t默认线路域名：" +
          redata["counter"] +
          "\n\t高防线路域名：" +
          redata["other"];
      }
      this.form.desc = domain_line;
      this.button = false;
      this.websock.close();
    },
    websocketsend(Data) {
      //数据发送
      this.websock.send(Data);
    },
    websocketclose(e) {
      //关闭
      console.log("断开连接", e);
    },
    open2() {
      this.notify = this.$notify({
        title: "重要！",
        message:
          "<pre>" +
          "## 线路说明\n" +
          "\n" +
          "- 高防线路：\n" +
          " 由多台服务器集群构成，\n" +
          " 可以实现自动屏蔽故障服务器，\n" +
          " 自动生产服务器补充到服务器池；\n" +
          " 目前成功率略微受影响，原因不明；\n" +
          "\n" +
          "- 默认线路：\n" +
          " 可以保证成功率不受影响，\n" +
          " 使用固定的服务器，\n" +
          " 无法自动切换，\n" +
          " 被攻击时需手动切换到高防线路；\n" +
          "\n" +
          "## 使用须知：\n" +
          "\n" +
          "1、切换高防线路，\n" +
          "仅针对默认线路服务器\n" +
          "被攻击宕机时有效，\n" +
          "其他小问题无需切换；\n" +
          "2、切换完成后，通常要2分钟后才生效；\n" +
          "3、如果切换到高防线路后情况有好转，\n" +
          "和运维确认后，\n" +
          "才可以切回默认线路\n" +
          "（默认线路需运维确认是否恢复）；\n" +
          "4、切换和查询涉及到100多个域名操作，\n" +
          "操作耗时需要几十秒，请耐心等待；\n" +
          "5、有紧急问题联系运维，电话：\n" +
          "+63 966 429 1124\n" +
          "+63 945 681 7015\n" +
          "+63 916 790 4723" +
          "</pre>",
        duration: 0,
        dangerouslyUseHTMLString: true
      });
    }
  },
  created() {
    this.initWebSocket();
    this.GetDefaultChiose();
  },
  destroyed() {
    this.websock.close(); //离开路由之后断开websocket连接
    this.notify.close();
  }
};
</script>

<style scoped>
.dialog-input-text >>> .el-input__inner {
  color: red;
}
</style>
