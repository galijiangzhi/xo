<template>
  <router-link to="/home">首页</router-link>|
  <router-link to="/boke">boke</router-link>
  <router-view></router-view>
</template>

<script>
import { createRouter, createWebHashHistory } from "vue-router";
import shouye from './components/shouye.vue'
import boke from './components/boke.vue'
const router = createRouter({
  history:createWebHashHistory(),
  routes:[
    {
      path:"/home",
      component:shouye,
    },
    {
      path:"/boke",
      component:boke,
    }
  ]
});
export default router;
</script>

<style>
</style>