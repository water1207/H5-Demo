<template>
  <div id="app">
    <button><router-link to="/">View1</router-link></button>
    <button><router-link to="/MyView2">View2</router-link></button> 
    <button><router-link to="/MyView3">View3</router-link></button>
    <button><router-link to="/MyView4">View4</router-link></button>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
};
</script>

<style>

</style>
