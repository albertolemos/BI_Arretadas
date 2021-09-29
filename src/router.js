import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login'
import Home from './components/Home'

Vue.use(VueRouter)

export default new VueRouter({
    routes: [
        {
            path: '/',
            component: Home
        },
        {
            path: '/login',
            component: Login
        }
    ],
    mode: 'history'
})