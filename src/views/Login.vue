<template>
  <v-app>
    <Header />
    <div class="row align-items-center justify-content-center">
      <div class="col-md-12">
        <div class="login">
          <h2>Login</h2>
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
          <div class="inputs">
            <div class="inputUser">
              <v-text-field
                :prepend-inner-icon="mdiAccount"
                type="email"
                :rules="rules"
                placeholder="Usuário"
                v-model="user"
                v-on:keyup.enter="login()"
              />
            </div>
            <div class="inputPassword">
              <v-text-field
                :prepend-inner-icon="mdiLockOutline"
                type="password"
                :rules="rules"
                placeholder="Senha"
                v-model="password"
                v-on:keyup.enter="login()"
              />
            </div>
          </div>
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
import { mdiExclamation, mdiAccount, mdiLockOutline, mdiClose } from "@mdi/js";

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
      mdiExclamation,
      mdiAccount,
      mdiLockOutline,
      mdiClose,
      rules: [
        (value) => !!value || "Obrigatório.",
        (value) => (value || "").length >= 5 || "Min. 5 caracteres",
      ],
    };
  },

  methods: {
    login() {
      this.errors = [];
      if (!this.user) {
        this.errors.push("Favor preencher o campo Usuário.");
        return;
      }

      if (!this.password) {
        this.errors.push("Favor preencher o campo Senha.");
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
  /* margin-top: 1em;
  margin-bottom: 1em; */
  width: 100%;
  height: 100%vh;
  display: grid;
  justify-content: center;
  text-align: center;
}

h2 {
  margin-top: 1em;
  margin-bottom: 1.5em;
}

.btn-login {
  margin-top: 1em;
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

  .inputs {
    margin: -1rem auto 2rem auto;
    width: 95%;
  }

  .row {
    width: 103%;
    height: 100%vh;
    display: grid;
  }
}
</style>
