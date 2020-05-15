<template>
  <ve-pie :data="chartData" ></ve-pie>
</template>

<script>
    export default {
        name: "PieEcharts",
      props: ['chartData'],
      data () {
        return {
          // chartData: {
          //   columns: ['使用率', '数值'],
          //   rows: [
          //     { '使用率': '已使用', '数值': 960},
          //     { '使用率': '未使用', '数值': 260},
          //   ]
          // }
        }
      }
    }
</script>

<style scoped>

</style>
