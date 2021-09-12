<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,

  props: {
    dados: Object
  },

  data: () => ({
    chartdata: {
      labels: [],
      datasets: [
        {
          label: "Alertas",
          backgroundColor: [],
          data: [],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  }),
  created() {
    this.chartdata.labels = Object.keys(this.$props.dados)

    this.chartdata.labels.forEach(l => {
      let hex = ''
      let temp = ''
      for (let index = 0; index < l.length; index++) {
        temp = Number(l.charCodeAt(index).toString(16)) 
        if (!isNaN(temp) && hex.length < 6)
          hex += ''+temp
      }
      temp = ''
      if(hex.length <= 6)
        this.chartdata.datasets[0].backgroundColor.push(`#${hex}`)
      hex = ''
    })

    this.chartdata.datasets[0].data = Object.values(this.$props.dados)
  },

  mounted() {
    this.renderChart(this.chartdata, this.options);
  },
};
</script>
