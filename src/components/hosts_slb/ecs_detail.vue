<template>
  <div>
    <section class="content-header">
    <h1>
      主机详情
      <small>EcsDetails</small>
    </h1>
    <ol class="breadcrumb">
      <li><a href="/"><i class="fa"></i>主页</a></li>
      <li class="active">主机列表</li>
    </ol>
    <hr/>
  </section>
    <section class="content" >
    <div class="row">
      <div class="col-md-6">
        <ul class="nav nav-tabs">
          <li class="active"><a data-toggle="tab"><b>基本信息</b></a></li>
        </ul>
        <table class="table" style="background-color: white">
          <tbody>
          <tr>
            <td width="40%">所属账号：</td>
            <td><b id="aliuser">{{ecsDetailData.aliuser}}</b></td>
          </tr>
          <tr>
            <td>ID：</td>
            <td><b id="Instanceid">{{ecsDetailData.InstanceId}}</b></td>
          </tr>
          <tr>
            <td>所在可用区域：</td>
            <td><b id="ZoneId">{{ecsDetailData.ZoneId}}</b></td>
          </tr>
          <tr>
            <td>名称：</td>
            <td><b id="InstanceName">{{ecsDetailData.InstanceName}}</b></td>
          </tr>
          <tr>
            <td>描述：</td>
            <td><b id="Description">{{ecsDetailData.Description}}</b></td>
          </tr>
          <tr>
            <td>实例规格：</td>
            <td><b id="InstanceType">{{ecsDetailData.InstanceType}}</b></td>
          </tr>
          <tr>
            <td>实例规格族：</td>
            <td><b id="InstanceTypeFamily">{{ecsDetailData.InstanceTypeFamily}}</b></td>
          </tr>
          <tr>
            <td>镜像ID：</td>
            <td><b id="ImageId">{{ecsDetailData.ImageId}}</b></td>
          </tr>
          <tr>
            <td>密钥对名称：</td>
            <td><b id="KeyPairName">{{ecsDetailData.KeyPairName}}</b></td>
          </tr>
          <tr>
            <td>RAM角色：</td>
            <td><b></b></td>
          </tr>
          <tr>
            <td>集群ID：</td>
            <td><b id="ClusterId">{{ecsDetailData.ClusterId}}</b></td>
          </tr>
          <tr>
            <td>标签：</td>
            <td><b id="TagKey">{{ecsDetailData.TagKey}}</b></td>
          </tr>
          </tbody>
        </table>
        <ul class="nav nav-tabs">
          <li class="active"><a data-toggle="tab"><b>配置信息</b></a></li>
        </ul>
        <table class="table" style="background-color: white">
          <tbody>
          <tr>
            <td width="40%">CPU：</td>
            <td><b id="Cpu">{{ecsDetailData.Cpu}} 核</b></td>
          </tr>
          <tr>
            <td>内存：</td>
            <td><b id="Memory">{{ecsDetailData.Memory}} GiB</b></td>
          </tr>
          <tr>
            <td>实例类型：</td>
            <td><b>I/O优化</b></td>
          </tr>
          <tr>
            <td>操作系统：</td>
            <td><b id="OSNameEn">{{ecsDetailData.OSNameEn}}</b></td>
          </tr>
          <tr>
            <td>弹性网卡：</td>
            <td><b id="NetworkInterfaceId">{{ecsDetailData.NetworkInterfaceId}}</b></td>
          </tr>
          <tr>
            <td>公网IP：</td>
            <td><b id="PublicIpAddress">{{ecsDetailData.PublicIpAddress}}</b></td>
          </tr>
          <tr>
            <td>弹性公网IP：</td>
            <td><b id="EipAddress">{{ecsDetailData.EipAddress}}</b></td>
          </tr>
          <tr>
            <td>私有IP：</td>
            <td><b id="PrivateIpAddress">{{ecsDetailData.PrivateIpAddress}}</b></td>
          </tr>
          <tr>
            <td>带宽计费方式：</td>
            <td><b v-if="ecsDetailData.InternetChargeType === 'PayByTraffic'">按流量计费</b>
            <b v-else>按带宽计费</b></td>
          </tr>
          <tr>
            <td>当前使用带宽：</td>
            <td><b v-if="ecsDetailData.EipAddress">{{ecsDetailData.Bandwidth}}</b>
            <b v-else>{{ecsDetailData.InternetMaxBandwidthOut}}</b></td>
          </tr>
          <tr>
            <td>专有网络：</td>
            <td><b id="VpcId">{{ecsDetailData.VpcId}}</b></td>
          </tr>
          <tr>
            <td>虚拟交换机：</td>
            <td><b id="VSwitchId">{{ecsDetailData.VSwitchId}}</b></td>
          </tr>
          </tbody>
        </table>
        <ul class="nav nav-tabs">
          <li class="active"><a data-toggle="tab"><b>付费信息</b></a></li>
        </ul>
        <table class="table" style="background-color: white">
          <tbody>
          <tr class="no-borders-tr">
            <td width="40%">付费方式：</td>
            <td><b id="InstanceChargeType"></b></td>
          </tr>
          <tr>
            <td>停止模式：</td>
            <td><b></b></td>
          </tr>
          <tr v-if="ecsDetailData.InstanceChargeType === 'PrePaid'">
            <td>到期时间：</td>
            <td><b>{{ecsDetailData.ExpiredTime}}</b></td>
          </tr>
          <tr v-else>
            <td>创建时间：</td>
            <td><b>{{ecsDetailData.CreationTime}}</b></td>
          </tr>
          <tr>
            <td>自动释放时间：</td>
            <td><b></b></td>
          </tr>
          <tr>
            <td>是否开启释放保护：</td>
            <td><b></b></td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="col-md-6">
        <div class="panel panel-primary"><div class="panel-heading">
          <i class="fa fa-info-circle"></i> 快速修改
        </div>
          <table class="table">
            <tbody>
            <tr class="no-borders-tr">
              <td>运行中:</td>
              <td>
                <span class="pull-right">
                  <div class="switch">
                    <div class="onoffswitch">
                      <input type="checkbox" checked="" class="onoffswitch-checkbox" id="is_active">
                      <label class="onoffswitch-label" for="is_active">
                        <span class="onoffswitch-inner"></span>
                        <span class="onoffswitch-switch"></span>
                      </label>
                    </div>
                  </div>
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <button type="button" class="btn btn-primary btn-xs"  style="width: 100px">暂</button>
                <!--<button type="button" class="btn btn-primary btn-xs" id="" style="width: 100px">本地实例快照</button>-->
              </td></tr>
            <tr>
              <td>
                <button type="button" class="btn btn-primary btn-xs"  style="width: 100px">不</button>
              </td>
            </tr>
            <tr>
              <td>
                <button type="button" class="btn btn-primary btn-xs"  style="width: 100px">支</button>
              </td>
            </tr>
            <tr>
              <td>
                <button type="button" class="btn btn-primary btn-xs" id="" style="width: 100px">持</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <ecs_graphics :user-data="userdata"></ecs_graphics>
