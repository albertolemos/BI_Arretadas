<template>
  <v-footer dark padless>
    <v-card class="flex" color="#00d1b2" flat tile>
      <v-card-title class="titleCard">
        <strong class="subheading">Projeto Arretadas</strong>
      </v-card-title>

      <v-card-text class="white--text">
        <p>&copy;</p>
        {{ new Date().getFullYear() }}
        <strong> Arretadas — IFPE Campus Garanhuns. </strong>
        <p>Todos os direitos reservados.</p>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"],
    };
  },
};
</script>

<style scoped>
.flex .mx-4 {
  background-color: #00d1b2;
  position: relative;
  bottom: 0;
  left: 0;
  right: 0;
}

.subheading {
  color: #fff;
}

.titleCard,
.white--text {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff !important;
}

.white--text strong {
  margin-left: 5px;
  color: #fff;
}

.white--text p {
  margin-right: 5px;
  margin-left: 5px;
}
</style>