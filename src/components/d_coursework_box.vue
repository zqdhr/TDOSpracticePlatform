<!--课程作业-->
<template>
    <div class="experiment_box">
         <div class="exper_main">
            <courseNav></courseNav>
            <div class="right_box">
                <div class="add_btn_box">
                    <div class="sel-box">               
                         <el-select v-model="cate" placeholder="请选择作业类型" @change="selectCate">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>               
                    </div>
                    <a class="btnDefault pointer mr20">删除题目</a>
                    <a class="btnDefault pointer">新增题目</a>
                </div>
               <!--课程题目-->
               <div class="coursework_box">
                    <div class="in-box"><input placeholder="请输入作业名称" type="text"  autocomplete="off" maxlength="15"/><a class="edit"></a></div>
                    <div class="course_list">
                        <!--选择题-->
                       <ul class="choice_question">
                           <li>                              
                            <div class="title">1.题目文本题目文本题目文本题目文本题目文本题目文本题目文本题目文本题目文本题目文本题目文本题目文本题目文本题目文本题
题目文本题目文本题目文本题目文本题目文本题目文本？ 
                            </div>
                            <div class="pic"></div>   
                            <p class="answer_box">
                               <span class="">选项111</span>
                               <span>选项222</span>
                               <span>选项333</span>
                               <span>选项444</span>
                            </p>                        
                           </li>
                       </ul>
                       <!--简答题-->
                       <ul class="answer_questions">
                           <li>                              
                            <div class="title">2.题目文本题目文本题目文本题目文本题目文本题目文本题目文本题目文本题目文本题目文本题目文本题目文本题目文本题目文本题
题目文本题目文本题目文本题目文本题目文本题目文本？ 
                            </div>
                            <div class="pic"></div>   
                            <p class="answer_box">答案：题目文本题目文本题目文本题目文本题目文本题目文本题目文本题目文本题目文本题目文本题目文本题目文本题目文本题目文本题
题目文本题目文本题目文本题目文本题目文本题目</p>                        
                           </li>
                       </ul>
                    </div>
               </div>
            </div>
         </div>
    </div>
</template>
<script>
import courseNav from "@/components/left_courseNav.vue";
export default {
    data(){
        return{
            options:[
                {value: '1',label: '选择题'},{value: '2',label: '简答题'}
            ],
       
            cate:'选择题',//课件分类默认内置课件

            //作业列表参数根据具体实际情况来定
            coursework:{
               name:'', 
                
            }
        }
    },
    components:{
        courseNav
    },
     created(){
        this.cate = this.options[0].value;//默认选中内置课件
       
    },
    methods:{
      
        //选择分类
        selectCate(val){
            console.log(val)
        },

       
    }
}
</script>
<style lang="less" scoped>
.experiment_box{
    margin-top: 30px;min-height: 600px;
    .exper_main{width:100%;height: 100%; position: relative;;}
    .right_box{ margin-left: 330px;}
}

.page_box{text-align:right;}
.add_btn_box{padding-bottom:15px; text-align:right;}
.mr20{margin-right: 20px;}

.sel-box{float: left; margin-right: 30px;}

.coursework_box{min-height: 500px; border: 1px solid @hnavcolor; padding:10px 0;
   .edit{width:18px;height: 18px; display: inline-block; background: url(../assets/img/icon_edit.png) center no-repeat; vertical-align:middle; cursor: pointer;}
   .in-box{
       text-align: center;
       input{font-size:18px;color:#333; text-align: center; line-height:30px;}
      
   }
}

/*作业列表*/
.course_list{
    padding:0 40px;
    .title{font-size:16px;color:@tabcolor;margin: 8px 0;}
     .pic{width:400px;height:150px;background: @background;.borderRadius(5px,5px,5px,5px); overflow: hidden; margin: 8px 0;}
    .answer_box{margin: 8px 0;}
}

@media screen and (max-width:1440px) {
    .experiment_box{
        .right_box{ margin-left:290px;}
    }
}
</style>