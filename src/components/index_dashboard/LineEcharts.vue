<template>
  <ve-line :data="cpuChartData" :settings="chartSettings" :colors="colors"></ve-line>
</template>

<script>
    export default {
        name: "LineEcharts",
      props: ['cpuChartData'],
      data() {
          this.chartSettings = {
            stack: { '用户': ['使用率'] },
            area: true
          };
          this.colors = ['#c23531'];
        return {
        }
      }
    }
</script>

<style scoped>

</style>
