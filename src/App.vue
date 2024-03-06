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
.canvas {
  max-width: 375px; /* 或者使用 100vw 来确保宽度在视口宽度内 */
  height: 667px; /* 模拟常见的H5页面高度 */
  margin: auto;
  border: 1px solid #ccc;
  position: relative;
  overflow: hidden;
}

.canvas-component {
  position: relative;
}
</style>
