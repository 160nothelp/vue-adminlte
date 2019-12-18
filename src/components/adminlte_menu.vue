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
        <li class="treeview" v-if="hosts_permission">
          <router-link to="/search">
            <i class="fa fa-search"></i> <span>Search</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </router-link>
        </li>
        <li class="treeview" v-if="hosts_permission">
          <router-link to="/hosts">
            <i class="fa fa-laptop"></i> <span>HOST</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </router-link>
        </li>
        <li class="treeview" ref="slb" v-if="hosts_permission">
          <router-link to="/slb" >
            <i class="fa fa-laptop"></i> <span>SLB</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </router-link>
        </li>
        <li class="treeview" ref="gtm" v-if="gtm_permission">
          <router-link to="/get-domain" >
            <i class="fa fa-files-o"></i> <span>CM_GTM</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </router-link>
        </li>
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
                hosts_permission: ''
            }
        },
        methods:{
            menu_active(){
                window.$('ul.sidebar-menu').find('a').each(function () {
                    if(this.href == document.location.href || document.location.href.search(this.href) >= 0){
                        //如果 这个标签的href的uri 等于 当前浏览器的 ur 或者 当前浏览器的地址去里 查询 到 这个标签的href的uri 大于0个
                        $(this).parent().addClass('active');
                        //就给这个查到的a标签 加一个 active class
                    }else {
                        $(this).parent().removeClass('active');
                    }
                })
            },
            permission_(){
                this.$axios.get('/api/user/check').then(response => {
                    this.gtm_permission = response.data['gtm_permission'];
                    this.hosts_permission = response.data['hosts_permission'];
                })
            }
        },
        watch:{
            '$route' (to, from) {
                this.menu_active();
            }
        },
        mounted() {
            this.menu_active();
        },
        created() {
            this.permission_();
        }
    }
</script>

<style scoped>

</style>
