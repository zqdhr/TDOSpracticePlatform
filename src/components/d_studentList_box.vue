<template>
   <div class="studentList_box">
        <div class="back_box">
           <a class="back pointer" @click="backClass"></a>
           <div class="fr">
              <el-select v-model="class_value" placeholder="请选择班级">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
           </div>
        </div>
        <div class="tab_box">
            <el-table class="student_tab"
                :data="studentList"
                stripe
                ref="multipleTable"
                style="width: 100%">
                    <el-table-column type="selection" width="60" ></el-table-column>
                    <el-table-column
                    prop="sno"
                    label="学号"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="姓名"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="sex"
                    label="性别">
                    </el-table-column>
                    <el-table-column
                    prop="department"
                    label="专业">
                    </el-table-column>
                    <el-table-column
                    prop="speciality"
                    label="区块链">
                    </el-table-column>
                    <el-table-column
                    prop="grade"
                    label="年级">
                    </el-table-column>
                    <el-table-column
                    prop="class_name"
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
            :total="150"
            >
            </el-pagination>
        </div>
        <div class="btnbox">
           <a class="btnDefault pointer" @click="chooseStudent">确认选择</a>
        </div>
   </div>
</template>
<script>
export default{
    data(){
        return{
          studentList:[
            {sno:'200100101',name:'王威龙',sex:'男',department:'互联网技术',speciality:'区块链',grade:'大一',class_id:'20100101',class_name:'三班'},
            {sno:'200100101',name:'王威龙',sex:'男',department:'互联网技术',speciality:'区块链',grade:'大一',class_id:'20100101',class_name:'三班'},
            {sno:'200100101',name:'王威龙',sex:'男',department:'互联网技术',speciality:'区块链',grade:'大一',class_id:'20100101',class_name:'三班'},
            {sno:'200100101',name:'王威龙',sex:'男',department:'互联网技术',speciality:'区块链',grade:'大一',class_id:'20100101',class_name:'三班'},
            {sno:'200100101',name:'王威龙',sex:'男',department:'互联网技术',speciality:'区块链',grade:'大一',class_id:'20100101',class_name:'三班'},
            {sno:'200100101',name:'王威龙',sex:'男',department:'互联网技术',speciality:'区块链',grade:'大一',class_id:'20100101',class_name:'三班'},
            {sno:'200100101',name:'王威龙',sex:'男',department:'互联网技术',speciality:'区块链',grade:'大一',class_id:'20100101',class_name:'三班'},
            {sno:'200100101',name:'王威龙',sex:'男',department:'互联网技术',speciality:'区块链',grade:'大一',class_id:'20100101',class_name:'三班'},
            {sno:'200100101',name:'王威龙',sex:'男',department:'互联网技术',speciality:'区块链',grade:'大一',class_id:'20100101',class_name:'三班'},
            {sno:'200100101',name:'王威龙',sex:'男',department:'互联网技术',speciality:'区块链',grade:'大一',class_id:'20100101',class_name:'三班'}
          ],
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
    methods:{
         //底部分页
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
        },
        //选择学生确认
        chooseStudent(){
            this.$emit('sureStudent');   
        },
        //返回班级列表
        backClass(){
           this.$emit('backClass');
        }
    },
    mounted(){
        //默认全选
          this.$nextTick(() => {
            for (let i = 0; i < this.studentList.length; i++) {
              this.$refs.multipleTable.toggleRowSelection(
                this.studentList[i],
                true
              );
            }
          });

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