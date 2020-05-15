<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <a class="title">Dashboard</a>
      </div>
      <span>当前状态：</span>
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="8">
          <el-card>
            <span>CPU使用率：</span>
            <LineEcharts :cpu-chart-data="CpuChartData"></LineEcharts>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <span>Memory使用率：</span>
            <PieEcharts :chart-data="MemChartData"></PieEcharts>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <span>Disk使用率：</span>
            <PieEcharts :chart-data="DiskChartData"></PieEcharts>
          </el-card>
        </el-col>
      </el-row>
      <hr>
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="12">
          <span>队列任务记录：</span>
          <el-card style="margin-top: 20px">
            <index_task_log :table-data="tabkeData"></index_task_log>
          </el-card>
        </el-col>
        <el-col :span="12">
          <span>敬请期待！</span>
          <el-card style="margin-top: 20px"></el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import LineEcharts from "./LineEcharts";
  import PieEcharts from "./PieEcharts";
  import index_task_log from "./index_task_log";
  import { formatDate } from '../../filters/index'
    export default {
        name: "dashboard",
      data() {
          return {
            intervalId : '',
            websock: null,
            CpuChartData: {
              columns: ['时间', '使用率'],
              rows: []
            },
            MemChartData: {
              columns: ['使用率', '数值'],
              rows: []
            },
            DiskChartData: {
              columns: ['使用率', '数值'],
              rows: []
            },
            tabkeData: '',
          }
      },
      components: {
        PieEcharts,
        LineEcharts,
        index_task_log
      },
      methods: {
        initWebSocket() {
          const wsuri = "ws://cmdb.godeng.com/api/monitor/monitor-socket";
          this.websock = new WebSocket(wsuri);
          this.websock.onmessage = this.websocketonmessage;
          this.websock.onopen = this.websocketonopen;
          this.websock.onerror = this.websocketonerror;
          this.websock.onclose = this.websocketclose;
        },
        websocketonopen(){ //连接建立之后执行send方法发送数据
          let actions = {"status":"call"};
          this.websocketsend(JSON.stringify(actions));
          let ResultRefreshObj = setInterval(() => {
            this.websocketsend(JSON.stringify(actions));
          },10000);
          this.intervalId = ResultRefreshObj
        },
        websocketonerror(){//连接建立失败重连
          this.initWebSocket();
        },
        websocketonmessage(e){ //数据接收
          const redata = JSON.parse(e.data);
          this.CpuChartData.rows = [];
          eval(redata['cpu_monitor_data']).forEach(value => {
            this.CpuChartData.rows.unshift( {'时间': formatDate(value['fields']['time'], 'hh:mm'),
              '使用率': value['fields']['usage_rate']})
          });
          this.MemChartData.rows = [];
          eval(redata['memory_monitor_data']).forEach(value => {
            this.MemChartData.rows.push({ '使用率': '已使用', '数值': value['fields']['usage']},
              { '使用率': '未使用', '数值': value['fields']['free']})
          });
          this.DiskChartData.rows = [];
          eval(redata['disk_monitor_data']).forEach(value => {
            this.DiskChartData.rows.push({ '使用率': '已使用', '数值': value['fields']['usage']},
              { '使用率': '未使用', '数值': value['fields']['free']})
          })
        },
        websocketsend(Data){//数据发送
          this.websock.send(Data);
        },
        websocketclose(e){  //关闭
          console.log('断开连接',e);
        },
        fetchData(){
          this.$axios.get('/api/audit/celery-task-log').then(response => {
            this.tabkeData = response.data
          })
        },
      },
      created() {
          this.fetchData();
        this.initWebSocket();
      },
      destroyed() {
          this.websock.close();
        clearInterval(this.intervalId);
      },
    }
</script>

<style scoped>
  .title {
    font-size: 20px;
    font-weight: 700;
    padding-left: 10px;
    color: black;
  }
  .el-row {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
  }
  .el-col {
    border-radius: 4px;
  }
  .line-echarts .line-echarts-ii {
    width: 100%;
    height: 420px;
  }
</style>
