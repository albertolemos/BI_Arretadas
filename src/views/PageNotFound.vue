<template>
    <v-app>
        <div class="boxError">
            <h1>404</h1>
            <p>
                Página não encontrada : ( <br>
                <span @click="toHome">Clique aqui</span> para acessar a página inicial
            </p>
            <!-- <v-btn class="button" @click="toHome">Tela Inicial</v-btn> -->
        </div>
    </v-app>
</template>

<script>
import vuetify from "../plugins/vuetify";

import "@mdi/font/css/materialdesignicons.css";

export default {
    name: "app",
    vuetify,

    data() {
        return {
        };
    },

    methods: {
        toHome(){
            this.$router.replace("/home");
        }
    },
};

</script>

<style >
.boxError {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: #00d1b2;
    gap: 5px;
}

.boxError h1 {
    text-align: center;
    color: white;
    font-weight: bold;
    font-size: 11rem;
}

.boxError p {
    text-align: center;
    max-width: 40vw;
    color: white;
    font-size: 1.6rem;
}

.boxError p span {
    cursor: pointer;
    text-decoration: underline;
}

@media(max-width: 600px) {
    .boxError p {
        max-width: 100vw;
    }
}

</style>
