<template>
  <div>
    <div class="container">
      <div class="period">
        <strong class="date"> Período*: </strong>
        <div class="datepicker">
          <datepicker
            placeholder=" Data Inicial"
            v-model="initialDate"
            :format="customFormatter"
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
            :format="customFormatter"
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
import Datepicker from "vuejs-datepicker";
import { ptBR } from "vuejs-datepicker/dist/locale";
import moment from "moment";
import { authenticate } from '@/services/authentication'

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
      this.authenticateUser()
    }
  },
  methods: {
    customFormatter(date) {
      return moment(date).format("YYYY-MM-DD");
    },
    logoutUser() {
      sessionStorage.removeItem('token')
      this.authenticateUser()
    },
    async authenticateUser() {
      await authenticate({
        nickname: "admin",
        password: "arretadas123",
      })
      .then((response) => {
        const { token } = response.data
        this.$api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        sessionStorage.setItem("token", `Bearer ${token}`);
      })
      .catch(() => this.errors.push("Erro ao tentar realizar operação"));
    },
    async getAlertas(date) {
      await this.$api.get(`/alert?init=${date.init}&final=${date.final}`)
        .then(
          (response) =>
            (this.alerts = response.data.map((el) => {
              return {
                date: moment(el.date).format("DD-MM-YYYY"),
                coordinates: {
                  latitude: el.latitude,
                  longitude: el.longitude,
                },
              };
            }))
        )
        .catch(() => (this.logoutUser()));
    },
    async getComplaints(date) {
      await this.$api.get(`/complaint?init=${date.init}&final=${date.final}`)
        .then(
          (response) =>
            (this.complaints = response.data.map((el) => {
              return {
                date: moment(el.date).format("DD-MM-YYYY"),
                coordinates: {
                  latitude: el.latitude,
                  longitude: el.longitude,
                },
              };
            }))
        )
        .catch(() => (this.logoutUser()));
    },
    search() {
      this.errors = [];

      if (this.initialDate === "") {
        this.errors.push("Favor preencher o campo data inicial!");
        return
      }
      
      if (this.finalDate === "") {
        this.errors.push("Favor preencher o campo data final!");
        return
      }
      
      if (this.selectedType === "") {
        this.errors.push("Favor escolher o tipo!");
        return
      }

      const dates = {
        init: this.customFormatter(this.initialDate),
        final: this.customFormatter(this.finalDate)
      }
      
      this.selectedType === "Alerta"
        ? this.getAlertas(dates)
        : this.getComplaints(dates)
      }
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