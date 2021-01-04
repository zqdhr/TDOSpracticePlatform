<template>
    <div class="pageWrap wrap-login">
        <div class="loginMain">
            <div class="d-col"><label>账号</label><input placeholder="请输入账号" v-model="userName"/></div>
            <div class="d-col"><label>密码</label><input placeholder="请输入密码" v-model="password"/></div>
            <div>
                <a class="btnlogin" @click="pp_login">登陆</a>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
           userName:'',//用户名
           password:'',//密码
            bodyBgImage: 'url(' + require('../assets/img/login_bg.png') + ')'
        }
    },

    mounted(){
        console.log('ok')
    
        this.$nextTick(()=>{
           this.setBodyBackGround()
        })
         
         
    },
     beforeDestroy(){
        // 离开页面的时候清除
            this.clearBodyBackGround()
            
    },
   methods:{
        pp_login(){
            let that = this;
            if(that.userName ==''){
                return  that.$toast('请输入账号',2000)
            }
            if(that.password ==''){
                return  that.$toast('请输入密码',2000)
            }

            window.sessionStorage.setItem('p_p-userName',that.userName)
            window.sessionStorage.setItem('p_p-password',that.password)
            that.$router.push({path:'/'})
        },
         // 添加body图片
        setBodyBackGround () {
            
            document.body.style.backgroundSize = '100%'
            document.body.style.backgroundImage = this.bodyBgImage
            
        },
            // 清除背景图
        clearBodyBackGround () {
           document.body.style.backgroundImage = ''
        }
    }
}
</script>
<style lang="less" scoped>
.wrap-login{display: table;}
.loginMain{ display: table-cell; vertical-align: middle;}
.d-col{padding: 10px 0;}
.btnlogin{cursor: pointer; padding:8px 5px; background:@basecolor; color:#fff;}
</style>