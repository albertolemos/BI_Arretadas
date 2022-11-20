<template>
  <v-app>
    <Header />
    <div class="row">
      <div class="col-md-12">
        <v-form class="login" @submit="login">
          <h1>Login</h1>
          <v-snackbar v-model="snackbar" :timeout="timeout" color="error" rounded>
            {{ text }}

            <template v-slot:action="{ attrs }">
              <v-btn icon v-bind="attrs" @click="snackbar = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
          </v-snackbar>
          <div class="inputs">
            <div class="inputUser">
              <v-text-field :prepend-inner-icon="mdiAccount" type="text" :rules="rules" placeholder="Usuário"
                v-model="user" v-on:keyup.enter="login" />
            </div>
            <div class="inputPassword">
              <v-text-field :prepend-inner-icon="mdiLock" v-model="password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :rules="rules"
                :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword"
                placeholder="Senha" v-on:keyup.enter="login" />
            </div>
          </div>
          <div class="btn-login">
            <v-btn class="button" type="submit">Entrar</v-btn>
          </div>
          <p>
            <v-snackbar v-model="snackbarCopy" :timeout="timeout" color="success" elevation="10" rounded>
              E-mail copiado com sucesso para a área de transferência!
              <template v-slot:action="{ attrs }">
                <v-btn icon v-bind="attrs" @click="snackbarCopy = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
            </v-snackbar>
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
import { mdiExclamation, mdiAccount, mdiLockOutline, mdiClose, mdiLock } from "@mdi/js"
import vuetify from "../plugins/vuetify"
import Header from "../components/Header"
import NumberCases from "../components/NumberCases"
import Footer from "../components/Footer.vue"
import { validateToken } from "@/services/validationToken"
import { validateLogin } from '../services/validationLogin';

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
      snackbar: false,
      snackbarCopy: false,
      text: '',
      timeout: 5000,
      showPassword: false,
      token: "",
      mdiExclamation,
      mdiAccount,
      mdiLockOutline,
      mdiClose,
      mdiLock,
      rules: [
        value => !!value || "Obrigatório.",
        value => (value || "").length >= 5 || "Mínimo de 5 caracteres.",
      ],
    };
  },

  mounted() {
    this.token = localStorage.getItem("token");
    if (this.token) {
      this.$router.replace("/home");
    }
  },

  methods: {
    async verifyTokenUser(token) {
      await validateToken({
        oldToken: token,
      }).then(() => this.$router.replace("/home"))
    },

    login(e) {
      e.preventDefault()
      this.text = validateLogin(this.user, this.password);
      
      if(this.snackbarCopy) this.snackbarCopy = false;
      if(this.text.length >= 1) this.snackbar = true;
      else {
        this.authenticateUser()
          .then(() => this.$router.replace("/home"))
          .catch(() => {
            this.text = 'Usuário e/ou senha inválido(s). Tente novamente!'
            this.snackbar = true
          })
      }
    },

    async authenticateUser() {
      await this.$api
        .post("/userAdm/authenticate", {
          name: this.user,
          password: this.password,
        })
        .then(response => {
          this.token = response.data.token;
          this.$api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${this.token}`
          localStorage.setItem("token", `${this.token}`)
        })
    },

    copyText() {
      if (this.snackbar) this.snackbar = false
      navigator.clipboard.writeText('arretadasapp@gmail.com')
      this.snackbarCopy = true
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

.button {
  background-color: #00d1b2 !important;
  color: #FFF !important;
}

p {
  margin-top: 40px;
  font-size: 1rem;
}

p a {
  text-decoration: underline;
  cursor: pointer;
}

.showBtn {
  background: red;
}


.hiddenBtn {
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
