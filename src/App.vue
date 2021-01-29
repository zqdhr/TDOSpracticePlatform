<template>
  <div id="app">
    <!--
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    -->
    <router-view v-if="isRouterAlive"/>
  </div>
</template>
<script>
export default {
   provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。                                             
            return {
                reload: this.reload                                              
            }
        },
        data() {
            return{
                isRouterAlive: true                    //控制视图是否显示的变量
            }
        },
        methods: {
            reload () {
                this.isRouterAlive = false;            //先关闭，
                this.$nextTick(function () {
                    this.isRouterAlive = true;         //再打开
                }) 
            }
        },
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
input,select,ul,li,textarea{
  font-family: 'Source-Han-Sans-CN-Regular', Helvetica,"Hiragino Sans GB", Arial, sans-serif !important;
}


</style>
