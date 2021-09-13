<template>
  <v-container>
    <div class="container">
      <div class="flex">
        <div class="flex items-center">
          <strong class="date"> Período: </strong>
          <div class="datepicker">
            <datepicker
              placeholder="Data Inicial*"
              v-model="initialDate"
              :format="customFormatterDate"
              :language="ptBR"
              min="0"
            >
            </datepicker>
          </div>
        </div>

        <div class="flex items-center">
          <strong>Até</strong>
          <div class="datepicker">
            <datepicker
              placeholder="Data Final*"
              v-model="finalDate"
              :format="customFormatterDate"
              :language="ptBR"
              min="0"
            >
            </datepicker>
          </div>
        </div>
      </div>
      <br />

      <v-combobox
        class="mb-4"
        v-model="selectedType"
        :items="types"
        label="Tipo de ocorrência*"
      ></v-combobox>

      <div v-if="errors.length">
        <p v-for="error in errors" :key="error">
          <strong>{{ error }} </strong>
        </p>
      </div>

      <div class="buttom">
        <v-btn @click="search()">Buscar</v-btn>
        <v-btn @click="cleaner()">Limpar</v-btn>
      </div>
      <br />
      <small>* Campos obrigatórios</small>
    </div>

    <div class="container-chart">
      <div class="chart-alerts" v-if="isLoadedAlert && alerts.length > 0">
        <h2>Por Data</h2>
        <div class="bar-chart">
          <bar-chart label="Alertas" :dados="chartsData" :key="alerts.length" />
        </div>
        <h2>Por Bairro</h2>
        <div class="doughnu-chart">
          <doughnut-chart
            label="Por Bairro"
            :dados="chartsData"
            :key="alerts.length"
          />
        </div>
      </div>

      <div
        class="chart-complaints"
        v-if="!isLoadedAlert && complaints.length > 0"
      >
        <h2>Por Data</h2>
        <div class="bar-chart">
          <bar-chart
            label="Denúncias"
            :dados="chartsData"
            :key="complaints.length"
          />
        </div>
        <h2>Por Bairro</h2>
        <div class="doughnu-chart">
          <doughnut-chart
            label="Por Bairro"
            :dados="chartsData"
            :key="complaints.length"
          />
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import { ptBR } from "vuejs-datepicker/dist/locale";
import moment from "moment";
import { authenticate } from "@/services/authentication";
import BarChart from "./BarChart.vue";
import DoughnutChart from "./DoughnutChart.vue";

export default {
  name: "numberCases",
  components: {
    Datepicker,
    BarChart,
    DoughnutChart,
  },
  data() {
    return {
      ptBR: ptBR,
      initialDate: "",
      finalDate: "",
      token: "",
      selectedType: "",
      types: ["Alertas", "Denúncias"],
      chartsData: {},
      alerts: [],
      complaints: [],
      errors: [],
      isLoadedAlert: false,
      isLoadedComplaint: false,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },

  async mounted() {
    this.token = sessionStorage.getItem("token");

    if (!this.token || this.token == undefined) {
      this.authenticateUser();
    }
  },

  methods: {
    customFormatterDate(date) {
      return moment(date).format("DD/MM/YYYY");
    },

    customFormatterDateDayMonth(date) {
      return moment(date).format("DD/MM");
    },

    logoutUser() {
      sessionStorage.removeItem("token");
      this.authenticateUser();
    },

    async authenticateUser() {
      await authenticate({
        nickname: "Alberto",
        password: "alberto123",
      })
        .then((response) => {
          this.token = response.data.token;
          this.$api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${this.token}`;
          sessionStorage.setItem("token", `Bearer ${this.token}`);
        })
        .catch(() =>
          this.errors.push(
            "Erro ao tentar realizar autenticação do usuário. Atualize a página."
          )
        );
    },

    async getAlerts(date) {
      this.chartsData = {};
      await this.$api
        .get(`/alert?init=${date.init}&final=${date.final}`)
        .then((response) => {
          this.alerts = response.data.map((element) => {
            return {
              date: this.customFormatterDateDayMonth(element.date),
              district: element.district,
            };
          });
          response.data.forEach((alert) => {
            if (!this.chartsData.hasOwnProperty(alert.district)) {
              this.chartsData[alert.district] = 0;
            }
            this.chartsData[alert.district] += 1;
          });
          this.isLoadedAlert = true;
        })
        .catch(() => this.logoutUser());
    },

    async getComplaints(date) {
      this.chartsData = {};
      await this.$api
        .get(`/complaint?init=${date.init}&final=${date.final}`)
        .then((response) => {
          this.complaints = response.data.map((element) => {
            return {
              date: this.customFormatterDateDayMonth(element.date),
              district: element.district,
              typeComplaint: element.type_complaint.toString(),
            };
          });
          response.data.forEach((alert) => {
            if (!this.chartsData.hasOwnProperty(alert.district)) {
              this.chartsData[alert.district] = 0;
            }
            this.chartsData[alert.district] += 1;
          });
          this.isLoadedAlert = false;
        })
        .catch(() => this.logoutUser());
    },

    search() {
      this.errors = [];

      if (this.initialDate === "") {
        this.errors.push("Favor preencher o campo data inicial!");
        return;
      }

      if (this.finalDate === "") {
        this.errors.push("Favor preencher o campo data final!");
        return;
      }

      if (this.selectedType === "") {
        this.errors.push("Favor escolher o tipo de ocorrência!");
        return;
      }

      if (this.finalDate < this.initialDate) {
        this.errors.push("Favor informar data final maior que data inicial!");
        return;
      }

      const dates = {
        init: moment(this.initialDate).format("YYYY-MM-DD"),
        final: moment(this.finalDate).format("YYYY-MM-DD"),
      };

      this.selectedType === "Alertas"
        ? this.getAlerts(dates)
        : this.getComplaints(dates);
    },

    cleaner() {
      this.initialDate = "";
      this.finalDate = "";
      this.selectedType = "";
      this.alerts = [];
      this.complaints = [];
    },
  },
};
</script>

<style scoped>
.container {
  display: grid;
  justify-content: center;
}
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.mb-4 {
  margin-top: 1em;
}

.datepicker {
  margin-left: 10px;
  margin-right: 10px;
  border-bottom: solid 1px #9e9e9e;
  padding: 5px;
}

.typeSelect {
  margin-left: 10px;
  border: solid 1px;
}

#types {
  display: flex;
  align-items: center;
}

.buttom {
  margin: 1rem;
  display: flex;
  justify-content: space-evenly;
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
</style>