<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,

  data: () => ({
    chartdata: {
      labels: [
        "01/08",
        "02/08",
        "03/08",
        "04/08",
        "05/08",
        "06/08",
        "07/08",
        "08/08",
      ],
      datasets: [
        {
          label: "Dia",
          backgroundColor: "#689689",
          data: [1, 4, 5, 4, 5, 3, 3, 4],
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
