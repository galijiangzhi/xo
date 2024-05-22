import { createRouter, createWebHashHistory } from "vue-router";
import shouye from './components/shouye.vue'
import boke from './components/boke.vue'

const router = createRouter({
    history:createWebHashHistory(),
    routes:[
      {
        path:"/home",
        component:shouye
      },
      {
        path:"/boke",
        component:boke
      }
    ]
  });
export default router;