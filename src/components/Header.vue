<template>
  <header class="header">
    <img src="../assets/logo.png" alt="Logo arretadas" />
    <p class="title">Relatórios</p>
  </header>
</template>

<script>
export default {
  name: "Header",
};
</script>

<style scoped>
.header {
  background-color: #00d1b2;
  padding: 1rem 10rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
    padding: 1rem 3rem;
  }
}
</style>