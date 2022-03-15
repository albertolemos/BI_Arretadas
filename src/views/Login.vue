<template>
  <v-app>
    <Header />
    <div class="row">
      <div class="col-md-12">
        <v-form class="login" @submit="login">
          <h1>Login</h1>
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
                type="text"
                :rules="rules"
                placeholder="Usuário"
                v-model="user"
                v-on:keyup.enter="login"
              />
            </div>
            <div class="inputPassword">
              <v-text-field
                v-model="password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="rules"
                :type="showPassword ? 'text' : 'password'"
                @click:append="showPassword = !showPassword"
                placeholder="Senha"
                v-on:keyup.enter="login"
              />
            </div>
          </div>
          <div class="btn-login">
            <v-btn class="button" type="submit">Entrar</v-btn>
          </div>
          <p>
            Você não tem acesso? Envie um e-mail para
            <a title="Clique no email para copia-lo" @click="copyText"> arretadasapp@gmail.com </a>
          </p>
        </v-form>
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
      showPassword: false,
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

  mounted(){
    // Essa rota não pode ser acessada se o usuário estiver em sessão
    this.userToken = sessionStorage.getItem("userToken");
    if (this.userToken){
      this.$router.replace("/");
    }
  },

  methods: {
    login(e) {
      e.preventDefault();

      this.errors = [];
      if (!this.user || !this.password) {
        this.errors.push("Por favor, preencha os campos!");
        return;
      }else if (this.user.length < 5 || this.password.length < 5){
        this.errors.push('Preencha corretamente os campos com pelo menos 5 caracteres!')
      }else{
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

    copyText(){
      navigator.clipboard.writeText('arretadasapp@gmail.com');
    }
  },
};
</script>

<style scoped>
.login {
  overflow: hidden;
  height: 100%;
  display: grid;
  justify-content: center;
  text-align: center;
}

h1 {
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
  font-size: 1rem;
}

p a {
  text-decoration: underline;
  cursor: pointer;
}

.showBtn{
  background: red;
}


.hiddenBtn{
  background: purple;
}

@media only screen and (max-width: 800px) {
  input {
    font-size: 15px;
    width: 95%;
  }
  
  .login {
    padding: 1rem 2rem;
    width: 100%;
  }

  .inputs {
    margin: -1rem auto 2rem auto;
    width: 95%;
  }

  .row {
    width: 100%;
    height: 100%;
    display: grid;
  }
}
</style>
