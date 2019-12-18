<template>
  <div>
    <section class="content-header">
      <h1>
        主机列表
        <small>SlbList</small>
      </h1>
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa">
        </i>主页</a></li>
        <li class="active">SLB列表</li>
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
    import {mapGetters}  from 'vuex'
    import * as DataStructure from './data_structure'
    import HostTable from './hosts_table'

    export default {
        name: "slb_page",
        data(){
            return{
                userlist: [],
                user: '',
                userobj: [],
                page_size: 100,
                currentPage: 1,
                total: 0,
                table_data: ''
            }
        },
        methods:{
            table(){
                this.$axios.get('/api/aliecs/slb-table',{params:{'user': this.userobj['nickname'], 'page_size': this.page_size, 'page_num': this.currentPage}}).then((response) => {
                    this.total = response.data['slb']['TotalCount'];
                    this.table_data = DataStructure.slb_data(response.data['slb']['index_data'])
                })
            },
            handleSizeChange(val) {
                this.page_size = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            }
        },
        computed: {
            ...mapGetters([
                'get_userlist'
            ])
        },
        components:{
            HostTable,
        },
        created() {
            let n_userlist = [];
            this.get_userlist.forEach((value) => {
                if (value['the_other']){
                }else {
                    n_userlist.push(value)
                }
            });
            this.userlist = n_userlist;
            this.user = n_userlist[0]['nickname']
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
        }
    }
</script>

<style scoped>

</style>
