<template>
    <div class="main boxsizing">

        <div class="container statistics-container">
           <div class="sta-box clearfix">
               <div class="col">
                   <div class="col-info">
                      <img src="../../assets/img/d2.png"/>
                      <div class="data-info">
                         <div class="data-col">
                            <p class="data-1">xxxx负载情况</p>
                            <p class="data-2">50%</p>
                         </div>
                      </div>
                   </div>
                   
                </div>
                <div class="col">
                   <div class="col-info">
                      <img src="../../assets/img/d1.png"/>
                      <div class="data-info">
                         <div class="data-col">
                            <p class="data-1">xxxx负载情况</p>
                            <p class="data-2">50%</p>
                         </div>
                      </div>
                   </div>
                   
                </div>
                <div class="col">
                   <div class="col-info">
                      <img src="../../assets/img/d4.png"/>
                      <div class="data-info">
                         <div class="data-col">
                            <p class="data-1">xxxx负载情况</p>
                            <p class="data-2">50%</p>
                         </div>
                      </div>
                   </div>
                   
                </div>
                <div class="col">
                   <div class="col-info">
                      <img src="../../assets/img/d3.png"/>
                      <div class="data-info">
                         <div class="data-col">
                            <p class="data-1">硬件使用率</p>
                            <p class="data-2">50%</p>
                         </div>
                      </div>
                   </div>
                   
                </div>
           </div>
        </div>

        <div class="container clearfix sa-container-tab">

            <div class="online-box">
                <div class="online-tab">
                  <h3 class="tabTitle">当前在线人数<span>(190人在线)</span></h3>
                  <el-table class="tab-online"
                  :data="tabData"
                  style="width: 100%;">
                  <el-table-column
                      prop="sno"
                      label="学号"
                      >
                  </el-table-column>
                  <el-table-column
                      prop="name"
                      label="姓名"
                    >
                  </el-table-column>
                  <el-table-column
                      prop="state"
                      label="状态"
                  >
                   <template slot-scope="scope">
                    <div :class="{'online-circle':scope.row.state==1}"></div>
                  </template>
                  </el-table-column>
                  </el-table>
                  <div class="pagination-box">
                     <el-pagination
                      background
                      layout="prev, next"
                      :total="100" :current-page.sync="online_page">
                    </el-pagination>
                  </div>
                </div>
            </div>

            <div class="experiment-box">
                <div class="exper-tab">
                    <h3 class="tabTitle">正在进行的实验<span></span></h3>
                     <el-table class="tab-online tab-experiment"
                      :data="experimentData"
                      style="width: 100%;">
                      <el-table-column
                          prop="experName"
                          label="实验名称"
                          >
                      </el-table-column>
                      <el-table-column
                          prop="duration"
                          label="时长"
                        >
                      </el-table-column>
                     <el-table-column
                          prop="curDuration"
                          label="现在时长"
                        >
                      </el-table-column>
                      
                      <el-table-column
                          prop="courname"
                          label="所属课程"
                          width='320'
                      >
                          <template slot-scope="scope">
                             <div class="textline1">{{scope.row.courname}}</div>
                          </template>
                      </el-table-column>
                      </el-table>
                     <div class="pagination-box">
                      <el-pagination
                        background
                        layout="prev, next"
                        :total="100"
                        :current-page.sync="ex_Page"
                        @current-change="handleCurrentChange">
                      </el-pagination>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    data(){
      return{
          tabData: [//在线人数显示12条数据
            {sno: '20200118',name: '王小虎',state: 1}, 
            {sno: '20200118',name: '王小虎',state: 1}, 
            {sno: '20200118',name: '王小虎',state: 1}, 
            {sno: '20200118',name: '王小虎',state: 1},
            {sno: '20200118',name: '王小虎',state: 1},
            {sno: '20200118',name: '王小虎',state: 1},
            {sno: '20200118',name: '王小虎',state: 1},
            {sno: '20200118',name: '王小虎',state: 1},
          
          ],
          online_page:1,//在线人数当前页
          experimentData:[//运行实验每页8条
            {experName:'节点模拟启停',duration:'45:00',curDuration:'23:45',courname:'节点的概述>节点的模拟启停>尝试启动一个全节点'},
            {experName:'节点模拟启停',duration:'45:00',curDuration:'23:45',courname:'节点的概述>节点的模拟启停>尝试启动一个全节点'},
            {experName:'节点模拟启停',duration:'45:00',curDuration:'23:45',courname:'节点的概述>节点的模拟启停>尝试启动一个全节点'},
            {experName:'节点模拟启停',duration:'45:00',curDuration:'23:45',courname:'节点的概述>节点的模拟启停>尝试启动一个全节点'},
            {experName:'节点模拟启停',duration:'45:00',curDuration:'23:45',courname:'节点的概述>节点的模拟启停>尝试启动一个全节点'},
            {experName:'节点模拟启停',duration:'45:00',curDuration:'23:45',courname:'节点的概述>节点的模拟启停>尝试启动一个全节点'},
            {experName:'节点模拟启停',duration:'45:00',curDuration:'23:45',courname:'节点的概述>节点的模拟启停>尝试启动一个全节点'},
            {experName:'节点模拟启停',duration:'45:00',curDuration:'23:45',courname:'节点的概述>节点的模拟启停>尝试启动一个全节点'},
          ],
          ex_Page:1//实验当前页
      }
    },
    methods:{
      handleCurrentChange(val){
        let that = this;
        console.log(`当前页 ${val} 条`);
      }
    }
}
</script>

<style lang="less" scoped>
@import url(../../assets/less/admin.less);
</style>