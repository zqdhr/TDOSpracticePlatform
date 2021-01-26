<template>
    <div class="pp_main boxsizing">
        <div class="container">
            <div class="pageTab">
                <div class="clearfix">
                    <div class="fl">
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
                          <el-select v-model="className" value-key="id" placeholder="请选择班级" 
                          @change="changeClass"
                          >
                                <el-option
                                 v-for="item in classList"
                                :key="item.id"
                                :label="item.name"
                                :value="item">
                                </el-option>
                            </el-select>
                         
                       </div>
                  
                       <div class="sel-box">
                          <el-select v-model="level1Name" placeholder="课程" 
                          @change="changeLevel1"
                          >
                                <el-option
                                v-for="item in course"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                       </div>
                        <div class="sel-box" v-if="level2List.length>0">
                          <el-select v-model="level2Name" placeholder="章" 
                          @change="changeLevel2"
                          >
                                <el-option
                                v-for="item in level2List"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                       </div>
                       <div class="sel-box" v-if="level3List.length>0">
                          <el-select v-model="level3Name" placeholder="节" 
                          @change="changeLevel3"
                          >
                                <el-option
                                v-for="item in level3List"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                       </div>
                    </div>
                    <div class="fr">
                       <div class="d-serach"> 
                            <input :placeholder="inplaceholder"  v-model="searchTx" type="text" autocomplete="off" />
                            <a class="searchBtn pointer" @click="doSearch"></a>
                        </div>
                    </div>
                </div>
                <div class="mess">
                    当前选择{{chooseClassName}}，共有<span>60</span>名学员，已提交<span>45</span>份，还剩<span>15</span>份未提交
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
                        :total="60"
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
        <el-dialog width='1100px' :visible.sync="isReport" class="report_detail_dialog">
            <div slot="title" class="dialog_header">xxxxx实验---王威龙提交</div>
            <div class="reportMain">
                <div class="ptext">
                    <p>报告文本报告文本报告文本报告文本报告文本报告文本报告文本报告文本报告文本报告文本报告文本报告文本报告文 
                        报告文本报告文本报告文本报告文本报告文本报告文本报告文本
                        报告文本报告文本报告文本报告文本报告文本报告文 报告文本报告文本报告文本报告文本报告文本报告文本。</p>
                </div>
                <div class="pic">
                    <img src=""/>
                </div>
               
            </div>
            <div class="report_detail_btnbox" v-if="isReport_num==1">
                   <div class="din"><el-input placeholder="请输入分数" v-model="source" style="text-align:center"/></div>
                   <a class="pointer btnDefault" @click="Scoring">确认</a>
                </div>
        </el-dialog>
    </div>
</template>
<script>
import {searchClass,getAdminCourseByClassId} from "@/API/api";
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
            
        ],
        className:'',//选择的班级名称
        classId:'',//选择的班级id
        chooseClassName:'',

        stateList:[{label:'全部',value:''},{label:'待批阅',value:'0'},{label:'已批阅',value:'1'}],//作业状态list
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
        course:[],//课程列表

        level1Name:'',//选中课程名称

        level2List:[],//章节列表
        level2Name:'',//章节名称
        
        level3List:[],//小节列表
        level3Name:'',//小节名称

        inplaceholder:'请输入学号或姓名',
        isUnsubmittedlist:false,//人员未提交名单显示
        Unsubmittedlist:[{sno:'20200112',name:'猜一下'},{sno:'20200112',name:'猜一下'}],
        isReport:false,
        isReport_num:0,
        source:'',//实验报告分数
        searchTx:''//搜索关键字
      }
    },
    filters:{
        catIndex: function (val) {
            let str = ''
            let value = val
            if(value<10){
                str='0'+value
            }else{
                str=value
            }
            return str
        }
    },
    created(){
        this.getClassList()
        
    },
    methods:{
        //底部分页
        handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        },
        //选择班级 
        changeClass(val){
            let that = this;
            that.classId = val.id
            that.chooseClassName = val.name
            that.level1Name=''
            that.level2List = []
            that.level2Name=''
            that.level3List = []
            that.level3Name=''
            that.getAdminCourseByClassId()
            
             console.log(val);  
             console.log('选择班级'+that.className+that.classId)
        },
        //选择状态
        changeState(val){
           console.log('选择状态')
        },
        //选择课程
        changeLevel1(val){
            let that = this
            let tmp = that.course
            that.level2List = []
            that.level3List = []
            for(var i=0;i<tmp.length;i++){
                if(val == tmp[i].id){
                    if(tmp[i].chapters){
                       that.level2List = tmp[i].chapters || [];
                    }else{
                         that.level2List = []
                    }
                    
                }
            }
             console.log('选择课程'+val)
        },
        //选择章节
        changeLevel2(val){
           let that = this
            let tmp = that.level2List
            that.level3List = []
            for(var i=0;i<tmp.length;i++){
                if(val == tmp[i].id){
                    if(tmp[i].sections){
                       that.level3List = tmp[i].sections || [];
                    }else{
                         that.level3List = []
                    }
                    
                }
            }
             console.log('选择章'+val)
        },
        //选择节
        changeLevel3(val){
            console.log('选择节'+val)
        },
        showDetail(num){
           let that = this;
           that.isReport = true
           that.isReport_num = num
        },
        //获取班级列表
        getClassList(){
            let that = this;
            searchClass().then(res=> {
                if(res.code==200){
                    that.classList = res.data
                    if(that.classList.length>0){
                        that.className = that.classList[0]
                        that.chooseClassName = that.classList[0].name
                        that.classId = that.classList[0].id
                        that.getAdminCourseByClassId()
                    }
              
                }else{
                    that.$toast(res.message,3000)
                }
            })
        },
        //获取班级下的课程列表
        getAdminCourseByClassId(){
            let that = this;
            let obj={};
            obj.class_id = that.classId;
            obj.page=1;
            obj.perPage=100;
             getAdminCourseByClassId(obj).then(res=> {
                if(res.code==200){
                    that.course = res.data.list
                    
                }else{
                    that.$toast(res.message,3000)
                }
            })   
        
        },
        //搜索
        doSearch(){
            let that = this;
            if (that.searchTx=='') {
                 return  that.$toast(that.inplaceholder,2000)
            }
        },
        //打分
        Scoring(){
            let that = this;
            if (that.source=='') {
                 return  that.$toast('请输入分数',2000)
            }
            if (that.source>100) {
                  return  that.$toast('分数最高为100',2000)
            }
            that.isReport = false
            that.source=''
        }

    }
}
</script>
<style lang="less" scoped>
@import url(../../assets/less/teacher.less);
.reportMain{padding:20px 20px 40px 20px;
    border: 1px solid @border;
    .borderRadius(5px,5px,5px,5px);
    -moz-box-shadow: 0px 5px 18px 0px rgba(0, 0, 0, 0.04); 
    -webkit-box-shadow: 0px 5px 18px 0px rgba(0, 0, 0, 0.04);
    box-shadow: 0px 5px 18px 0px rgba(0, 0, 0, 0.04); 
    .ptext{font-size:18px; color:#333;}
    .pic{width:100%; margin-top: 20px;}
    .pic img{width:100%}
    
}.report_detail_btnbox{
    text-align: center;padding-top:20px;
    .din{width: 150px;display: inline-block; vertical-align:middle; text-align: center;}
    input{text-align: center;}
    a{vertical-align: middle; margin-left: 20px;}
}
</style>