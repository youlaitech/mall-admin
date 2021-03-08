<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        if (!this.chart) {
          return
        }
        this.chart.dispose()
        this.chart = null

        this.initChart()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ xData,myCount, totalCount} = {}) {
      this.chart.setOption({
        title:{
          left:'left',
          text:'登录统计',
          textStyle: {
            fontSize: 12,
          }
        },
        xAxis: {
          data: xData,
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
        },
        yAxis: {},
        legend: {
          data: ['自己', '总数']
        },
        series: [{
          name: '自己',
          type: 'bar',
          barWidth: "10%",
          color: '#FF005A',
          data: myCount,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '总数',
          type: 'bar',
          barWidth: "10%",
          color: '#3888fa',
          data: totalCount,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    }
  }
}
</script>