<!--        <div class="panel panel-primary">-->
<!--          <div class="panel-heading">-->
<!--            <i class="fa fa-info-circle"></i> 阿里云监控-->
<!--          </div>-->
<!--          <div class="panel-body">-->
<!--            <div id="cpu" style="height:300px;"></div>-->
<!--          </div>-->
<!--          <div class="panel-body">-->
<!--            <div id="extranet" style="height:300px"></div>-->
<!--          </div>-->
<!--          <div class="panel-body">-->
<!--            <div id="intranet" style="height:300px"></div>-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </div>
  </section>
  </div>
</template>

<script>
    import ecs_graphics from "./ecs_graphics";

    export default {
        name: "ecs_detail",
        data(){
            return{
                userdata: '',
                ecsDetailData: ''
            }
        },
        methods:{
            EcsDeatailData(){
                this.$axios.get('/api/aliecs/details', {params:{'user': this.userdata['user'], 'instanceid': this.userdata['InstanceId']}}).then((response) => {
                    this.ecsDetailData = response.data['ecsdetails'];
                })
            }
        },
        mounted() {
            this.userdata = JSON.parse(this.$route.params.item);
            this.EcsDeatailData();
        },
        components:{
            ecs_graphics
        }
    }
</script>

<style scoped>

</style>
