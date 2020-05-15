<template>
  <aside class="main-sidebar">
    <section class="sidebar">
      <div class="user-panel">
        <div class="pull-left image">
          <img src="static/img/user2-160x160.jpg" class="img-circle" alt="User Image">
        </div>
        <div class="pull-left info">
          <p>{{userName}}</p>
          <a href="#"><i class="fa fa-circle text-success"></i> Online</a>
        </div>
      </div>

      <ul class="sidebar-menu">
        <li class="header">导航栏</li>

        <li class="treeview">
          <a href="#">
            <i class="fa fa-dashboard"></i>
            <span>Dashboard</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li><router-link to="/index"><i class="fa fa-circle-o"></i> dashboard</router-link></li>
          </ul>
        </li>


        <li class="treeview" v-show="hosts_permission">
          <a href="#">
            <i class="fa fa-laptop"></i>
            <span>资产管理</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li><router-link to="/search"><i class="fa fa-circle-o"></i> Search</router-link></li>
            <li><router-link to="/hosts"><i class="fa fa-circle-o"></i> Host</router-link></li>
            <li><router-link to="/slb"><i class="fa fa-circle-o"></i> SLB</router-link></li>
          </ul>
        </li>

        <li class="treeview" v-show="gtm_permission || cyt_iptables_permission || create_shadowsocket_permission
        || create_forward_permission">
          <a href="#">
             <i class="fa fa-files-o"></i>
            <span>OPS</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li v-show="gtm_permission"><router-link to="/get-domain" ><i class="fa fa-circle-o"></i> CM_GTM</router-link></li>
            <li v-show="cyt_iptables_permission"><router-link to="/cyt-iptables" ><i class="fa fa-circle-o"></i> CYT_商户白名单</router-link></li>
            <li v-show="create_shadowsocket_permission"><router-link to="/create_shadowsocks_vpn" ><i class="fa fa-circle-o"></i> Shadowsocks</router-link></li>
            <li v-show="create_forward_permission"><router-link to="/create_forward" ><i class="fa fa-circle-o"></i> Forward</router-link></li>
          </ul>
        </li>

         <li class="treeview" v-show="worktickets_permission || wiki_permission">
          <a href="#">
             <i class="fa fa-book"></i>
            <span>Document</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>
          <ul class="treeview-menu">
            <li v-show="worktickets_permission"><router-link to="/worktickets" ><i class="fa fa-circle-o"></i> 工单</router-link></li>
            <li v-show="wiki_permission"><a href="/wiki/" target="_blank"><i class="fa fa-circle-o"></i> WIKI</a></li>
          </ul>
        </li>


<!--        <li class="treeview" v-if="hosts_permission">-->
<!--          <router-link to="/search">-->
<!--            <i class="fa fa-search"></i> <span>Search</span>-->
<!--            <span class="pull-right-container">-->
<!--              <i class="fa fa-angle-left pull-right"></i>-->
<!--            </span>-->
<!--          </router-link>-->
<!--        </li>-->
<!--        <li class="treeview" v-if="hosts_permission">-->
<!--          <router-link to="/hosts">-->
<!--            <i class="fa fa-laptop"></i> <span>HOST</span>-->
<!--            <span class="pull-right-container">-->
<!--              <i class="fa fa-angle-left pull-right"></i>-->
<!--            </span>-->
<!--          </router-link>-->
<!--        </li>-->
<!--        <li class="treeview" ref="slb" v-if="hosts_permission">-->
<!--          <router-link to="/slb" >-->
<!--            <i class="fa fa-laptop"></i> <span>SLB</span>-->
<!--            <span class="pull-right-container">-->
<!--              <i class="fa fa-angle-left pull-right"></i>-->
<!--            </span>-->
<!--          </router-link>-->
<!--        </li>-->
<!--        <li class="treeview" ref="gtm" v-if="gtm_permission">-->
<!--          <router-link to="/get-domain" >-->
<!--            <i class="fa fa-files-o"></i> <span>CM_GTM</span>-->
<!--            <span class="pull-right-container">-->
<!--              <i class="fa fa-angle-left pull-right"></i>-->
<!--            </span>-->
<!--          </router-link>-->
<!--        </li>-->
<!--        <li class="treeview" ref="cyt_iptables" v-if="cyt_iptables_permission">-->
<!--          <router-link to="/cyt-iptables" >-->
<!--            <i class="fa fa-files-o"></i> <span>CYT_商户白名单</span>-->
<!--            <span class="pull-right-container">-->
<!--              <i class="fa fa-angle-left pull-right"></i>-->
<!--            </span>-->
<!--          </router-link>-->
<!--        </li>-->
<!--        <li class="treeview" ref="worktickets">-->
<!--          <router-link to="/worktickets" >-->
<!--            <i class="fa fa-th"></i> <span>工单</span>-->
<!--            <span class="pull-right-container">-->
<!--              <i class="fa fa-angle-left pull-right"></i>-->
<!--            </span>-->
<!--          </router-link>-->
<!--        </li>-->

      </ul>
    </section>
  </aside>
</template>

<script>

    export default {
        name: "adminlte_menu",
        props:['userName'],
        data(){
            return{
                gtm_permission: '',
                hosts_permission: '',
                cyt_iptables_permission: '',
              create_shadowsocket_permission: '',
              create_forward_permission: '',
              worktickets_permission: '',
              wiki_permission: ''
            }
        },
        methods:{
            menu_active(){
                window.$('ul.treeview-menu').find('a').each(function () {
                    if(this.href === document.location.href || document.location.href.search(this.href) >= 0){
                        //如果 这个标签的href的uri 等于 当前浏览器的 ur 或者 当前浏览器的地址去里 查询 到 这个标签的href的uri 大于0个
                        $(this).parent().addClass('active');
                        //就给这个查到的a标签 加一个 active class
                    }else {
                        $(this).parent().removeClass('active');
                    }
                })
            },
            secondary_menu(){
              window.$('li.treeview').mouseover(function () {
                $(this).addClass('active menu-open')
              });
              window.$('li.treeview').mouseout(function () {
                $(this).removeClass('active menu-open')
              })
            },
            async permission_(){
              let response = await this.$axios.get('/api/user/check');
              this.gtm_permission = response.data['gtm_permission'];
              this.hosts_permission = response.data['hosts_permission'];
              this.cyt_iptables_permission = response.data['cyt_iptables_permission'];
              this.create_shadowsocket_permission = response.data['create_shadowsocket_permission'];
              this.create_forward_permission = response.data['create_forward_permission'];
              this.worktickets_permission = response.data['worktickets_permission'];
              this.wiki_permission = response.data['wiki_permission'];
            }
        },
        watch:{
            '$route' (to, from) {
                this.menu_active();
            }
        },
        mounted() {
          this.secondary_menu();
          this.menu_active();
        },
        created() {
          this.permission_();
        }
    }
</script>

<style scoped>

</style>
