<template>
  <div class="PP_header">
    <div class="header-container">
      <div class="container">
        <div class="fl fl-logo">
          <div class="logo"></div>
          <span>区块链实践平台</span>
        </div>

        <div class="fr fr-info">
          欢迎你,<span>陈友谅(工号:0056)</span>
          <div class="hline"></div>
          <a class="btnexit" @click="logOut">退出系统</a>
        </div>
        <ul class="nav_ul">
          <li
            :class="{ cur: index == state.navindex }"
            v-for="(item, index) in menus"
            :key="index"
          >
            <a @click="linPath(item, index)">{{ item.text }}</a>
            <ul v-if="item.children" class="children-ul">
              <li v-for="(iitem, iindex) in item.children" :key="iindex">
                <a @click="children_linPath(item, index)">{{ iitem.text }}</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      menus:[],
    }
  },
  computed: {
    ...mapState({
      state: (state) => state,
    }),
  },
  mounted(){
      let that = this;
      let num = sessionStorage.getItem('p_p-authority');
      if(num==2){
         that.menus = that.$store.state.ad_menus;
      
      }
      if(num==1){
        that.menus = that.$store.state.tea_menus;
        
       
      }
    
  },
  methods: {
    linPath(item, num) {
      let that = this;
      that.$store.commit("updateNavindex", num);
      let tmp = that.menus;
      if (!item.children) {
    
        that.$router.push({ path: item.path }).catch((err) => {
          console.log( err);
        });
      }
    },
    //退出登录
    logOut(){
      let that = this;
     
     window.sessionStorage.removeItem('store')
      let authority = sessionStorage.getItem('p_p-authority') ;
      if(authority==2){
          window.sessionStorage.removeItem('p_p-admin_userName')
          window.sessionStorage.removeItem('p_p-authority')
      }  
      if(authority==1){
          window.sessionStorage.removeItem('p_p-teacher_userName')
          window.sessionStorage.removeItem('p_p-authority')
      }
      that.$store.commit("updateNavindex", 0);
      that.$router.push({ path:'/login'}).catch((err) => {
        console.log(err);
      });
    }
  },
};
</script>
<style lang="less" scoped>
.PP_header {
  position: fixed;
  width: 100%;
  height: 75px;
  background: #fff;
  top: 0px;
  z-index: 999;
  width: 100%;
  -moz-box-shadow: 0px 4px 6px 0px rgba(8, 22, 125, 0.14); /*firefox*/
  -webkit-box-shadow: 0px 4px 6px 0px rgba(8, 22, 125, 0.14); /*webkit*/
  box-shadow: 0px 4px 6px 0px rgba(8, 22, 125, 0.14); /*opera或ie9*/

  .header-container {
    margin: 0 60px;
  }
  .logo {
    width: 33px;
    height: 33px;
    display: inline-block;
    vertical-align: top;
    background: @basecolor;
  }
  .fl-logo {
    padding: 21px 0;
    height: 33px;
    line-height: 33px;
    span {
      color: @fontColor;
      padding-left: 15px;
      font-size: 18px;
    }
  }

  .fr-info {
    color: @fontColor1;
    line-height: 35px;
    height: 35px;
    margin-top: 20px;
    font-size: 14px;
    .hline {
      width: 2px;
      height: 15px;
      background: #ddd;
      display: inline-block;
      vertical-align: middle;
      margin: 0 10px;
    }
    .btnexit {
      padding-left: 20px;
      background: url(../assets/img/icon_exit.png) left center no-repeat;
      cursor: pointer;
    }
    .btnexit:hover {
      color: @basecolor;
      background: url(../assets/img/icon_exit_h.png) left center no-repeat;
      cursor: pointer;
    }
  }

  .nav_ul {
    margin: 0 auto;
    text-align: center;
    > li { padding: 0 30px; display: inline-block; height: 75px; line-height: 75px; position: relative; }
    > li a { font-size: 18px; color: @hnavcolor; cursor: pointer; padding: 10px 8px; }
    > li:hover a, > li.cur a { color: @basecolor; }
    > li:hover:after,
    > li.cur:after { content: ""; width: 71px; height: 3px; position: absolute; left: 50%; margin-left: -35px; bottom: 0px; background: @basecolor; }
    .children-ul {
      position: absolute;
      width: 150px;
      background: #fff;
      left: 50%;
      margin-left: -75px;
      border: 1px solid #dcdcdc;
      border-top: 0 none;
      padding-top: 5px;
      display: none;
      > li { height: 50px; line-height: 50px; }
      > li a { color: @hnavcolor; }
      > li a:hover { color: @basecolor; }
      
    }
    > li:hover{
        .children-ul{display: block;}
     }
  }
  @media screen and (min-width: 1500px) {
    .nav_ul {
      > li {
        padding: 0 40px;
      }
    }
  }
  @media screen and (max-width: 1360px) {
    .nav_ul {
      > li {
        padding: 0 20px;
      }
    }
  }
   @media screen and (max-width: 1240px) {
    .nav_ul {
      > li {
        padding: 0 10px;
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .PP_header {
    width: 1200px;
    position: static;
  }
}
</style>