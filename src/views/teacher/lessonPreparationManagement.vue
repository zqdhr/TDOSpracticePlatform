<template>
    <div class="pp_main boxsizing">
        <div class="container">
            <div class="pageTab">
                <div class="clearfix">
                   
                    <div class="fr">
                       <a class="btnDefault pointer abtn" >归档</a>
                       <div class="d-serach"> 
                            <input :placeholder="inplaceholder" type="text" autocomplete="off" />
                            <a class="searchBtn pointer"></a>
                        </div>
                    </div>
                </div>
              
            </div>

            <div class="tea_list">
               <ul class="tab_box courseList_ul lp_courseList_ul">
                    <li v-for="(item,index) in courseList" :key="index">
                        <div class="pic"></div>
                        <div class="course-info boxsizing">
                            <div class="info_box">
                                <div class="cell-info boxsizing">
                                    <p class="p-name textline1">{{item.courname}}</p>
                                    <p class="p-text textline1">共有{{item.chapter}}个章节，共{{item.section}}个知识点</p>
                                    <p class="p-text textline1">{{item.introduction}}</p>
                                    <div class="data-box">
                                        <span class="s-time">{{item.time}}</span>
                                        <span class="s-number">共有{{item.number}}人参加该门课程</span>
                                    </div>
                                </div>
                                <div class="cell-fun boxsizing">
                                    <a class="btnDefault btn-fun pointer" @click="linkDetail">{{item.state==0?'待开课':'已开课'}}</a>
                                </div>
                            </div>
                        </div>
                    </li>
               </ul>
              
            </div>
            <div class="tab-pagination">
                <el-pagination
                        background
                        :current-page="curPage"
                        :page-size="perPage"
                        @current-change="handleCurrentChange"
                        layout="prev, pager, next,jumper"
                        :total="100"
                    >
                </el-pagination>
            </div>

        </div>
    </div>
</template>
<script>
export default {
    data(){
       return{
            perPage: 10,//每页条数
            curPage:1, //当前页
            inplaceholder:'请输入课程名称',
            courseList:[
                {courname:'原理篇',chapter:'10',section:'20',introduction:'内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述',time:'2020.9.12-2020.10.12',number:60,state:0},
                {courname:'原理篇',chapter:'10',section:'20',introduction:'内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述',time:'2020.9.12-2020.10.12',number:60,state:1},
                {courname:'原理篇',chapter:'10',section:'20',introduction:'内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述',time:'2020.9.12-2020.10.12',number:60,state:0},
                {courname:'原理篇',chapter:'10',section:'20',introduction:'内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述',time:'2020.9.12-2020.10.12',number:60,state:1},
                {courname:'原理篇',chapter:'10',section:'20',introduction:'内容描述内容描述内容描述内容描述内容描述内容描述内容描述内容描述',time:'2020.9.12-2020.10.12',number:60,state:1}
            ]
       }
    },
    methods:{
        //底部分页
        handleCurrentChange(val) {
           console.log(`当前页: ${val}`);
        },
        //点击备课跳转详情
        linkDetail(){
            let that = this
            that.$store.commit("updateNavindex", 1);
            that.$router.push({path:'/couseDetail',query:{back:this.$Base64.encode(2)}}).catch((err)=>{
                console.log(err)
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import url(../../assets/less/teacher.less);
</style>