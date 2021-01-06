<template>
    <div class="pp_main boxsizing detail_main">
        <div class="container">
            <div class="pageTab">
                <div class="mess">
                    当前位置：<a class="pointer" @click="back">课程管理</a> > <span>区块链密码学（待发布）</span>
                </div>
            </div>
        </div>
        <div class="container container_info">
            <div class="info_box">
                <div class="detail_nav">
                    <a  :class="{'cur':index==navindex}" v-for="(item,index) in menu" :key="index" @click="linkDetails(index)">{{item.name}}</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
           backNum:1,
           navindex:0,
           menu:[
               {name:'课程大纲',path:''},
               {name:'开课时间',path:''},
               {name:'学生信息',path:''},
               {name:'课程实验',path:''},
               {name:'课程课件',path:''},
               {name:'课程作业',path:''}
            ]
        }
    },
    created(){
        let that = this;
        that.backNum = that.$Base64.decode(that.$route.query.back)
    },
    methods:{
        back(){
            //返回课堂管理
            let that = this;
            
            if(that.backNum==1){
               that.$router.push({path:'/teacher'}).catch((err)=>{
                   console.log(err)
               })
               that.$store.commit("updateNavindex", 0);
            }else{
                that.$router.push({path:'/lessonPreparationManagement'}).catch((err)=>{
                   console.log(err)
               })
               that.$store.commit("updateNavindex", 1);
            }
        },

        //页面nav切换
        linkDetails(num){
          let that = this;
          that.navindex = num
        }

    }
}
</script>

<style lang="less" scoped>
@import url(../../assets/less/teacher.less);
</style>