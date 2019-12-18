<template>
  <div>
    <section class="content-header">
      <h1>
        主机列表
        <small>HostList</small>
      </h1>
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa">
        </i>主页</a></li>
        <li class="active">主机列表</li>
      </ol>
      <hr/>
      <nav class="navbar">
        <div class="container-fluid">
          <el-select v-model="user" filterable placeholder='请选择'>
            <el-option
              v-for="(item, index) in userlist"
              :key="index"
              :label="item.nickname"
              :value="item.nickname">
            </el-option>
          </el-select>
        </div>
      </nav>
    </section>
    <section class="content">
      <HostTable :table-data="table_data"></HostTable>
      <div class="container-fluid">
        <div class="row">
          <el-col :span="6" :offset="6" v-if="currentPage">
            <div class="grid-content">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[20,50,100]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
              </el-pagination>
            </div>
          </el-col>
        </div>
      </div>
      <div class="loadingDiv" hidden>
        <div></div>
      </div>
    </section>
  </div>
</template>

<script>
    import HostTable from './hosts_table'
    import * as DataStructure from './data_structure'
    import {mapMutations} from 'vuex'

    export default {
        name: "hosts",
        data() {
            return {
                userlist: [],
                user: '',
                userobj: [],
                page_size: 100,
                currentPage: 1,
                total: 0,
                table_data: ''
            }
        },
        methods: {
            get_userlist(){
                this.$axios.get('/api/aliecs/userdata-select').then((response) => {
                    this.userlist = response.data['userdata'];
                    this.user = response.data['userdata'][0]['nickname'];
                    this.set_userlist(this.userlist)
                })
            },
            ...mapMutations({
                set_userlist: "set_userlist"
            }),
            table(){
                if (this.userobj['the_other']){
                    this.$axios.get('/api/aliecs/host-table', {params: {'other_user': this.userobj['nickname'], 'page_size': this.page_size, 'page_num': this.currentPage}}).then((response) => {
                        this.total = response.data['TotalCount'];
                        let data = response.data['table'];
                        this.table_data = DataStructure.other_hosts_data(data)
                    })
                }else {
                    this.$axios.get('/api/aliecs/ecs-host-table', {params: {'user': this.userobj['nickname'], 'page_size': this.page_size, 'page_num': this.currentPage}}).then((response) => {
                        let data = response.data['index_data_']['index_data'];
                        this.table_data = data;
                        this.total = response.data['index_data_']['TotalCount']

                    })
                }
            },
            handleSizeChange(val) {
                this.page_size = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            }
        },
        components:{
            HostTable,
        },
        mounted() {
            this.get_userlist();
        },
        watch:{
            user(n,o){
                this.userlist.forEach((value) =>{
                    if (value['nickname'] === this.user){
                        this.userobj = value
                    }
                });
                this.table();
            },
            page_size(n,o){
                this.table();
            },
            currentPage(n,o){
                this.table();
            }
        }
    }
</script>

<style scoped>

</style>
