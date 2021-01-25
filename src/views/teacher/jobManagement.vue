<template>
    <div class="pp_main boxsizing">
        <div class="container">
            <div class="pageTab">
                <div class="clearfix">
                    <div class="fl">
                       <div class="sel-box">
                          <el-select v-model="className" placeholder="请选择班级" 
                          @change="changeClass"
                          >
                                <el-option
                                v-for="item in classList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                         
                       </div>
                       <div class="sel-box" >
                          <el-select v-model="state" placeholder="请选择状态" 
                          @change="changeState"
                          >
                                <el-option
                                v-for="item in stateList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                       </div>
                       <div class="sel-box">
                          <el-select v-model="level1Name" placeholder="课程" 
                          @change="changeLevel1"
                          >
                                <el-option
                                v-for="item in level1List"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                       </div>
                        <div class="sel-box" v-if="level2List.length>0">
                          <el-select v-model="level2Name" placeholder="章" 
                          @change="changeLevel2"
                          >
                                <el-option
                                v-for="item in level2List"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                       </div>
                       <div class="sel-box" v-if="level3List.length>0">
                          <el-select v-model="level3Name" placeholder="节" 
                          @change="changeLevel3"
                          >
                                <el-option
                                v-for="item in level3List"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                       </div>
                    </div>
                    <div class="fr">
                       <div class="d-serach"> 
                            <input :placeholder="inplaceholder" type="text" autocomplete="off" />
                            <a class="searchBtn pointer"></a>
                        </div>
                    </div>
                </div>
                <div class="mess">
                    当前选择XXXX班级，共有<span>60</span>名学员，已提交<span>45</span>份，还剩<span>15</span>份未提交
                    
                    <a class="nosubmit" @click="isUnsubmittedlist=true"></a>
                   
                </div>
            </div>
        </div>
        <div class="container">
           <div class="tea_list">
              <ul class="tab_box">
                  <li v-for="(item,index) in jobList" :key="index">
                     <div class="d1 d15">
                        <div class="cell pnum">{{index+1 | catIndex}}</div>
                     </div>
                     <div class="d2 d28">
                        <div class="cell textline1">学号：{{item.sno}} {{item.name}}</div>
                     </div>
                     <div class="d3 d30">
                        <div class="cell">提交时间：{{item.time}}</div>
                     </div>
                     <div class="d4 d14"> 
                        <div class="cell">{{item.state==0?'待批阅':'已批阅'}}</div>
                     </div>
                     <div class="d5 d13">
                         <div class="cell">
                            <a class="btnDefault btn_py pointer" v-if="item.state==0" @click="showDetail(1)">批阅</a>
                            <a class="btnDefault btn_py pointer" v-if="item.state==1" @click="showDetail(2)">查看详情</a>
                         </div>
                     </div>
                  </li>
              </ul>
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
          
        <!--未提交弹出框-->
        <el-dialog :visible.sync="isUnsubmittedlist" width="500px">
        <div slot="title" class="dialog_header">未提交人员（15人）</div>
        <div class="unSubmitList">
            <ul>
                <li v-for="(item,index) in Unsubmittedlist" :key="index">
                    <div class="d-col">
                        <div class="d-sno">
                            <p class="textline1">{{item.sno}}</p>
                        </div>
                        <div class="d-name">
                            <p class="textline1">{{item.name}}</p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
       
        </el-dialog>

        <!--实验报告批阅-->
        <el-dialog width='1100px' :visible.sync="isHomework" class="report_detail_dialog">
            <div slot="title" class="dialog_header">xxxxx实验(作业)---王威龙提交</div>
            <div class="reportMain course_list">
                <ul class="choice_question">
                    <li
                        class="li_choose"
                        v-for="(item, index) in all_courseList"
                        :key="index"
                    >
                        <div class="title">{{ item.title }}<span>（本题分数：20分）</span></div>
                        <div class="pic">
                          <span><img  src="../../assets/pic/course.png"/></span>
                        </div>
                        <p class="answer_box" v-if="item.type == 1">
                        <span
                            class="s_radio"
                            :class="{ s_radio_answer: iindex+1 == item.answer }"
                            v-for="(iitem, iindex) in item.chose"
                            :key="iindex"
                        >
                        {{iitem}} 
                        </span>
                        
                        </p>
                        <p class="answer_box Short-answer p_text" v-if="item.type == 2">作答：{{ item.answer }}</p>
                        <p class="answer_box colorRed p_correct_text" v-if="item.type == 2">正确答案：{{ item.answer }}</p>
                        <div class="score_box">
                            本题分数<div class="din">
                                  <a class="abtn a_reduce pointer"></a>
                                   <input type="text" v-model="score" placeholder="请输入本题分数"/>
                                   <a class="abtn a_increase pointer"></a>
                                   </div>
                        </div>
                        <!--选中的状态添加class   li_radio_h-->
                        <span
                        class="li_radio " :class="{'li_radio_correct':1==0,'li_radio_error':1==1}"
                        ></span>
                    </li>
                    </ul>
               
            </div>
            <div class="report_detail_btnbox" v-if="isReport_num==1">
                
                <a class="pointer btnDefault">确认</a>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
      return{
        userList:'张三，李四，王龙，李明',
        perPage: 10,//用户列表每页条数
        curPage:1, 
        jobList:[
            {sno:'20200112',name:'陈友亮',time:'2020-09-12 16:54',state:'0'},
            {sno:'20200112',name:'陈友亮',time:'2020-09-12 16:54',state:'1'},
            {sno:'20200112',name:'陈友亮',time:'2020-09-12 16:54',state:'0'},
            {sno:'20200112',name:'陈友亮',time:'2020-09-12 16:54',state:'0'},
            {sno:'20200112',name:'陈友亮',time:'2020-09-12 16:54',state:'1'},
            {sno:'20200112',name:'陈友亮',time:'2020-09-12 16:54',state:'0'},
            {sno:'20200112',name:'陈友亮',time:'2020-09-12 16:54',state:'0'},
            {sno:'20200112',name:'陈友亮',time:'2020-09-12 16:54',state:'0'},
            {sno:'20200112',name:'陈友亮',time:'2020-09-12 16:54',state:'0'},
            {sno:'20200112',name:'陈友亮',time:'2020-09-12 16:54',state:'0'}
        ],
        classList:[//班级选择列表
            {label:'班级1',value:'1004'},{label:'班级2',value:'1005'}
        ],
        className:'',//选择的班级名称

        stateList:[{label:'待批阅',value:'0'},{label:'已批阅',value:'1'}],//作业状态list
        state:'',//作业选中状态

        level1List:[
            {label:'区块链的发展史',value:'1'},
            {label:'原理篇',value:'2',
             children:[{label:'数据结构原理',value:'1'},{label:'节点共识模拟',value:'2'},{label:'智能合约部署与调用',value:'3'},
               {label:'区块链密码学',value:'4',
               children:[{label:'哈希算法',value:'1'},{label:'椭圆线密码算法',value:'2'},{label:'对称密钥算法',value:'3'},{label:'keystore',value:'4'}]
               }
             ]
            }
        ],
        level1Name:'',//选中课程名称

        level2List:[],//章节列表
        level2Name:'',//章节名称
        
        level3List:[],//小节列表
        level3Name:'',//小节名称

        inplaceholder:'请输入学号或姓名',
        isUnsubmittedlist:false,//人员未提交名单显示
        Unsubmittedlist:[{sno:'20200112',name:'猜一下'},{sno:'20200112',name:'猜一下'}],
        isHomework:true,
        isReport_num:0,
        //全部题目
        all_courseList:[
            {
            id: "1",
            title: "1.题目文本题目文本题目文本题目文本题目?",
            type: 1,
            chose: ["选项111", "选项222", "选项3333", "选项4444"],
            pic: "",
            answer: 2,
            },
            {
            id: "2",
            title: "1.题目文本题目文本题目文本题目文本题目?",
            type: 2,
            pic: "",
            answer: "题目文本题目文本题目文本题目文本题目",
            }, 
        ],
        score:6,//得分
      }
    },
    filters:{
        catIndex: function (val) {
            let str = ''
            let value = val
            if(value<9){
                str='0'+value
            }else{
                str=value
            }
            return str
        }
    },
    methods:{
        //底部分页
        handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        },
        //选择班级 
        changeClass(val){
          console.log('选择班级')
        },
        //选择状态
        changeState(val){
           console.log('选择状态')
        },
        //选择课程
        changeLevel1(val){
            let that = this
            let tmp = that.level1List
            that.level2List = []
            that.level3List = []
            for(var i=0;i<tmp.length;i++){
                if(val == tmp[i].value){
                    if(tmp[i].children){
                       that.level2List = tmp[i].children || [];
                    }else{
                         that.level2List = []
                    }
                    
                }
            }
            
        },
        //选择章节
        changeLevel2(val){
           let that = this
            let tmp = that.level2List
            that.level3List = []
            for(var i=0;i<tmp.length;i++){
                if(val == tmp[i].value){
                    if(tmp[i].children){
                       that.level3List = tmp[i].children || [];
                    }else{
                         that.level3List = []
                    }
                    
                }
            }
        },
        //选择节
        changeLevel3(val){
            console.log('选择节')
        },
         showDetail(num){
           let that = this;
           that.isHomework = true
           that.isReport_num = num
        }
    }
}
</script>
<style lang="less" scoped>
@import url(../../assets/less/teacher.less);
@import url(../../assets/less/coursework.less);
.reportMain{padding:20px 20px 40px 20px;
    border: 1px solid @border;
    .borderRadius(5px,5px,5px,5px);
    -moz-box-shadow: 0px 5px 18px 0px rgba(0, 0, 0, 0.04); 
    -webkit-box-shadow: 0px 5px 18px 0px rgba(0, 0, 0, 0.04);
    box-shadow: 0px 5px 18px 0px rgba(0, 0, 0, 0.04); 
    .choice_question{margin: 0px;}
    .pic{background: #fff;}
    
}
.report_detail_btnbox{
   
    a{vertical-align: middle; margin-left: 20px;}
}

.course_list
  
   { 
    padding:10px 20px 20px 0;
    .colorRed{color:#D82A2A;}
     .li_choose{
     padding-left: 30px;
     .li_radio{width:18px;height: 18px;}
    .li_radio_correct{background: url(../../assets/img/quest_correct.png) center no-repeat;}
    .li_radio_error{background: url(../../assets/img/quest_error.png) center no-repeat;}
    .s_radio_answer{background: url(../../assets/img/quest_checked.png)left center no-repeat}
    }
    .Short-answer{color: @basecolor;}
 
    .score_box{
        .din{display: inline-block; vertical-align: middle;}
        input{width:80px;text-align: center; height: 30px;line-height: 30px;}
        .abtn{display: inline-block;width:28px;height:28px;line-height:30px; font-size:16px;color:#000;text-align:center; vertical-align: top;
        border:1px solid @border;background: #fff; margin: 0 8px; .borderRadius(5px,5px,5px,5px)}
        .a_increase{background: url(../../assets/img/quest_add.png) center no-repeat; background-size:14px 14px; -webkit-background-size:14px 14px;}
        .a_reduce{background: url(../../assets/img/quest_reduce.png) center no-repeat;background-size:14px 14px; -webkit-background-size:14px 14px;}
    }
}
.report_detail_btnbox{text-align: center; padding-top: 20px;}
</style>