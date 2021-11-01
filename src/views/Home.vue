<template>
  <v-app>
    <Header></Header>
    <div class="box">
      <h2>Pesquisar</h2>
      <v-card-text style="height: 100px; position: absolute">
        <v-fab-transition>
          <v-btn
            title="Sair"
            color="#00d1b2"
            dark
            absolute
            top
            right
            fab
            @click="logout()"
          >
            <v-icon color="#fff">mdi-logout</v-icon>
          </v-btn>
        </v-fab-transition>
      </v-card-text>
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

import { mdiLogout } from "@mdi/js";
import "@mdi/font/css/materialdesignicons.css";

export default {
  name: "app",
  vuetify,
  components: {
    Header,
    NumberCases,
    Footer,
    mdiLogout,
    icons: {
      iconFont: "mdi-logout",
    },
  },

  methods: {
    logout() {
      sessionStorage.removeItem("userToken");
      sessionStorage.removeItem("token");
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
