<template>
  <div>
    <el-card>
      <div>
        <el-card>
          <div slot="header" class="clearfix">
            <a class="title">创建shadowsocks vpn</a>
          </div>
          <span style="font-size: 10px">创建数量：</span>
          <el-input style="width: 110px;" v-model="amount" autofocus></el-input>
          <span style="font-size: 10px">台</span>
          <hr>
          <el-table
          :data="tableData"
          border
          style="width: 100%"
          >
            <el-table-column prop="id" label="id" width="200"></el-table-column>
            <el-table-column prop="create_time" label="模板创建时间" >
              <template slot-scope="scope">
                <div>
                  <span>{{scope.row.create_time | parseDate}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="project" label="项目名称">
              <template slot-scope="scope">
                <div style="color: red">
                  <span>{{scope.row.project }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="version" label="版本"></el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <router-link  :to="'/create_vpn_task/' + amount + '/' + scope.row.id " @click.native="set_vpn"
                              target="_blank" v-if="btn">
                  <el-button type="success" size="mini">创建</el-button>
                </router-link>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script>
  import { mapMutations } from "vuex";
    export default {
      name: "shadowsocks_vpn",
      data() {
        return {
          tableData: [],
          amount: 1,
          btn: true
        }
      },
      methods: {
        fetchData() {
          this.$axios.get('/api/ops/create-shadowsocket').then(response => {
            this.tableData = response.data;
          })
        },
        set_vpn(){
          this.set_create_vpn('1')
        },
        ...mapMutations({
          set_create_vpn: "set_create_vpn"
        })
      },
      created() {
        this.fetchData();
      },
      watch: {
          amount(newName, oldName) {
            if(this.amount === ''){
             this.btn = false
            }else {
              this.btn = true
            }
          }
      }
    }
</script>

<style scoped>
  .title {
    font-size: 28px;
    font-weight: 700;
    padding-left: 10px;
    color: #19CAAD;
  }
</style>
