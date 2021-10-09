<template>
  <v-app>
    <Header />
    <div class="row align-items-center justify-content-center">
      <div class="col-md-12">
        <div class="login">
          <h2>Login</h2>
          <div class="error-alert" v-if="errors.length">
            <v-alert
              dense
              text
              :icon="mdiExclamation"
              type="error"
              v-for="error in errors"
              :key="error"
            >
              {{ error }}
            </v-alert>
          </div>
          <v-text-field
            type="text"
            :rules="rules"
            placeholder=" Usuário"
            v-model="user"
          />
          <br />
          <v-text-field
            type="password"
            :rules="rules"
            placeholder=" Senha"
            v-model="password"
          />
          <div class="btn-login">
            <v-btn @click="login()" class="button">Entrar</v-btn>
          </div>
          <p>
            Você não tem acesso? Envie um e-mail para
            <a> arretadasapp@gmail.com</a> e solicite.
          </p>
        </div>
      </div>
    </div>
    <Footer />
  </v-app>
</template>

<script>
import vuetify from "../plugins/vuetify";
import Header from "../components/Header";
import NumberCases from "../components/NumberCases";
import Footer from "../components/Footer.vue";
import { mdiAccount, mdiExclamation } from "@mdi/js";

export default {
  name: "app",
  vuetify,
  components: {
    Header,
    NumberCases,
    Footer,
  },

  data() {
    return {
      user: "",
      password: "",
      errors: [],
      userToken: "",
      mdiAccount,
      mdiExclamation,
      rules: [
        (value) => !!value || "Obrigatório.",
        (value) => (value || "").length >= 5 || "Min. 5 caracteres",
      ],
    };
  },

  methods: {
    login() {
      this.errors = [];
      if (this.user === "") {
        this.errors.push("Favor preencher o campo Usuário!");
        return;
      }

      if (this.password === "") {
        this.errors.push("Favor preencher o campo Senha!");
        return;
      }

      if (this.errors.length == 0) {
        this.authenticateUser()
          .then(() => this.$router.replace("/"))
          .catch(() =>
            this.errors.push("Usuário e/ou senha inválido(s). Tente novamente!")
          );
      }
    },

    async authenticateUser() {
      await this.$api
        .post("/userAdm/authenticate", {
          name: this.user,
          password: this.password,
        })
        .then((response) => (this.userToken = response.data.token))
        .then(() => sessionStorage.setItem("userToken", this.userToken));
    },
  },
};
</script>

<style scoped>
.login {
  margin-top: 2em;
  margin-bottom: 2em;
  width: 100%;
  height: 100%vh;
  display: grid;
  justify-content: center;
  text-align: center;
}

h2 {
  margin-top: 0.5em;
  margin-bottom: 3em;
}

input {
  margin: 5px;
  width: 100%;
  border-top: none;
  border-bottom: solid 1px;
  outline: none;
}

.btn-login {
  margin-top: 2em;
  display: flex;
  justify-content: space-evenly;
}

p {
  margin-top: 40px;
  font-size: 13px;
}

p a {
  text-decoration: underline;
  cursor: pointer;
}

@media only screen and (max-width: 800px) {
  input {
    font-size: 15px;
    width: 95%;
  }
  .login {
    padding: 1rem 2rem;
    width: 104%;
  }
  .row {
    width: 103%;
    height: 100%vh;
    display: grid;
  }
}
</style>
