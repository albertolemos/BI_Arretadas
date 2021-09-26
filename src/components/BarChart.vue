<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,

  props: {
    dados: Object,
  },

  data: () => ({
    chartdata: {
      labels: [],
      datasets: [
        {
          label: "",
          backgroundColor: [],
          borderColor: "rgba(0, 0, 0, 0.5)",
          borderWidth: 1,
          data: [],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  }),

  created() {
    this.chartdata.labels = Object.keys(this.$props.dados);

    const cor = () => {
      let r = parseInt(Math.random() * 255);
      let g = parseInt(Math.random() * 255);
      let b = parseInt(Math.random() * 255);

      return `rgba(${r}, ${g}, ${b}, 0.5)`;
    };

    this.chartdata.labels.forEach(() => {
      this.chartdata.datasets[0].backgroundColor.push(cor());
    });

    this.chartdata.datasets[0].data = Object.values(this.$props.dados);
  },

  mounted() {
    this.renderChart(this.chartdata, this.options);
  },
};
</script>
