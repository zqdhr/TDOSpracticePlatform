<template>
     <div class="pp_main boxsizing">
        <div class="container course_container">
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
              
            </div>

            <div class="tablex_box list_box">
                <div class="l_box">
                <ul class="default_List">
                    <li v-for="(item,index) in machineList" :key="index">
                        <div class="info-box">
                        
                            <div class="d-icon"></div>
                            <p class="p_id textline1">学号：{{item.sno}}</p>
                            <p class="p_id p_name textline1">用户名称：{{item.username}}</p>
                            <div class="btnbox">
                                <div class="course_mana_btnbox">
                                    <a class="pointer btn btn-see"><span>查看</span></a>
                                    <a class="pointer btn btn-end"><span>结束</span></a>
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
                    :total="150"
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
           classList:[//班级选择列表
              {label:'班级1',value:'1004'},{label:'班级2',value:'1005'}
           ],
           className:'',//选择的班级名称
           inplaceholder:'请输入用户名称和学号',
            machineList:[
                {sno:'20200115',username:'张三'},{sno:'20200115',username:'张三'},
                {sno:'20200115',username:'张三'},{sno:'20200115',username:'张三'},
                {sno:'20200115',username:'张三'},{sno:'20200115',username:'张三'},
                {sno:'20200115',username:'张三'},{sno:'20200115',username:'张三'},
                {sno:'20200115',username:'张三'},{sno:'20200115',username:'张三'},
                {sno:'20200115',username:'张三'},{sno:'20200115',username:'张三'},
                {sno:'20200115',username:'张三'},{sno:'20200115',username:'张三'},
                {sno:'20200115',username:'张三'},{sno:'20200115',username:'张三'},
                {sno:'20200115',username:'张三'},{sno:'20200115',username:'张三'},
                
            ],
            perPage:24, //虚拟机每页
            curPage:1//设备列表
        }
    },
    methods:{
        //选择班级 
        changeClass(val){
          console.log('选择班级')
        },
        //底部分页
        handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        },
    }
}
</script>
<style lang="less" scoped>
@import url(../../assets/less/teacher.less);
</style>