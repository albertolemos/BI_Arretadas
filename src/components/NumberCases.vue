<template>
  <v-container>
    <div class="container">
      <div class="flex">
        <div class="flex items-center">
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
        </div>

        <div class="flex items-center">
          <strong>Até*</strong>
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
      </div>
      <br />

      <v-combobox
        class="mb-4"
        v-model="selectedType"
        :items="types"
        label="Selecione um tipo de ocorrência*"
      ></v-combobox>

      <div class="buttom">
        <v-btn @click="search()"> Pesquisar</v-btn>
      </div>

      <div v-if="errors.length">
        <p v-for="error in errors" :key="error">{{ error }}</p>
      </div>
      <br />
      <small>* Campos obrigatórios</small>
    </div>
  </v-container>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import { ptBR } from "vuejs-datepicker/dist/locale";
import moment from "moment";
import { authenticate } from "@/services/authentication";

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
      types: ["Alertas", "Denúncias"],
      alerts: [],
      complaints: [],
      errors: [],
    };
  },

  async mounted() {
    this.token = sessionStorage.getItem("token");
    if (!this.token) {
      this.authenticateUser();
    }
  },
  methods: {
    customFormatter(date) {
      return moment(date).format("YYYY-MM-DD");
    },
    logoutUser() {
      sessionStorage.removeItem("token");
      this.authenticateUser();
    },
    async authenticateUser() {
      await authenticate({
        nickname: "admin",
        password: "arretadas123",
      })
        .then((response) => {
          const { token } = response.data;
          this.$api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;
          sessionStorage.setItem("token", `Bearer ${token}`);
        })
        .catch(() => this.errors.push("Erro ao tentar realizar operação"));
    },
    async getAlertas(date) {
      await this.$api
        .get(`/alert?init=${date.init}&final=${date.final}`)
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
        .catch(() => this.logoutUser());
    },
    async getComplaints(date) {
      await this.$api
        .get(`/complaint?init=${date.init}&final=${date.final}`)
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
        this.errors.push("Favor escolher o tipo!");
        return;
      }

      const dates = {
        init: this.customFormatter(this.initialDate),
        final: this.customFormatter(this.finalDate),
      };

      this.selectedType === "Alerta"
        ? this.getAlertas(dates)
        : this.getComplaints(dates);
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
  margin-bottom: 1rem;
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
  margin-left: 20px;
  display: flex;
  justify-content: center;
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