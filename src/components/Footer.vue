<template>
  <v-footer dark padless>
    <v-card class="flex" color="#00d1b2" flat tile>
      <v-card-title class="titleCard">
        <strong class="subheading">Projeto Arretadas</strong>
      </v-card-title>

      <v-card-text class="white--text">
        <p v-show="showBtn" class="text-center">
          Este relatório é de visualização apenas do poder público
          e somente quem pode compartilhar é a própria gestão pública.
          A divulgação desses dados fica a cargo de quem divulga.
        </p>
      </v-card-text>
      
      <v-card-text class="white--text">
        <p>&copy;</p>
        <p>{{ new Date().getFullYear() }}</p>
        <p><strong> Arretadas — IFPE Campus Garanhuns. </strong></p>
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
      showBtn: false
    };
  },

  mounted(){
    this.token = localStorage.getItem("token");
    this.showBtn = this.token ? true : false;
  }
};
</script>

<style scoped>
.subheading {
  color: #fff;
}

.titleCard,
.white--text {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.white--text strong {
  margin-left: 5px;
  color: #fff;
}

.text-center {
  font-size: 1.2rem;
  max-width: 50vw;
}

.white--text p {
  margin-right: 5px;
  margin-left: 5px;
}

@media only screen and (max-width: 600px) {
  .subheading {
    font-size: 1.4rem;
  }
  .white--text {
    font-size: 1rem;
  }

  .text-center {
    max-width: 80vw;
  }

}
</style>