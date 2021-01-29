<template>
    <div class="pp_main boxsizing">

        <div class="container statistics-container">
           <div class="sta-box clearfix">
               <div class="col">
                   <div class="col-info">
                      <img src="../../assets/img/d2.png"/>
                      <div class="data-info">
                         <div class="data-col">
                            <p class="data-1">硬件CPU</p>
                            <p class="data-2">{{cpuUse}}</p>
                         </div>
                      </div>
                   </div>
                   
                </div>
                <div class="col">
                   <div class="col-info">
                      <img src="../../assets/img/d1.png"/>
                      <div class="data-info">
                         <div class="data-col">
                            <p class="data-1">硬件内存</p>
                            <p class="data-2">{{memoryUse}}</p>
                         </div>
                      </div>
                   </div>
                   
                </div>
                <div class="col">
                   <div class="col-info">
                      <img src="../../assets/img/d4.png"/>
                      <div class="data-info">
                         <div class="data-col">
                            <p class="data-1">cpu用户使用率</p>
                            <p class="data-2">{{cpuUtilization}}</p>
                         </div>
                      </div>
                   </div>
                   
                </div>
                <div class="col">
                   <div class="col-info">
                      <img src="../../assets/img/d3.png"/>
                      <div class="data-info">
                         <div class="data-col">
                            <p class="data-1">cpu当前等待率</p>
                            <p class="data-2">{{cpuCurrentWaitingUtilization}}</p>
                         </div>
                      </div>
                   </div>
                   
                </div>
           </div>
        </div>

        <div class="container clearfix sa-container-tab">

            <div class="online-box">
                <div class="online-tab">
                  <h3 class="tabTitle">当前在线人数<span>({{onlineTotal}}人在线)</span></h3>
                  <el-table class="tab-online"
                  :data="tabData"
                  style="width: 100%;">
                  <el-table-column
                      prop="user_id"
                      label="学号/工号/账号"
                      >
                  </el-table-column>
                  <el-table-column
                      prop="name"
                      label="姓名"
                    >
                  </el-table-column>
                  <el-table-column
                      prop="type"
                      label="类型"
                  >
<!--                   <template slot-scope="scope">-->
<!--                    <div :class="{'online-circle':scope.row.state==1}"></div>-->
<!--                  </template>-->
                  </el-table-column>
                  </el-table>
                  <div class="pagination-box">
                     <el-pagination
                      background
                      layout="prev, next"
                      :total="onlineTotal" :current-page.sync="online_page"
                      @current-change="handleOnlineCurrentChange">
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
                          prop="name"
                          label="实验名称"
                          >
                      </el-table-column>
                      <el-table-column
                          prop="duration"
                          label="时长"
                        >
                      </el-table-column>
                     <el-table-column
                          prop="count"
                          label="实验人数"
                        >
                      </el-table-column>
                      </el-table>
                     <div class="pagination-box">
                      <el-pagination
                        background
                        layout="prev, next"
                        :total="totalExper"
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
import {hardware,online,onlineUsers,getRunExperiment} from '@/API/api';
export default {
    data(){
      return{
          tabData: [//在线人数显示12条数据
            {sno: '20200118',name: '王小虎',state: 1},
          
          ],
          onlineTotal:1,
          online_page:1,//在线人数当前页
          onlinePage:1,//在线人数分页
          onlinePageSize:10,//在线人数每页条数
          experimentData:[//运行实验每页8条
            {experName:'节点模拟启停',duration:'45:00',curDuration:'23:45',courname:'节点的概述>节点的模拟启停>尝试启动一个全节点'},
          ],
          totalExper:1,
          ex_Page:1,//实验当前页
          cpuUse:'',
          memoryUse:'',
          cpuUtilization:'',
          cpuCurrentWaitingUtilization:''
      }
    },
    methods:{
        hardware(){
            let that = this;
            hardware().then(res=> {
                if(res.code==200){
                    that.cpuUse = res.data.cpu_use;
                    that.memoryUse = res.data.memory_use;
                    that.cpuUtilization = res.data.cpu_user_utilization;
                    that.cpuCurrentWaitingUtilization = res.data.cpu_user_current_waiting_utilization;
                }else{
                    that.$toast(res.message,3000)
                }
            })
        },

        /*在线人数总计*/
        onlineCount(){
            let that = this;
            online().then(res=> {
                if(res.code==200){
                    let that = this;
                    that.onlineTotal = res.data;
                }else{
                    that.$toast(res.message,3000)
                }
            })
        },

        /*在线人数列表*/
        onlineUsers(){
            let that = this;
            that.searchUserOnline(10,0);
        },
        /*实验人数列表*/
        runExperiment(){
            let that = this;
            that.getRunExperiment(10,0);
        },
        searchUserOnline(per_page,page){
            let that = this;
            let obj = {};
            obj.per_page = per_page;
            obj.page = page;
            onlineUsers(obj).then(res=> {
                if(res.code==200){
                    that.tabData = res.data.content;
                    for(let i = 0 ;i<res.data.content.length;i++){
                        if(res.data.content[i].type == 0){
                            res.data.content[i].type = "管理员"
                        }else if(res.data.content[i].type == 1){
                            res.data.content[i].type = "教师"
                        }else if(res.data.content[i].type == 2){
                            res.data.content[i].type = "学生"
                        }
                    }
                    that.onlinePage = res.data.totalPages;
                }else{
                    that.$toast(res.message,3000)
                }
            })
        },
        getRunExperiment(per_page,page){
            let that = this;
            let obj = {};
            obj.perPage = per_page;
            obj.page = page;
            getRunExperiment(obj).then(res=> {
                if(res.code==200){
                    that.totalExper = res.data.total;
                    that.experimentData = res.data.list;
                }else{
                    that.$toast(res.message,3000)
                }
            })
        },
      handleCurrentChange(val){
        let that = this;

        console.log(`当前页 ${val} 条`);
      },
        handleOnlineCurrentChange(val){
            let that = this;
            that.searchUserOnline(10,val-1);
            console.log(`当前页 ${val} 条`);
        },
    },
    mounted() {
        let that = this;
        that.hardware();
        that.onlineCount();
        that.onlineUsers();
        that.runExperiment();
    },
}
</script>

<style lang="less" scoped>
@import url(../../assets/less/admin.less);
</style>