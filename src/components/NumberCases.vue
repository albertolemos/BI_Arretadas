<template>
  <div>
    <div class="container">
      <div class="period">
        <strong class="date"> Período*: </strong>
        <div class="datepicker">
          <datepicker
            placeholder=" Data Inicial"
            v-model="initialDate"
            :format="customFormatterDate"
            :language="ptBR"
            min="0"
          >
          </datepicker>
        </div>

        <!-- Mostrar mapa de calor e grafico pizza -->
        <strong> Até* </strong>

        <div class="datepicker">
          <datepicker
            placeholder=" Data Final"
            v-model="finalDate"
            :format="customFormatterDate"
            :language="ptBR"
            min="0"
          >
          </datepicker>
        </div>
      </div>
      <br />

      <div id="types">
        <div class="selectType">
          <strong>Tipo*:</strong>
          <select class="typeSelect" v-model="selectedType">
            <option value="" disabled>Escolha</option>
            <option v-for="type in types" :key="type.value">
              {{ type.text }}
            </option>
          </select>
        </div>
        <br />

        <div class="buttom">
          <v-btn @click="search()"> Pesquisar</v-btn>
        </div>
      </div>
      <br />
      <div v-if="errors.length">
        <p v-for="error in errors" :key="error">{{ error }}</p>
      </div>
      <br />
      <small>* Campos obrigatórios</small>
    </div>
    <br />
  </div>
</template>

<script>
import axios from "axios";
import Datepicker from "vuejs-datepicker";
import { ptBR } from "vuejs-datepicker/dist/locale";
import moment from "moment";

export default {
  name: "numberCases",
  components: {
    Datepicker,
  },
  data() {
    return {
      ptBR: ptBR,
      initialDate: "",
      finalDate: "",
      token: "",
      selectedType: "",
      types: [
        { text: "Alerta", value: "alerta" },
        { text: "Denúncia", value: "denuncia" },
      ],
      alerts: [],
      complaints: [],
      errors: [],
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
    customFormatterDate(date) {
      return moment(date).format("DD-MMM-yyyy");
    },
    search: async function () {
      this.errors = [];
      if (this.initialDate === "") {
        this.errors.push("Favor preencher o campo data inicial!");
      } else if (this.finalDate === "") {
        this.errors.push("Favor preencher o campo data final!");
      } else if (this.selectedType === "") {
        this.errors.push("Favor escolher o tipo!");
      } else {
        await axios
          .get("https://arretadas-api.herokuapp.com/alert", {
            params: {
              token: this.token,
            },
          })
          .then(
            (response) =>
              (this.alerts = response.data.map(function (el) {
                return {
                  date: moment(el.date).format("DD-MMM-YYYY"),
                  coordinates: {
                    latitude: el.latitude,
                    longitude: el.longitude,
                  },
                };
              }))
          )
          // eslint-disable-next-line
          .catch((err) => console.log(err));
        await axios
          .get("https://arretadas-api.herokuapp.com/complaint", {
            params: {
              token: this.token,
            },
          })
          .then(
            (response) =>
              (this.complaints = response.data.map(function (el) {
                return {
                  date: moment(el.date).format("DD-MMM-YYYY"),
                  coordinates: {
                    latitude: el.latitude,
                    longitude: el.longitude,
                  },
                };
              }))
          )
          // eslint-disable-next-line no-console
          .catch((err) => console.log(err));

        // Fazer o filtro de datas (data inicial e final)
      }
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