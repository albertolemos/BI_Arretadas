<template>
  <v-container>
    <Form @my-alerts="getAlerts" @my-complaints="getComplaints" @my-clean="cleanLoading"/>

    
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
      </div>

      <h1 class="mensagem" v-if="isEmpty">Me desculpe, mas não foi localizado nenhum chamado proveniente dessa delimitação de tempo :(</h1>
    </div>
  </v-container>
</template>

<script>
import BarChart from "./BarChart.vue";
import DoughnutChart from "./DoughnutChart.vue";
import Form from './Form.vue';

export default {
  name: "numberCases",
  
  components: {
    BarChart,
    DoughnutChart,
    Form
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
    };
  },

  methods: {
    async getAlerts(date) {
      this.token = localStorage.getItem('token')
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
          if(Object.values(this.alertsByDates).length == 0 || Object.values(this.alertsByDistricts).length == 0) this.isEmpty = true;
          else this.isEmpty = false;
      }).catch(() => this.logout())
    },

    async getComplaints(date, typeComplaint) {
      this.token = localStorage.getItem('token')
        const type = typeComplaint == "Todas" ? "all" : typeComplaint;
        
        this.$api.defaults.headers.common[
        "Authorization"
        ] = `Bearer ${this.token}`;
        await this.$api
        .get(`/complaint?init=${date.init}&final=${date.final}&type=${type}`)
        .then((response) => {
            this.complaintsByDates = response.data.Date;
            this.complaintsByDistricts = response.data.District;
            this.complaintsByTypes = response.data.Type;
            this.isLoadedComplaint = true;
            this.isLoadedAlert = false;
            if(Object.values(this.complaintsByDates).length == 0 || Object.values(this.complaintsByDistricts).length == 0 || Object.values(this.complaintsByTypes).length == 0) this.isEmpty = true;
            else this.isEmpty = false;
        }).catch(() => this.logout())
    },

    cleanLoading(){
      this.isLoadedAlert = false;
      this.isLoadedComplaint = false;
    },

    logout() {
      localStorage.removeItem("token");
      this.$router.replace("/");
    },
  }

};
</script>

<style scoped>

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