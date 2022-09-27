<template>
  <v-container>
    <Form
      @my-alerts="getAlerts"
      @my-complaints="getComplaints"
      @my-clean="cleanLoading"
    />

    <div class="container-chart">
      <div class="chart-alerts" v-if="isLoadedAlert && !isEmpty">
        <h2>Por Data (dados em %)</h2>
        <div class="bar-chart">
          <bar-chart
            label="Alertas"
            :dados="alertsByDates"
            :key="alertsByDates.__ob__.dep.id"
          />
        </div>
        <h2>Por Bairro (dados em %)</h2>
        <div class="doughnu-chart">
          <doughnut-chart
            label="Por Bairro"
            :dados="alertsByDistricts"
            :key="alertsByDistricts.__ob__.dep.id"
          />
        </div>
      </div>

      <div class="chart-complaints" v-if="isLoadedComplaint && !isEmpty">
        <h2>Por Data (dados em %)</h2>
        <div class="bar-chart">
          <bar-chart
            label="Denúncias"
            :dados="complaintsByDates"
            :key="complaintsByDates.__ob__.dep.id"
          />
        </div>
        <h2>Por Bairro (dados em %)</h2>
        <div class="doughnu-chart">
          <doughnut-chart
            label="Por Bairro"
            :dados="complaintsByDistricts"
            :key="complaintsByDistricts.__ob__.dep.id"
          />
        </div>
        <h2>Por Tipo (dados em %)</h2>
        <div class="doughnu-chart">
          <doughnut-chart
            label="Por Tipo"
            :dados="complaintsByTypes"
            :key="complaintsByDistricts.__ob__.dep.id"
          />
        </div>
        <!-- <div id="map"></div> -->
      </div>

      <h1 class="mensagem" v-if="isEmpty">
        Me desculpe, mas não foi localizado nenhum chamado proveniente dessa
        delimitação de tempo :(
      </h1>
    </div>
    <div>
      <vue-google-heatmap
        :points="points"
        :width="640"
        :height="420"
        :initial-zoom="initialZoom"
        :lat="lat"
        :lng="lng"
      />
    </div>
  </v-container>
</template>

<script>
import BarChart from "./BarChart.vue";
import DoughnutChart from "./DoughnutChart.vue";
import Form from "./Form.vue";
import callHeatMap from "../services/heatMap";

export default {
  name: "numberCases",

  components: {
    BarChart,
    DoughnutChart,
    Form,
  },

  data() {
    return {
      token: "",
      isLoadedAlert: false,
      isLoadedComplaint: false,
      isEmpty: false,
      alertsByDates: {},
      alertsByDistricts: {},
      complaintsByDates: {},
      complaintsByDistricts: {},
      complaintsByTypes: {},
      initialZoom: 13,
      // lat: -7.891580368210672,
      // lng: -37.12604518424489,
      lat: -8.892911,
      lng: -36.49101,
      points: [
        { lat: -8.892911, lng: -36.49101 },
        { lat: -8.892922, lng: -36.49102 },
        { lat: -8.892933, lng: -36.49103 },
        { lat: -8.892944, lng: -36.49104 },
        { lat: -8.892955, lng: -36.49105 },
        { lat: -8.892966, lng: -36.49106 },
        { lat: -8.892977, lng: -36.49107 },
        { lat: -8.892985, lng: -36.49108 },
        { lat: -8.892995, lng: -36.49109 },
        // { lat: 37.771, lng: -122.434 },
        // { lat: 37.772, lng: -122.434 },
        // { lat: 37.773, lng: -122.434 },
        // { lat: 37.774, lng: -122.434 },
        // { lat: 37.77, lng: -122.434 },
        // { lat: 37.774, lng: -122.434 },
        // { lat: 37.777, lng: -122.434 },
        // { lat: 37.779, lng: -122.434 },
        // { lat: 37.779, lng: -122.434 },
        // { lat: 37.779, lng: -122.434 },
        // { lat: 37.779, lng: -122.434 },
        // { lat: 37.779, lng: -122.434 },
        // { lat: 37.779, lng: -122.434 },
        // { lat: 37.779, lng: -122.434 },
        // { lat: 37.779, lng: -122.434 },
        // { lat: 37.779, lng: -122.434 },
        // { lat: 37.779, lng: -122.434 },
        // { lat: 37.779, lng: -122.434 },
      ],
    };
  },

  methods: {
    async getAlerts(date) {
      this.token = localStorage.getItem("token");
      this.$api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${this.token}`;
      await this.$api
        .get(`/alert?init=${date.init}&final=${date.final}`)
        .then((response) => {
          this.alertsByDates = response.data.Date;
          this.alertsByDistricts = response.data.District;
          this.isLoadedAlert = true;
          this.isLoadedComplaint = false;
          if (
            Object.values(this.alertsByDates).length == 0 ||
            Object.values(this.alertsByDistricts).length == 0
          )
            this.isEmpty = true;
          else this.isEmpty = false;
        })
        .catch(() => this.logout());
    },

    async getComplaints(date, typeComplaint) {
      this.token = localStorage.getItem("token");
      const type = typeComplaint == "Todas" ? "all" : typeComplaint;

      this.$api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${this.token}`;
      await this.$api
        .get(`/complaint/?init=${date.init}&final=${date.final}&type=${type}`)
        .then((response) => {
          this.complaintsByDates = response.data.Date;
          this.complaintsByDistricts = response.data.District;
          this.complaintsByTypes = response.data.Type;
          this.isLoadedComplaint = true;
          this.isLoadedAlert = false;
          if (
            Object.values(this.complaintsByDates).length == 0 ||
            Object.values(this.complaintsByDistricts).length == 0 ||
            Object.values(this.complaintsByTypes).length == 0
          )
            this.isEmpty = true;
          else this.isEmpty = false;
          callHeatMap();
        })
        .catch(() => this.logout());
    },

    cleanLoading() {
      this.isLoadedAlert = false;
      this.isLoadedComplaint = false;
    },

    logout() {
      localStorage.removeItem("token");
      this.$router.replace("/");
    },
  },
};
</script>

<style scoped>
#map {
  width: 500px;
  height: 400px;
  border: solid 1px black;
}

.showMap {
  display: grid;
  justify-content: center;
  padding: inherit;
}

.showChart {
  padding-top: 3em;
}

.chart-alerts {
  margin: 3em auto 3em auto;
}

.chart-complaints {
  margin: 2em auto 3em auto;
}

.bar-chart {
  margin: 2em auto 3em auto;
  border: solid 1px #555;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
}

.doughnu-chart {
  margin: 2em auto 3em auto;
  border: solid 1px #555;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
  -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
}

.mensagem {
  font-size: 1.5rem;
  text-align: center;
}
</style>