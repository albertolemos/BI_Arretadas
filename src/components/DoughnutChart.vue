<script>
import { Doughnut } from "vue-chartjs";

export default {
  extends: Doughnut,

  data: () => ({
    chartdata: {
      labels: ["Heliópolis", "São José", "Boa Vista"],
      datasets: [
        {
          label: "Alertas",
          backgroundColor: ["#94D1BE", "#DAFFEF", "#689689"],
          data: [15, 5, 9],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  }),

  mounted() {
    this.renderChart(this.chartdata, this.options);
  },
};
</script>
