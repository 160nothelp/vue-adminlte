<template>
  <div>
    <div class="row" v-if="!table_data">
      <div class="col-md-2"></div>
      <div class="col-md-8">
        <div style="height: 200px"></div>
        <div style="margin-top: 15px;">
          <el-input placeholder="请输入内容" v-model="inputValue" class="input-with-select" @keyup.enter.native="search">
            <el-select v-model="searchOption" slot="prepend" filterable placeholder="请选择" style="width: 200px">
              <el-option label="IP(弹性,私有,公网)" value="AllIP"></el-option>
              <el-option label="实例名称(模糊)" value="AllName"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </div>
      </div>
      <div class="col-md-2"></div>
    </div>

    <section class="content-header" v-if="table_data">
      <h1>
        搜索结果
        <small>SlbList</small>
      </h1>
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa">
        </i>主页</a></li>
        <li class="active">搜索结果</li>
      </ol>
      <hr/>
      <nav class="navbar">
        <el-page-header @back="goBack" content="结果总汇">
        </el-page-header>
      </nav>
    </section>
    <section class="content" v-if="table_data">
      <HostTable :table-data="table_data"></HostTable>
    </section>
  </div>
</template>

<script>
    import HostTable from './hosts_table'
    import { showLoading, hideLoading } from '../../loading'
    import * as DataStructure from './data_structure'

    export default {
        name: "search",
        data(){
            return{
                searchOption : 'AllIP',
                table_data: '',
                inputValue : '',
                intervalId : ''
            }
        },
        components:{
            HostTable,
        },
        methods:{
            search(){
                showLoading();
                let data = '';
                if (this.searchOption === 'AllIP'){
                    data = {'category': this.searchOption, 'sdata': this.inputValue}
                }else if (this.searchOption === 'AllName'){
                    data = {'category': this.searchOption, 'allname': this.inputValue}
                }
                this.$axios.post('/api/aliecs/search', data).then((response) => {
                    if (response.data['status'] === 'pass') {
                        hideLoading();
                    }else {
                        let ResultRefreshObj = setInterval(() => {
                            this.GetSearchIpTaskResult(response.data['id']);
                            }, 2000);
                        this.intervalId = ResultRefreshObj
                    }
                }).catch(function (error) {
                    hideLoading();
                });
            },
            GetSearchIpTaskResult(task_id) {
                let n_data = [];
                this.$axios.get(`/api/aliecs/get_search/${task_id}`).then((response) => {
                    if (! response.data['wait']){
                        response.data['search_data'].forEach((value) => {
                            if (value['user_type'] === 'aliuser') {
                                if (value['slb']) {
                                    n_data = n_data.concat(DataStructure.slb_data(value['index_data']))
                                }else {
                                    n_data = n_data.concat(value['index_data'])
                                }
                            }else if (value['user_type'] === 'other_user') {
                                n_data = n_data.concat(DataStructure.other_hosts_data(value['table_data']))
                            }
                        });
                        if (response.data['status'] === 2){
                            clearInterval(this.intervalId);
                            this.table_data = n_data;
                            hideLoading();
                        }
                    }
                });
            },
            goBack(){
                this.table_data = ''
            }
        }
    }
</script>

<style scoped>
  .el-select .el-input {
    width: 200px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
