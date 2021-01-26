<template>
    <div class="pp_main boxsizing">
        <div class="container">
            <div class="pageTab">
                <div class="clearfix">
                    <div class="fl">
                       <div class="sel-box">
                          <el-select v-model="className" placeholder="课程名称" 
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
                    </div>
                    <div class="fr">
                       <div class="d-serach"> 
                            <input :placeholder="inplaceholder" type="text" autocomplete="off" />
                            <a class="searchBtn pointer"></a>
                        </div>
                    </div>
                </div>
              
            </div>
        </div>
        <div class="container">
           <div class="tea_list">
              <ul class="tab_box">
                  <li class="li-th">
                      <div class="d1 d28">
                        <div class="cell pname">实验名称</div>
                     </div>
                     <div class="d2 d15">
                        <div class="cell textline1">截止时间</div>
                     </div>
                     <div class="d3 d18">
                        <div class="cell">分数</div>
                     </div>
                     <div class="d4 d14"> 
                        <div class="cell">状态</div>
                     </div>
                     <div class="d4 d11"> 
                        <div class="cell">题目总数</div>
                     </div>
                     <div class="d5 d14">
                         <div class="cell">
                           操作
                         </div>
                     </div>
                  </li>
                  <li class="li-tr" v-for="(item,index) in jobList" :key="index">
                     <div class="d1 d28">
                        <div class="cell pname">{{item.name}}</div>
                     </div>
                     <div class="d2 d15">
                        <div class="cell textline1">{{item.time}}</div>
                     </div>
                     <div class="d3 d18">
                        <div class="cell">{{item.isReview==0?'待老师批阅':'105分'}}</div>
                     </div>
                     <div class="d4 d14"> 
                        <div class="cell">{{item.state==1?'已提交':'待提交'}}</div>
                     </div>
                      <div class="d4 d11"> 
                        <div class="cell">{{item.num}}</div>
                     </div>
                     <div class="d5 d14">
                         <div class="cell">
                            <div class="cell"> 
                            <a class="pointer tab_atn" @click="showDetail(item.state,item.isReview)">查看</a>
                            <!--这两个属性只有在未提交的时候显示-->
                            <span class="space-line" v-if="item.state!=1"></span>
                            <a class="pointer tab_atn" v-if="item.state!=1">提交</a>
                         
                         </div>
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
       
      <el-dialog width='1100px' :visible.sync="isHomework" 
          class="report_detail_dialog homeWork"
          :class="{'dialog_submitted_noreview':curStatus==2 || curStatus==1}"
    >
            <div slot="title" class="dialog_header">xxxxx实验(作业)---共100分</div>
            <div class="reportMain course_list">
                <ul class="choice_question">
                    <li
                        class="li_choose"
                        v-for="(item, index) in all_courseList"
                        :key="index"
                    >
                        <div class="title">{{ item.title }}<span class="colorRed">（本题分数：20分）</span></div>
                        <div class="pic">
                          <span><img  src="../../assets/pic/course.png"/></span>
                        </div>
                        <p class="answer_box" v-if="item.type == 1">
                        <span
                            class="s_radio"
                            :class="{ s_radio_answer: iindex+1 == item.answer }"
                            v-for="(iitem, iindex) in item.chose"
                            :key="iindex"
                            @click="choseanswer(index,iindex)"
                        >
                        {{iitem}} 
                        </span>
                        
                        </p>
                       <div class="answer-in" v-if="item.type == 2 && curStatus==1"><el-input type="textarea" placeholder="请输入答案" :rows="3"  v-model="item.answer"/></div>

                        <p class="answer_box Short-answer p_text" v-if="item.type == 2 && curStatus!=1">作答：{{ item.answer }}</p>

                        <p class="answer_box colorRed p_correct_text" v-if="item.type == 2 && item.correctAnswer!=''">正确答案：{{ item.correctAnswer }}</p>

                        <div class="score_box" v-if="item.type == 2 && item.correctAnswer!=''">
                            本题得分：<span>10</span>
                        </div>
                        <!--选中的状态添加class   li_radio_h-->
                        <span
                        class="li_radio " :class="{'li_radio_correct':1==0,'li_radio_error':1==1}"
                        ></span>
                    </li>
                    </ul>
               
            </div>
            <div class="report_detail_btnbox" v-if="curStatus==1">
                
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
            {name:'XXXXXXXX实验',time:'2020年9月6日',state:0,num:10,isReview:0},
            {name:'XXXXXXXX实验',time:'2020年9月6日',state:1,num:15,isReview:1},
            {name:'XXXXXXXX实验',time:'2020年9月6日',state:0,num:10,isReview:0},
            {name:'XXXXXXXX实验',time:'2020年9月6日',state:0,num:12,isReview:0},
            {name:'XXXXXXXX实验',time:'2020年9月6日',state:1,num:15,isReview:0},

        ],
        classList:[//班级选择列表
            {label:'课程1',value:'1004'},{label:'课程2',value:'1005'}
        ],
        className:'',//选择的课程名称

        stateList:[{label:'全部',value:'0'},{label:'已提交',value:'1'},{label:'未提交',value:'2'}],//作业状态list
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

        inplaceholder:'请输入实验名称',
        
         //全部题目
        all_courseList:[],
        score:6,//得分
     
        isHomework:false,
      
        curStatus:0,//当前的作业状态
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
        showDetail(state,isreview){
           //state:0 未提交 state:1 已提交
           //isreview:0 待老师批阅  1老师已批阅
           let that = this;
           that.isHomework = true
           //老师已批阅
           if(state==1 && isreview==1){
              that.all_courseList = [
                  {id: "1",title: "1.题目文本题目文本题目文本题目文本题目?", type: 1,chose: ["选项111", "选项222", "选项3333", "选项4444"],pic: "",answer: 2},
                   {id: "2",title: "1.题目文本题目文本题目文本题目文本题目?",type: 2,pic: "",answer: "题目文本题目文本题目文本题目文本题目",correctAnswer:'你猜我答题对不对'}
              ]
              that.curStatus=3  //已提交已批阅
           }
           if(state==1 && isreview==0){
              that.curStatus=2 //已提交待批阅
              that.all_courseList = [
                  {id: "1",title: "1.题目文本题目文本题目文本题目文本题目?", type: 1,chose: ["选项111", "选项222", "选项3333", "选项4444"],pic: "",answer: '2',correctAnswer:''},
                  {id: "2",title: "1.题目文本题目文本题目文本题目文本题目?",type: 2,pic: "",answer: "ffffffff",correctAnswer:''}
               ]
           }
           if(state==0){
              that.curStatus=1 //已提交待批阅
               that.all_courseList = [
                  {id: "1",title: "1.题目文本题目文本题目文本题目文本题目?", type: 1,chose: ["选项111", "选项222", "选项3333", "选项4444"],pic: "",answer: '',correctAnswer:''},
                  {id: "2",title: "1.题目文本题目文本题目文本题目文本题目?",type: 2,pic: "",answer: "",correctAnswer:''}
               ]
           }
           //that.isReport_num = num
        },
        //未提交可以选中
        choseanswer(index,iindex){
            console.log('index'+index)
            console.log('iindex'+iindex)
            let that = this
            if(that.curStatus!=1){
                return false
            }else{
                that.$set(that.all_courseList[index],'answer',iindex+1)
            }
        }
    }
}
</script>
<style lang="less" scoped>
@import url(../../assets/less/teacher.less);
@import url(../../assets/less/coursework.less);
@import url(../../assets/less/student.less);
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
   }
/*作业已提交未批阅 */
.dialog_submitted_noreview{
  .course_list{
    .li_choose{
        padding-left: 0px;
        .li_radio{display: none;}
    }
  }  
  .answer-in{padding:10px 0; background:inherit;}
}
</style>