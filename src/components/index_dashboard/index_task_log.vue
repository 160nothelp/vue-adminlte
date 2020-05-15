<template>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column label="用户" prop='user'></el-table-column>
      <el-table-column label="任务" prop='task'></el-table-column>
      <el-table-column label="时间" prop='create_time'>
        <template slot-scope="scope">
          <span>{{scope.row.create_time | parseDate}}</span>
        </template>
      </el-table-column>
    </el-table>
</template>

<script>
    export default {
        name: "index_task_log",
      props:['tableData']
    }
</script>

<style scoped>

</style>
