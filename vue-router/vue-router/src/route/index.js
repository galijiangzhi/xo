import {createRouter,createWebHashHistory} from 'vue-router'
import about from '../components/about.vue'
import home from '../components/home.vue'

const routes = [{
    path:'/about',
    component:about
},
{
    path:'/home',
    component:home
}]

const router = createRouter({
    history:createWebHashHistory(),
    routes
})
export default router