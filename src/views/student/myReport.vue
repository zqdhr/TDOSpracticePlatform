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
                     <div class="d5 d25">
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
                        <div class="cell">{{item.isreview==1?item.score:'待老师批阅'}}</div>
                     </div>
                     <div class="d4 d14"> 
                        <div class="cell">{{item.state==1?'已提交':'待提交'}}</div>
                     </div>
                     <div class="d5 d25">
                         <div class="cell"> 
                            <a class="pointer tab_atn" @click="showDetail(2)">查看</a>
                            <span class="space-line"></span>
                            <a class="pointer tab_atn" v-if="item.state!=1">提交</a>
                            <span class="space-line" v-if="item.state!=1"></span>
                            <a class="pointer tab_atn">导出</a>
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
                   <div class="din"><el-input placeholder="请输入分数" style="text-align:center"/></div>
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
            {name:'XXXXXXXX实验',time:'2020年9月6日',state:0,score:0,isreview:0}, 
            {name:'XXXXXXXX实验',time:'2020年9月6日',state:1,score:70,isreview:1},
            {name:'XXXXXXXX实验',time:'2020年9月6日',state:0,score:0,isreview:0},
            {name:'XXXXXXXX实验',time:'2020年9月6日',state:1,score:85,isreview:1},
            {name:'XXXXXXXX实验',time:'2020年9月6日',state:0,score:0,isreview:0},

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
      
     
        isReport:false,
        isReport_num:0
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
           that.isReport = true
           that.isReport_num = num
        }
    }
}
</script>
<style lang="less" scoped>
@import url(../../assets/less/teacher.less);
@import url(../../assets/less/student.less);
</style>