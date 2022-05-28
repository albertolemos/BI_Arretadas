<script>
import { Doughnut } from "vue-chartjs";

export default {
  extends: Doughnut,
  props: {
    dados: Object,
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
    this.chartdata.labels = Object.keys(this.$props.dados);

    function cor() {
      return "#E" + parseInt(Math.random() * 0xfffff).toString(16).padStart(5, "0") 
    }
    this.chartdata.labels.forEach(() => {
      this.chartdata.datasets[0].backgroundColor.push(cor());
    })

    this.chartdata.datasets[0].data = Object.values(this.$props.dados);
  },

  mounted() {
    this.renderChart(this.chartdata, this.options);
  },
};
</script>
