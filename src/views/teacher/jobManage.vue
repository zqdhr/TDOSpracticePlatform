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
                    <el-tooltip class="item" effect="light" :content="userList" placement="right-start">
                       <a class="nosubmit"></a>
                    </el-tooltip>
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
                            <a class="btnDefault btn_py pointer" v-if="item.state==0">批阅</a>
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
            {sno:'20200112',name:'陈友亮',time:'2020-09-12 16:54',state:'0'},
            {sno:'20200112',name:'陈友亮',time:'2020-09-12 16:54',state:'0'},
            {sno:'20200112',name:'陈友亮',time:'2020-09-12 16:54',state:'0'},
            {sno:'20200112',name:'陈友亮',time:'2020-09-12 16:54',state:'0'},
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
        inplaceholder:'请输入学号或姓名'
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
        }
    }
}
</script>
<style lang="less" scoped>
@import url(../../assets/less/teacher.less);
</style>