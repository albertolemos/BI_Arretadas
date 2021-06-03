<template>
  <div>
    <div class="container">
      <div class="period">
        <strong class="date"> Período: </strong>
        <div class="datepicker">
          <datepicker
            placeholder=" Data Inicial"
            v-model="periodStart"
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
            v-model="periodEnd"
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
          <v-btn @click="showMap = !showMap"> Pesquisar</v-btn>
        </div>
      </div>
      <br />
      <div class="showMap" v-if="showMap">
        <img
          src="https://i.ibb.co/w0jgPZ8/pontos.webp"
          alt="map"
          align="center"
        />
      </div>
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
      periodStart: "",
      periodEnd: "",
      token: "",
      selectedType: "",
      types: [
        { text: "Alerta", value: "getAllAlerts()" },
        { text: "Denúncia", value: "getAllComplaints()" },
      ],
      allAlerts: [],
      allComplaints: [],
      showMap: false,
    };
  },

  async mounted() {
    this.token = localStorage.getItem("token");
    if (!this.token || this.token == "null") {
      await axios
        .post("https://arretadas-api.herokuapp.com/user/authenticate", {
          nickname: "admin",
          password: "arretadas123",
        })
        .then((response) => (this.token = response.data.token))
        // eslint-disable-next-line no-console
        .catch((err) => console.log(err));
      localStorage.setItem("token", this.token);
    }
  },
  methods: {
    getAllAlerts: async function () {
      await axios
        .get("https://arretadas-api.herokuapp.com/alert", {
          params: {
            token: this.token,
          },
        })
        .then((response) => (this.allAlerts = response.data))
        // eslint-disable-next-line
        .catch((err) => console.log(err));
    },

    getAllComplaints: async function () {
      await axios
        .get("https://arretadas-api.herokuapp.com/complaint", {
          params: {
            token: this.token,
          },
        })
        .then((response) => (this.allComplaints = response.data))
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
</style>