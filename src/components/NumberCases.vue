<template>
  <div>
    <div class="container">
      <div class="period">
        <strong class="date"> Período: </strong>
        <div class="datepicker">
          <datepicker
            placeholder=" Data Inicial"
            v-model="initialDate"
            name="start-date"
          >
          </datepicker>
        </div>

        <!-- Fazer a validacao dos campos antes de enviar -->
        <!-- Mostrar mapa de calor ao inves de grafico pizza -->
        <strong> Até </strong>

        <div class="datepicker">
          <datepicker
            placeholder=" Data Final"
            v-model="finalDate"
            name="end-date"
          ></datepicker>
        </div>
      </div>
      <br />

      <div id="types">
        <div class="selectType">
          <strong>Tipo:</strong>
          <select class="typeSelect" v-model="selectedType">
            <option value="" disabled>Escolha</option>
            <option v-for="(type, key) in types" :key="type.value" :value="key">
              {{ type.text }}
            </option>
          </select>
        </div>
        <br />

        <div class="buttom">
          <v-btn @click="search()"> Pesquisar</v-btn>
        </div>
      </div>
      <div class="listaAlerts">
        <h3>Alertas:</h3>
        <ol>
          <li v-for="alert in alerts" :key="alert._id">
            Latitude: {{ alert.latitude }} - Longitude:{{ alert.longitude }}
          </li>
        </ol>
        <br />
        <h3>Denuncias:</h3>
        <ol>
          <li v-for="complaint in complaints" :key="complaint._id">
            Latitude: {{ complaint.latitude }} - Longitude:
            {{ complaint.longitude }}
          </li>
        </ol>
      </div>
      <br />
    </div>
    <br />
  </div>
</template>

<script>
import axios from "axios";
import Datepicker from "vuejs-datepicker";

export default {
  name: "numberCases",
  components: {
    Datepicker,
  },
  data() {
    return {
      initialDate: "",
      finalDate: "",
      token: "",
      selectedType: "",
      types: [
        { text: "Alerta", value: "alerta" },
        { text: "Denúncia", value: "denuncia" },
        { text: "Todos", value: "Todos" },
      ],
      alerts: [],
      complaints: [],
    };
  },

  async mounted() {
    this.token = sessionStorage.getItem("token");
    if (!this.token) {
      await axios
        .post("https://arretadas-api.herokuapp.com/user/authenticate", {
          nickname: "admin",
          password: "arretadas123",
        })
        .then((response) => (this.token = response.data.token))
        // eslint-disable-next-line no-console
        .catch((err) => console.log(err));
      sessionStorage.setItem("token", this.token);
    }
  },
  methods: {
    search: async function () {
      await axios
        .get("https://arretadas-api.herokuapp.com/alert", {
          params: {
            token: this.token,
          },
        })
        .then((response) => (this.alerts = response.data))
        // eslint-disable-next-line
        .catch((err) => console.log(err));
      await axios
        .get("https://arretadas-api.herokuapp.com/complaint", {
          params: {
            token: this.token,
          },
        })
        .then((response) => (this.complaints = response.data))
        // eslint-disable-next-line no-console
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style scoped>
.container {
  display: grid;
  justify-content: center;
}
.period {
  display: flex;
  padding-bottom: 5px;
}
.datepicker {
  margin-left: 10px;
  margin-right: 10px;
  border: solid 1px;
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
  margin-left: 20px;
}

.showMap {
  display: grid;
  justify-content: center;
  padding: inherit;
}

.showChart {
  padding-top: 3em;
}
</style>