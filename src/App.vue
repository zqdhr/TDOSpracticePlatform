<template>
  <div id="app">
    <!--
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    -->
    <router-view/>
  </div>
</template>
<script>
export default {
  
}
</script>
<style lang="less">
	@import url("assets/fonts/Source-Han-Sans-CN-Regular.css");

#app {

  font-family: 'Source-Han-Sans-CN-Regular', Helvetica,"Hiragino Sans GB", Arial, sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width:100%;height: 100%;
 
  font-weight: normal; font-style: normal;
  
}


</style>
