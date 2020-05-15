<template>
  <div>
    <el-card>
      <div class="head-lavel">
        <div class="table-button">
          <router-link to="addworkticket">
            <el-button type="primary" icon="el-icon-plus">新建工单</el-button>
          </router-link>
          <el-button type="danger" :disabled="btnstatus" @click="show_status=true">更改状态</el-button>
          <el-button-group>
            <el-button type="danger" plain size="small" @click="showAllTicket">全部</el-button>
            <el-button type="success" plain size="small" @click="showMeCreate">我创建的工单</el-button>
            <el-button type="warning" plain size="small" @click="showMeAction">我处理的工单</el-button>
          </el-button-group>

          <el-radio-group
            v-model="listQuery.ticket_status"
            @change="changeStatus"
            style="margin-left: 20px"
          >
            <el-radio
              v-for="item in Object.keys(STATUS_TEXT)"
              :key="item"
              :label="item"
            >{{STATUS_TEXT[item]}}</el-radio>
          </el-radio-group>
        </div>
        <div class="table-search">
          <el-input
            style="width: 110px;"
            class="filter-item"
            placeholder="工单发起人"
            v-model="listQuery.create_user__username"
          ></el-input>
          <el-input
            style="width: 160px;"
            class="filter-item"
            placeholder="工单编号"
            v-model="listQuery.id"
          ></el-input>
          <el-input
            style="width: 180px;"
            class="filter-item"
            placeholder="工单标题、内容或类型"
            v-model="listQuery.search"
          ></el-input>
          <el-button class="filter-item" type="primary" icon="search" @click="searchClick">搜索</el-button>
        </div>
      </div>
      <div>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
        >
          <el-table-column type="selection"></el-table-column>

          <el-table-column prop="id" label="工单编号">
            <template slot-scope="scope">
              <router-link :to="'/viewworkticket/' + scope.row.id">
                <a style="color: #257cff">{{scope.row.id}}</a>
              </router-link>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="标题"></el-table-column>
          <el-table-column prop="type" label="工单类型"></el-table-column>
          <el-table-column prop="level" label="工单等级" sortable="custom">
            <template slot-scope="scope">
              <div
                slot="reference"
                class="name-wrapper"
                style="text-align: center; color: rgb(0,0,0)"
              >
                <el-rate
                  v-model="scope.row.level"
                  :colors="['#99A9BF', '#F7BA2A', '#ff1425']"
                  disabled
                ></el-rate>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="ticket_status" label="工单状态" sortable="custom">
            <template slot-scope="scope">
              <div
                slot="reference"
                class="name-wrapper"
                style="text-align: center; color: rgb(0,0,0)"
              >
                <el-tag
                  :type="STATUS_TYPE[scope.row.ticket_status]"
                >{{STATUS_TEXT[scope.row.ticket_status]}}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="create_user" label="工单创建人"></el-table-column>
          <el-table-column prop="create_time" label="工单创建时间" sortable="custom">
            <template slot-scope="scope">
              <div
                slot="reference"
                class="name-wrapper"
                style="text-align: center; color: rgb(0,0,0)"
              >
                <span>{{scope.row.create_time | parseDate}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="update_time" label="工单更新时间" sortable="custom">
            <template slot-scope="scope">
              <div
                slot="reference"
                class="name-wrapper"
                style="text-align: center; color: rgb(0,0,0)"
              >
                <span>{{scope.row.update_time | parseDate}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <router-link v-if="scope.row.ticket_status<1" :to="'editworkticket/' + scope.row.id">
                <el-button type="success" size="mini">修改</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-footer">
        <div class="table-pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="pagesize"
            :page-size="listQuery.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tabletotal"
          ></el-pagination>
        </div>
      </div>
    </el-card>

    <el-dialog title="更改状态" :visible.sync="show_status">
      <el-radio-group v-model="rowdata.ticket_status">
        <el-radio
          v-for="item in Object.keys(STATUS_TEXT)"
          :key="item"
          :label="item"
        >{{STATUS_TEXT[item]}}</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="show_status=false">取 消</el-button>
        <el-button type="primary" @click="changeForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "worktickets",
  data() {
    return {
      tableData: [],
      tabletotal: 0,
      currentPage: 1,
      rowdata: {
        ticket_status: "1",
        action_user: localStorage.getItem("username")
      },
      pagesize: ["20", "50", "100"],
      listQuery: {
        limit: 20,
        offset: "",
        pid: "",
        ticket_status: "",
        create_user__username: "",
        action_user__username: "",
        search: "",
        ordering: ""
      },
      STATUS_TEXT: {
        "0": "待启动",
        "1": "正在处理",
        "2": "已完成",
        "3": "搁置"
      },
      STATUS_TYPE: {
        "0": "danger",
        "1": "success",
        "2": "info",
        "3": "warning"
      },
      display: false,
      show_status: false,
      btnstatus: true
    };
  },
  methods: {
    fetchData() {
      this.$axios
        .get("/api/workticket/worktickers", { params: this.listQuery })
        .then(response => {
          this.tableData = response.data.results;
          this.tabletotal = response.data.count;
        });
    },
    handleSortChange(val) {},
    handleSelectionChange(val) {
      this.selectId = [];
      for (var i = 0, len = val.length; i < len; i++) {
        this.selectId.push(val[i].id);
      }
      if (this.selectId.length > 0) {
        this.btnstatus = false;
      } else {
        this.btnstatus = true;
      }
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.fetchData();
    },
    changeForm() {
      for (var i = 0, len = this.selectId.length; i < len; i++) {
        this.$axios
          .patch(
            `/api/workticket/worktickers/${this.selectId[i]}`,
            this.rowdata
          )
          .then(response => {
            delete this.selectId[i];
            setTimeout(this.fetchData, 1000);
          });
      }
      this.show_status = false;
    },
    handleCurrentChange(val) {
      this.listQuery.offset = (val - 1) * LIMIT;
      this.fetchData();
    },
    showAllTicket() {
      this.listQuery.create_user__username = "";
      this.listQuery.action_user__username = "";
      this.listQuery.search = "";
      this.listQuery.ticket_status = "";
      this.fetchData();
    },
    showMeCreate() {
      this.listQuery.create_user__username = localStorage.getItem("username");
      this.listQuery.action_user__username = "";
      this.fetchData();
    },
    showMeAction() {
      this.listQuery.action_user__username = localStorage.getItem("username");
      this.listQuery.create_user__username = "";
      this.fetchData();
    },
    searchClick() {
      this.fetchData();
    },
    changeStatus() {
      this.fetchData();
    }
  },
  created() {
    this.fetchData();
  }
};
</script>

<style scoped>
</style>
