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
import { validate } from "@/services/validationToken";

import "@mdi/font/css/materialdesignicons.css";
import { logoutUser } from '../services/logout';

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
      userToken: "",
    };
  },

  mounted() {
    this.userToken = sessionStorage.getItem("userToken");
    !this.userToken ? this.logout() : this.verifyTokenUser(this.userToken);
  },

  methods: {
    async verifyTokenUser(token) {
      await validate({
        oldToken: token,
      }).catch(() => this.logout());
    },

    logout() {
      logoutUser();
      this.$router.replace("/login");
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
