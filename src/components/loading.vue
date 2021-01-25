<template>
    <div class="trans">
        <a class="close pointer" @click="hideLoading"></a>
        <div class="loading_main">
            <div class="loading_pic"></div>
            <p class="mess">
                正在下载，请稍后...
            </p>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    methods:{
        hideLoading(){
            let that = this;
            that.$emit('hideLoading')
           
        }
    }
}
</script>
<style lang="less" scoped>
.trans{position: fixed;width:100%; height:100%;left:0px;top:0px; background: rgba(0,0,0,.5); z-index: 9999; display: table;}
.loading_main{display: table-cell; vertical-align: middle;}
.mess{font-size:18px;color:#fff; text-align: center; margin-bottom: 10px;}

.loading_pic{width:50px;height:50px;display: block; margin: 0 auto; background: url(../assets/img/loading.png) center no-repeat;
 animation:loading 1.5s linear infinite;
-moz-animation:loading 1.5s linear infinite; /* Firefox */
-webkit-animation:loading 1.5s linear infinite; /* Safari and Chrome */
-o-animation:loading 1.5s linear infinite; /* Opera */
}
.close{width:36px;height:36px;display: block; background: url(../assets/img/a_white_close.png) center no-repeat; position:absolute; top:30px;right: 30px;}

@keyframes loading{
    form {
        transform:rotate(0deg);
    }
    to{
        transform:rotate(360deg);
    }
}
@-moz-keyframes loading{
    form {
        transform:rotate(0deg);
    }
    to{
        transform:rotate(360deg);
    }
}
@-webkit-keyframes loading{
    form {
        transform:rotate(0deg);
    }
    to{
        transform:rotate(360deg);
    }
}
@-o-keyframes loading{
    form {
        transform:rotate(0deg);
    }
    to{
        transform:rotate(360deg);
    }
}
</style>