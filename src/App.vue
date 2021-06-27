<template>
  <v-app>
    <div class="box">
      <h2>Pesquisar</h2>
      <NumberCases></NumberCases>
    </div>
    <br />
    <Footer></Footer>
  </v-app>
</template>

<script>
import vuetify from "../src/plugins/vuetify";
import NumberCases from "./components/NumberCases";
import Footer from "./components/Footer";

export default {
  name: "app",
  vuetify,
  components: {
    NumberCases,
    Footer,
  },
};
</script>

<style >
.box h2 {
  text-align: center;
  font-weight: bold;
  font-size: 25px;
  margin-bottom: 1em;
}
</style>
