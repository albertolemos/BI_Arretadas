<template>
  <v-app>
    <Header></Header>
    <div class="box">
      <h2>Pesquisar</h2>
      <NumberCases></NumberCases>
    </div>
    <Footer></Footer>
  </v-app>
</template>

<script>
import vuetify from "../plugins/vuetify";
import Header from "../components/Header";
import NumberCases from "../components/NumberCases";
import Footer from "../components/Footer";
import { validateToken } from "@/services/validationToken";

import "@mdi/font/css/materialdesignicons.css";

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
      token: "",
    };
  },

  mounted() {
    this.token = localStorage.getItem("token");
    if (this.token) {
      this.verifyTokenUser(this.token);
    }else {
      this.logout();
    }
  },

  methods: {
    async verifyTokenUser(token) {
      await validateToken({
        oldToken: token,
      }).catch(() => this.logout());
    },

    logout() {
      localStorage.removeItem("token");
      this.$router.replace("/");
    },
  },
};

</script>

<style >
.box {
  margin: 2rem 0 auto;
}

.box h2 {
  text-align: center;
  font-weight: bold;
  font-size: 25px;
  margin-bottom: 1em;
}
</style>
