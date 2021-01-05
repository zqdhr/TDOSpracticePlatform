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
 created () {
//在页面加载时读取sessionStorage里的状态信息
if (sessionStorage.getItem("store") ) {
this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
}

//在页面刷新时将vuex里的信息保存到sessionStorage里
window.addEventListener("beforeunload",()=>{
sessionStorage.setItem("store",JSON.stringify(this.$store.state))
})
}

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
input,select{
  font-family: 'Source-Han-Sans-CN-Regular', Helvetica,"Hiragino Sans GB", Arial, sans-serif !important;
}


</style>
