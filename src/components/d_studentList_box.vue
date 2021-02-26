<template>
   <div class="studentList_box">
        <div class="back_box">
           <a class="back pointer" @click="backClass"></a>
           <div class="fr">
              <el-select v-model="class_value" placeholder="请选择班级"  @change="studentSelectClass">
                <el-option
                  v-for="item in classList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
      
           </div>
        </div>
        <div class="tab_box">
            <el-table class="student_tab"
                      :data="studentList"
                      stripe
                      ref="multipleTable"
                      style="width: 100%"
                      :row-key="(row) => row.userId"
                      @selection-change="handleSelectionChange "
                      @select = "handleSelect"
                      >
                    <el-table-column type="selection" width="60" :reserve-selection="true" ></el-table-column>
                    <el-table-column
                    prop="userId"
                    label="学号"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="userName"
                    label="姓名"
                    width="180">
                    </el-table-column>
                    <el-table-column prop="gender" label="性别">

                        <template slot-scope="scope">
                          <span>{{
                            scope.row.gender == 0
                              ? "男"
                              : scope.row.gender == 1
                              ? "女"
                              : "未知"
                          }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="department"
                    label="专业">
                    </el-table-column>
<!--                    <el-table-column-->
<!--                    prop="speciality"-->
<!--                    label="区块链">-->
<!--                    </el-table-column>-->
                    <el-table-column
                    prop="grade"
                    label="年级">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="班级">
                    </el-table-column>
            </el-table>
        </div>
        <div class="tab-pagination">
            <el-pagination
            background
            :current-page="curPage"
            :page-size="perPage"
            @current-change="handleCurrentChange"
            layout="prev, pager, next,jumper"
            :total="studentsList.total"
            >
            </el-pagination>
        </div>
        <div class="btnbox">
           <a class="btnDefault pointer" @click="chooseStudent">确认选择</a>
        </div>
   </div>
</template>
<script>
import {modifyCourseStatus,getStudentsByClasses} from '@/API/api';
export default{

    data(){
        return{
         studentList:[],
            total:1,//总人数
          options: [{
            value: '选项1',
            label: '班级1'
          }, {
            value: '选项2',
            label: '班级2'
          }, {
            value: '选项3',
            label: '班级3'
          }],
          class_value:'',//下拉选中的班级
          multipleSelection: [],
          perPage: 10,//用户列表每页条数
          curPage:1,
          
        }
    },
    props:{
        studentsList:{
            default:[]
        },
        classList:{
            default: []
        },
      
    },

     watch: {

      studentsList: {
        handler: function(newV, oldV) {
          let that = this
          this.studentList = newV.list
         
         this.$nextTick(() => {
              
          for (let i = 0; i < newV.list.length; i++) {
              if(newV.list[i].checked){                      
                this.$refs.multipleTable.toggleRowSelection(
                  that.studentList[i],
                  true
                );
              }

            }   
                 
         })
        
          that.total = newV.list.length
        },
        deep: true
      }
    },
    methods:{
         //底部分页
        handleCurrentChange(val) {
          let that = this;
          that.$emit('handleCurrentChange',val,'')  
        },

        //学生用户班级选中
        studentSelectClass(val){
          let that = this;
          let obj = {};
          for (var i =0;i<that.classList.length;i++){
            if(that.classList[i].id==val){
               obj = that.classList[i]
            }
          }
          that.$emit('handleCurrentChange','',obj)
        },

        handleSelectionChange(val) {
    
          this.multipleSelection  = val;
          //console.log(this.multipleSelection)
        },

        //手动点击的时候选择
        handleSelect(val,row){
          console.log(row)
          let that = this;
          for(let i=0,len=that.classList.length;i<len;i++){
            let tmp = [];
            let temp = that.classList[i].user_id_list;
            if(row.classId == that.classList[i].id){
               if(that.classList[i].user_id_list.indexOf(row.userId)!=-1){
                  let index = that.classList[i].user_id_list.indexOf(row.userId);
                  temp.splice(index,1)
                  
               }else{
                 temp.push(row.userId)
               }
            }
            that.classList[i].user_id_list = temp;
          }
        },

        //选择学生确认
        chooseStudent(){
            
            let that = this;
            let obj = {}
            obj.owner_id = sessionStorage.getItem("userId")
            let user_id_list = [];
           
            
            for(let i = 0;i<that.classList.length;i++){   
               for(let j=0,len=that.classList[i].user_id_list.length;j<len;j++){
                   user_id_list.push(that.classList[i].user_id_list[j]); 
                }
            }

            obj.user_id_list =  user_id_list;
            obj.start = '';
            obj.end = '';
            obj.course_id = this.$route.query.courseId;
            obj.status = '';
            modifyCourseStatus(obj).then(res=> {
            if(res.code==200){
                this.$emit('sureStudent');
            }else{
                that.$toast(res.message,3000)
            }
            })
        },
        //返回班级列表
        backClass(){
           this.$emit('backClass');
        }
    },
    mounted(){


    }
}
</script>
<style scoped lang="less">
.back_box{
  padding:20px 0;
  .back{width:30px;height:30px;background:url(../assets/img/back_classList.png) center no-repeat;
  display:inline-block; vertical-align: middle;}
  .fr{float:right;}
}

.btnbox{text-align:center;}
</style>
