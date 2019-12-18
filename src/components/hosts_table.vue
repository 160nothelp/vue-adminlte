<template>
  <div class="table-responsive">
    <table id="host_table" class="table table-hover table-bordered table-striped">
      <thead>
      <tr>
        <th>实例id</th>
        <th>名称</th>
        <th>OS</th>
        <th>区域</th>
        <th>IP地址</th>
        <th>状态</th>
        <th>网络类型</th>
        <th>配置</th>
        <th>付费方式</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in tableData">
        <td>{{item.InstanceId}}</td>
        <td hidden>{{item.nickname}}</td>
        <td hidden>{{item.user_type}}</td>
        <td>{{item.InstanceName}}</td>
        <td>{{item.OSType}}</td>
        <td>{{item.ZoneId}}</td>
        <template v-if="item.InstanceNetworkType === 'vpc'">
          <template v-if="item.EipAddress">
            <td>{{item.EipAddress}}(弹)<br>{{item.PrivateIpAddress}}(私有)</td>
          </template>
          <template v-else>
            <template v-if="item.PublicIpAddress">
              <td>{{item.PublicIpAddress}}(公)<br>{{item.PrivateIpAddress}}(私有)</td>
            </template>
            <template v-else-if="item.Address">
              <td>{{item.Address}}</td>
            </template>
            <template v-else>
              <td>{{item.PublicIpAddress}}<br>{{item.PrivateIpAddress}}(私有)</td>
            </template>
          </template>
        </template>
        <template v-else-if="item.InstanceNetworkType === 'classic'">
          <template v-if="item.EipAddress">
            <td>{{item.EipAddress}}(弹)<br>{{item.PrivateIpAddress}}(私有)</td>
          </template>
          <template v-else>
            <template v-if="item.PublicIpAddress">
              <td>{{item.PublicIpAddress}}(公)<br>{{item.PrivateIpAddress}}(私有)</td>
            </template>
            <template v-else-if="item.Address">
              <td>{{item.Address}}</td>
            </template>
            <template v-else>
              <td>{{item.PublicIpAddress}}<br>{{item.PrivateIpAddress}}(私有)</td>
            </template>
          </template>
        </template>
        <template v-else>
          <template v-if="item.PublicIpAddress">
            <td>{{item.PublicIpAddress}}(公)<br>{{item.PrivateIpAddress}}(私有)</td>
          </template>
          <template v-else>
            <td>{{item.PublicIpAddress_}}<br>{{item.PrivateIpAddress}}(私有)</td>
          </template>
        </template>

        <td>{{item.Status}}</td>
        <td>{{item.InstanceNetworkType}}</td>
        <template v-if="item.EipAddress">
          <td>{{item.Cpu}} vCPU {{item.Memory}} GiB (I/O优化)<br> {{item.InstanceType}} {{item.Bandwidth}}Mbps (峰值)</td>
        </template>
        <template v-else-if="item.PublicIpAddress">
          <td>{{item.Cpu}} vCPU {{item.Memory}} GiB (I/O优化)<br> {{item.InstanceType}} {{item.InternetMaxBandwidthOut}}Mbps (峰值)</td>
        </template>
        <template v-else-if="item.OSType === 'SLB'">
          <td></td>
        </template>
        <template v-else>
          <td>{{item.Cpu}} vCPU {{item.Memory}} GiB <br> {{item.InstanceType}} {{item.InternetMaxBandwidthOut}}Mbps </td>
        </template>
        <template v-if="item.InstanceChargeType === 'PrePaid'">
          <td>包年包月<br>{{item.ExpiredTime}} 到期</td>
        </template>
        <template v-else-if="item.InstanceChargeType === 'PostPaid'">
          <td>按量计费<br>{{item.CreationTime}} 创建</td>
        </template>
        <template v-else>
          <td>{{item.InstanceChargeType}}</td>
        </template>
        <td><button type="button" class="btn btn-primary" @click="details(item)">详情</button></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
    export default {
        name: "hosts_table",
        props:['tableData'],
        data(){
            return{
                nickname: '',

            }
        },
        methods:{
            details(item){
                if (item['user_type'] === 'aliuser'){
                    let userdata = {'user': item['nickname'], 'InstanceId': item['InstanceId']};
                    let routeUrl = this.$router.resolve({
                        'name': 'Details',
                        'params': {item: JSON.stringify(userdata)}
                    });
                    window.open(routeUrl .href, '_blank');
                }else if (item['user_type'] === 'alislb'){
                    alert('slb')
                }else {
                    alert('自定义机器')
                }
            }
        }
    }
</script>

<style scoped>

</style>
