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
                    <a  :class="{'cur':index==navindex}" v-for="(item,index) in menu" :key="index" @click="linkDetails(item,index)">{{item.name}}</a>
                </div>
                 <!--课程大纲-->
                <div v-if="navindex==0">
                    <ul></ul>
                </div>
             
                <div v-if="navindex==1">开课时间</div>

                <div v-if="navindex==2">学生信息</div>

                <div v-if="navindex==3">课程实验</div>

                <div v-if="navindex==4">课程课件</div>

                <div v-if="navindex==5">课程作业</div>

                
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
               {name:'课程大纲'},
               {name:'开课时间'},
               {name:'学生信息'},
               {name:'课程实验'},
               {name:'课程课件'},
               {name:'课程作业'}
            ],

          
            chapters:[
                {
                    title:'标题内容标题内容标题内容',
                    intro:'简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容',
                    sections:[
                        {
                        title:'标题内容标题内容标题内容标题内容',
                        enclosure:'1,2,3,4'
                        },
                        {
                        title:'标题内容标题内容标题内容标题内容',
                        enclosure:'1,2,3,4'
                        }
                    ],
                },
                {
                    title:'标题内容标题内容标题内容',
                    intro:'简介内容简介内容简介内容简介内容简介内容简介内容简介内容简介内容',
                    sections:[
                        {
                        title:'标题内容标题内容标题内容标题内容',
                        enclosure:'1,2,3,4'
                        },
                        {
                        title:'标题内容标题内容标题内容标题内容',
                        enclosure:'1,2,3,4'
                        }
                    ]
                }
            ]
            
        }
    },
    created(){
        let that = this;
        that.backNum = that.$route.query.back?that.$Base64.decode(that.$route.query.back):2
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
                that.$router.push({path:'/teacher/lessonPreparationManagement'}).catch((err)=>{
                   console.log(err)
               })
               that.$store.commit("updateNavindex", 1);
            }
        },

        //页面nav切换
        linkDetails(item,num){
          let that = this;
          that.navindex = num;
      
        }

    }
}
</script>

<style lang="less" scoped>
@import url(../../assets/less/teacher.less);
</style>