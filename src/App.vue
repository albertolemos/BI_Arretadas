<template>
  <v-app>
    <ArretadasHeader />
    <div class="box">
      <h2>Pesquisar</h2>
      <NumberCases></NumberCases>
    </div>
    <Footer></Footer>
  </v-app>
</template>

<script>
import vuetify from "../src/plugins/vuetify";
import NumberCases from "./components/NumberCases";
import Footer from "./components/Footer";
import ArretadasHeader from "./components/ArretadasHeader";

export default {
  name: "app",
  vuetify,
  components: {
    NumberCases,
    Footer,
    ArretadasHeader
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
