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
    customFormatterDate(date) {
      return moment(date).format("DD/MM/YYYY");
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
          this.errors.push("Erro ao tentar realizar autenticação do usuário")
        );
    },
    async getAlerts(date) {
      await this.$api
        .get(`/alert?init=${date.init}&final=${date.final}`)
        .then(
          (response) =>
            (this.alerts = response.data.map((el) => {
              return {
                date: this.customFormatterDate(el.date),
                district: el.district,
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
                date: this.customFormatterDate(el.date),
                district: el.district,
                typeComplaint: el.type_complaint.toString(),
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
      (this.initialDate = ""), (this.finalDate = ""), (this.selectedType = "");
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
</style>