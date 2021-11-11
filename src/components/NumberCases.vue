<template>
  <v-container>
    <div class="container">
      <div class="error-alert" v-if="errors.length">
        <v-alert
          type="error"
          elevation="8"
          outlined
          dense
          v-for="error in errors"
          :key="error"
        >
          {{ error }}
        </v-alert>
      </div>
      <div class="flex">
        <div class="flex items-center">
          <strong class="date"> Período: </strong>
          <div class="datepicker">
            <datepicker
              :calendar-button="true"
              :clear-button="true"
              :full-month-name="true"
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
              :calendar-button="true"
              :clear-button="true"
              :full-month-name="true"
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
        class="type-of-occurrence"
        v-model="selectedType"
        :items="types"
        label="Tipo de ocorrência*"
      ></v-combobox>

      <v-combobox
        multiple
        v-if="selectedType == 'Denúncias'"
        class="type-complaint"
        v-model="selectedTypeComplaint"
        :items="typesComplaints"
        label="Tipo de denúncia*"
      ></v-combobox>

      <div class="buttom">
        <v-btn @click="search()">Buscar</v-btn>
        <v-btn @click="cleaner()">Limpar</v-btn>
      </div>
      <br />
      <small>* Campos obrigatórios</small>
    </div>

    <div class="container-chart">
      <div class="chart-alerts" v-if="isLoadedAlert">
        <h2>Por Data</h2>
        <div class="bar-chart">
          <bar-chart
            label="Alertas"
            :dados="alertsByDates"
            :key="alertsByDates.__ob__.dep.id"
          />
        </div>
        <h2>Por Bairro</h2>
        <div class="doughnu-chart">
          <doughnut-chart
            label="Por Bairro"
            :dados="alertsByDistricts"
            :key="alertsByDistricts.__ob__.dep.id"
          />
        </div>
      </div>

      <div class="chart-complaints" v-if="isLoadedComplaint">
        <h2>Por Data</h2>
        <div class="bar-chart">
          <bar-chart
            label="Denúncias"
            :dados="complaintsByDates"
            :key="complaintsByDates.__ob__.dep.id"
          />
        </div>
        <h2>Por Bairro</h2>
        <div class="doughnu-chart">
          <doughnut-chart
            label="Por Bairro"
            :dados="complaintsByDistricts"
            :key="complaintsByDistricts.__ob__.dep.id"
          />
        </div>
        <h2>Por Tipo</h2>
        <div class="doughnu-chart">
          <doughnut-chart
            label="Por Tipo"
            :dados="complaintsByTypes"
            :key="complaintsByDistricts.__ob__.dep.id"
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
      userToken: "",
      selectedType: "",
      types: ["Alertas", "Denúncias"],
      selectedTypeComplaint: [],
      typesComplaints: [
        "Todas",
        "Física",
        "Moral",
        "Sexual",
        "Patrimonial",
        "Psicológica",
        "Verbal",
      ],
      chartsData: {},
      alertsByDates: {},
      alertsByDistricts: {},
      complaintsByDates: {},
      complaintsByDistricts: {},
      complaintsByTypes: {},
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
    this.userToken = sessionStorage.getItem("userToken");

    if (!this.userToken || this.token == undefined)
      this.$router.replace("/login");

    this.token = sessionStorage.getItem("token");

    if (!this.token || this.token == undefined) this.authenticateUser();
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
      await this.$api
        .get(`/alert?init=${date.init}&final=${date.final}`)
        .then((response) => {
          this.alertsByDates = response.data.Date;
          this.alertsByDistricts = response.data.District;
          this.isLoadedAlert = true;
          this.isLoadedComplaint = false;
        })
        .catch(() => this.logoutUser());
    },

    async getComplaints(date) {
      const type =
        this.selectedTypeComplaint == "Todas"
          ? "all"
          : this.selectedTypeComplaint;
      await this.$api
        .get(`/complaint?init=${date.init}&final=${date.final}&type=${type}`)
        .then((response) => {
          this.complaintsByDates = response.data.Date;
          this.complaintsByDistricts = response.data.District;
          this.complaintsByTypes = response.data.Type;
          this.isLoadedComplaint = true;
          this.isLoadedAlert = false;
        })
        .catch(() => this.logoutUser());
    },

    search() {
      this.errors = [];

      if (!this.initialDate) {
        this.errors.push("Favor preencher o campo Data Inicial!");
        return;
      }

      if (!this.finalDate) {
        this.errors.push("Favor preencher o campo Data Final!");
        return;
      }

      if (!this.selectedType) {
        this.errors.push("Favor escolher o Tipo de ocorrência!");
        return;
      }

      if (
        this.selectedType == "Denúncias" &&
        this.selectedTypeComplaint.length == 0
      ) {
        this.errors.push("Favor escolher o Tipo de denúncia!");
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
      this.errors = [];
      this.initialDate = "";
      this.finalDate = "";
      this.selectedType = "";
      this.isLoadedAlert = false;
      this.isLoadedComplaint = false;
    },
  },
};
</script>

<style scoped>
.error-alert {
  display: flex;
  justify-content: space-evenly;
}
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

@media only screen and (max-width: 765px) {
  .items-center {
    padding: 1rem 0 1rem 0;
  }

  .items-center strong {
    display: none;
  }

  .datepicker {
    font-size: 15px;
    width: 75vw;
  }

  .type-of-occurrence {
    margin: -1rem 0 0 0.75rem;
    align-content: center;
    width: 75vw;
  }

  .type-complaint {
    margin: 0 0 0 0.75rem;
    align-content: center;
    width: 75vw;
  }

  .flex {
    display: grid;
  }

  strong {
    font-size: 15px;
  }
}
</style>