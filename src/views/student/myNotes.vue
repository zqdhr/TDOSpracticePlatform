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
                      
                    </div>
                    <div class="fr">
                         <a class="btnDefault pointer abtn" >删除</a>  
                          <a class="btnDefault pointer abtn">导出</a>  
                       <div class="d-serach"> 
                            <input :placeholder="inplaceholder" type="text" autocomplete="off" />
                            <a class="searchBtn pointer"></a>
                        </div>
                    </div>
                </div>
              
            </div>
        </div>
        <div class="container">
           <div class="notes_list">
              <ul class="ul-notes">
                 <li v-for="(item,index) in notesList" :key="index">
                    <div class="name-box">
                        <div class="d-name textline1">{{item.name}}</div>
                        <div class="d-time">{{item.time}}</div>
                    </div>
                    <p class="intro">{{item.text}}</p> 
                    <div class="link-courseware">
                        <a class="pointer" v-if="item.courseType==1">--&lt;{{item.coursewarename}}&gt;--&lt;第{{item.coursepage}}页&gt;</a>
                        <a class="pointer" v-if="item.courseType==2">--&lt;{{item.coursewarename}}&gt;--&lt;观看时间：{{item.coursepage}}&gt;</a>
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
       

      
    </div>
</template>
<script>

export default {
    data(){
      return{
        userList:'张三，李四，王龙，李明',
        perPage: 10,//用户列表每页条数
        curPage:1, 

        classList:[//班级选择列表
            {label:'课程1',value:'1004'},{label:'课程2',value:'1005'}
        ],
        className:'',//选择的课程名称

     

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

        inplaceholder:'请输入笔记标题',

        notesList:[
            {id:'2055ddd',name:'<笔记标题笔记标题笔记标题>',time:'2020-09-15 16:32:45',
             text:'过程记录的比较会统一汇聚在课程的我的笔记栏目中，在这里可以通过章节进行过滤查询所记录的笔记。'+
            '在课程学习过程记录的比较会统一汇聚在课程的汇聚在课程的汇聚汇聚在课 我的笔记栏目中，在这里可以通过章节进行过滤查询所记录的笔记。'+
            '在课程学习过程记录的比较会统一汇聚在课程的我的笔记栏目中，在这里可以通过章汇聚在课程的汇聚在课程的 节进行过滤查询所记录的笔记。',
            courseType:1,
            coursewarename:'XXXXXXXXXXXX课件.pdf',
            coursepage:'6'
            },
             {id:'2055ddd',name:'<笔记标题笔记标题笔记标题>',time:'2020-09-15 16:32:45',
             text:'过程记录的比较会统一汇聚在课程的我的笔记栏目中，在这里可以通过章节进行过滤查询所记录的笔记。'+
            '在课程学习过程记录的比较会统一汇聚在课程的汇聚在课程的汇聚汇聚在课 我的笔记栏目中，在这里可以通过章节进行过滤查询所记录的笔记。'+
            '在课程学习过程记录的比较会统一汇聚在课程的我的笔记栏目中，在这里可以通过章汇聚在课程的汇聚在课程的 节进行过滤查询所记录的笔记。',
            courseType:2,
            coursewarename:'XXXXXXXXXXXX.mp3',
            coursepage:'20.00'
            }
        ]
      
     
      
      }
    },
    components:{},
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
       
    }
}
</script>
<style lang="less" scoped>
@import url(../../assets/less/teacher.less);
@import url(../../assets/less/student.less);

</style>