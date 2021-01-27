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
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
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
                            <p class="p_id p_name textline1">实验名称：{{item.experName}}</p>
                            <div class="btnbox">
                                <div class="course_mana_btnbox">
                                    <a class="pointer btn btn-see"><span>查看</span></a>
                                    <a class="pointer btn btn-end" @click="closeStudent(item.sno,item.username)"><span>结束</span></a>
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
            <!--结束当前学生的实验-->
            <el-dialog :visible.sync="isClose" width="600px">
            <div slot="title" class="dialog_header">请注意!</div>
            <div class="confirm_dialog_body">
                <p class="dialog_mess">
                <!--成功span的class为icon_success-->
                <span class="span_icon icon_waring">是否结束学生{{student.name}}当前实验？</span>
                </p>
            </div>
            <div slot="footer" class="dialog-footer">
                <a class="btnDefault" @click="commitClose">确 认</a>
                <a class="btnDefault" @click="isClose=false">取 消</a>
            </div>
            </el-dialog>
        </div>
      
    </div>
</template>
<script>
import {searchClass} from "@/API/api";
export default {
    data(){
        return{
           classList:[//班级选择列表
              {label:'班级1',value:'1004'},{label:'班级2',value:'1005'}
           ],
           className:'',//选择的班级名称
           inplaceholder:'请输入用户名称和学号',
            machineList:[
                {sno:'20200115',username:'张三',experName:'xxx实验'},{sno:'20200115',username:'张三',experName:'xxx实验'},
                {sno:'20200115',username:'李四',experName:'xxx实验'},{sno:'20200115',username:'张三',experName:'xxx实验'},
                {sno:'20200115',username:'赵武',experName:'xxx实验'},{sno:'20200115',username:'张三',experName:'xxx实验'},
                {sno:'20200115',username:'爱谁谁',experName:'xxx实验'},{sno:'20200115',username:'张三',experName:'xxx实验'},
                {sno:'20200115',username:'张三',experName:'xxx实验'},{sno:'20200115',username:'张三',experName:'xxx实验'},
                {sno:'20200115',username:'张三',experName:'xxx实验'},{sno:'20200115',username:'张三',experName:'xxx实验'},
                {sno:'20200115',username:'张三',experName:'xxx实验'},{sno:'20200115',username:'张三',experName:'xxx实验'},
                {sno:'20200115',username:'张三',experName:'xxx实验'},{sno:'20200115',username:'张三',experName:'xxx实验'},
                {sno:'20200115',username:'张三',experName:'xxx实验'},{sno:'20200115',username:'张三',experName:'xxx实验'},
                
            ],
            perPage:24, //虚拟机每页
            curPage:1,//设备列表
            isClose:false,
            student:{//点击关闭学生实验需要的参数
                userid:'',
                name:''
            }
        }
    },
    created(){
        this.getClassList()
    },
    methods:{
        //选择班级 
        changeClass(val){
            let that = this
            this.className = val
            console.log('选择班级'+val)
        },
        //底部分页
        handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        },
        //关闭学生实验
        closeStudent(studentId,studentName){
            let that=this
            that.student.userid = studentId
            that.student.name = studentName
            that.isClose=true
            console.log('当前学生：'+that.student.name+',学号：'+that.student.userid)
        },
        //提交关闭请求
        commitClose(){
            let that = this
            let obj={}
            obj.userid = that.student.userid
            that.isClose=false
        },
      
        //获取班级列表
        getClassList(){
            let that = this;
            searchClass().then(res=> {
                if(res.code==200){
                    that.classList = res.data
                    if(that.classList.length>0){
                        that.className = that.classList[0].id
                    }
              
                }else{
                    that.$toast(res.message,3000)
                }
            })
        },
    }
}
</script>
<style lang="less" scoped>
@import url(../../assets/less/teacher.less);
</style>