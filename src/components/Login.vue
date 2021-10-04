<template>
  <v-app>
    <Header />
    <div class="row align-items-center justify-content-center">
      <div class="col-md-12">
        <div class="login">
          <h2>Login</h2>
          <input type="text" placeholder=" Usuário" v-model="user" />
          <br />
          <input type="password" placeholder=" Senha" v-model="password" />
          <div v-if="errors.length" class="alert">
            <div v-for="error in errors" :key="error">
              {{ error }}
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
import Header from "./Header";
import NumberCases from "./NumberCases";
import Footer from "./Footer";

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
        this.$router.replace("/");
      }
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

.alert {
  font-size: 20px;
  font-weight: bold;
  margin-top: 1em;
  text-align: left;
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
