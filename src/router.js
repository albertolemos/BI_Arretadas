import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './views/Login'
import Home from './views/Home'

Vue.use(VueRouter)

export default new VueRouter({
    routes: [
        {
            path: '/home',
            component: Home
        },
        {
            path: '/',
            component: Login
        }
    ],
    mode: 'history'
})