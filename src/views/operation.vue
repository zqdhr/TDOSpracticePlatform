<template>
    <div class="content">
        <div>
            <input class="i-in" placeholder="请输入ip如：192.168.1.133" v-model="ip"/>
            <input class="i-in" placeholder="请输入端口如：8080" v-model="port"/>
            <a class="pointer btnSure" @click="sureContact">确定</a>
        </div>

        <xterm :socketURI="socketURI" ref="xterm" v-if="socketURI!=''"></xterm> 

    </div>

</template>
<script>
 import xterm from '@/components/Xterminal1.vue'
export default {
    data(){
        return{
            socketURI:'',
            ip:'192.168.1.167',
            port:'4002'
        }
    },
    components:{
        xterm
    },
    methods:{
        sureContact(){
            let that = this;
            that.socketURI = 'ws://'+that.ip+':'+that.port+'/terminals/'
            //console.log(that.socketURI )

            //that.$refs.xterm.initSocket();
        }
    }
}
</script>

<style lang="less" scoped>
  .content{width:100%;height:100%;min-height: 800px;}
  .i-in{width:250px;line-height: 40px; margin: 20px  20px 0 20px; border:1px solid #dcdcdc; padding:0 20px;}
  .btnSure{display: inline-block; padding: 5px 8px; background: @basecolor; color:#fff;}
</style>
