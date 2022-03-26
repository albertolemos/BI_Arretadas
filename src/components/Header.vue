<template>
  <header class="header">
    <img src="../assets/logo.png" alt="Logo arretadas" />
    <p class="title">Relatórios</p>
    <v-btn v-show="showBtn" title="Sair" color="#00d1b2" depressed @click="logout">
      <v-icon color="#fff">mdi-logout</v-icon>
    </v-btn>
  </header>
</template>

<script>

import { mdiLogout } from "@mdi/js";
import { logoutUser } from '../services/logout';
import "@mdi/font/css/materialdesignicons.css";

export default {
  name: "Header",
  mdiLogout,
  icons: {
    iconFont: "mdi-logout",
  },

  data() {
    return {
      showBtn: false
    }
  },

  mounted() {
    this.token = sessionStorage.getItem("token");
    this.showBtn = this.token ? true : false;
  },

  methods: {
    logout(){
      logoutUser();
      this.$router.replace("/login");
    }
  }
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #00d1b2;
  padding: 1rem 10rem;
  width: 100%;
}

.title {
  font-size: 2.5rem;
  color: #fff;
}

img {
  height: 70px;
}

@media only screen and (max-width: 800px) {
  .header {
    padding: 1em 1em;
  }

  img {
    height: 50px;
  }
}
</style>