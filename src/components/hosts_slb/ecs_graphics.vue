<template>
  <div class="panel panel-primary">
    <div class="panel-heading">
      <i class="fa fa-info-circle"></i> 阿里云监控
    </div>
    <div class="panel-body">
      <div id="cpu" style="height:300px;"></div>
    </div>
    <div class="panel-body">
      <div id="extranet" style="height:300px"></div>
    </div>
    <div class="panel-body">
      <div id="intranet" style="height:300px"></div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "ecs_graphics",
        props:['userData'],
        data() {
            return {
                websock: null,
                intervalId : ''
            }
        },
        created() {
            this.initWebSocket();
        },
        destroyed() {
            this.websock.close(); //离开路由之后断开websocket连接
            clearInterval(this.intervalId);
        },
        methods: {
            initWebSocket(){ //初始化weosocket
                const wsuri = "ws://" + window.location.host + "/api/aliecs/graphics-view";
                //const wsuri = "ws://cmdb.godeng.com/api/aliecs/graphics-view";
                this.websock = new WebSocket(wsuri);
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },
            websocketonopen(){ //连接建立之后执行send方法发送数据

                this.websocketsend(JSON.stringify({'aliuser': this.userData['user'], 'instanceid': this.userData['InstanceId']}));
                let ResultRefreshObj = setInterval(() => {
                    this.websocketsend(JSON.stringify({'aliuser': this.userData['user'], 'instanceid': this.userData['InstanceId']}));
                },60000);
                this.intervalId = ResultRefreshObj
            },
            websocketonerror(){//连接建立失败重连
                this.initWebSocket();
            },
            websocketonmessage(e){ //数据接收
                const redata = JSON.parse(e.data);
                console.log(redata)
            },
            websocketsend(Data){//数据发送
                this.websock.send(Data);
            },
            websocketclose(e){  //关闭
                console.log('断开连接',e);
            },
        },
    }
</script>

<style scoped>

</style>
