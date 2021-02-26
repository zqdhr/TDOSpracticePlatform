<template>
   <div>
   <template v-if="!isStudent">
   <div class="classList_box">
        <div class="classList_div">
            <div class="classList_intro">
                <span class="s1">为未选择班级</span><span class="s2">为已选择班级</span><span class="s3">为已编辑班级</span>
            </div>
            <ul class="classList_ul clearfix">
                <li v-for="(item,index) in classList" :key="index">
                    <div class="class_info"
                        :class="{'class_info_all':item.checked==1,'class_info_part':item.checked==2}"
                    >
                        <span class="s-radion"
                            :class="{'checked_all':item.checked==1,'checked_part':item.checked==2}"
                            @click="checkClass(item,index,item.checked)">
                        </span>
                        <p class="p_name">{{item.name}}</p>
                        <div class="line"></div>
                        <p class="p_number">(共有{{item.count}}名学员)</p>
                    </div>
                </li>
            </ul>
        </div>
        <!--已开课班级列表不可编辑-->
        <div class="btnbox">
            <a class="btnDefault pointer" @click="sureCheckClass" v-if="status ==0" >查看</a>
        </div>
   </div>
   </template>

    <!--学生列表 -->
    <studentList @sureStudent="sureStudent" @backClass="backClass" v-if="isStudent"  @handleCurrentChange="handleCurrentChange(arguments)"    
       :studentsList="list" 
       :classList = this.checkedList   
    >
    </studentList>

   </div>
</template>
<script>
import {getStudentsByClasses,getStudentsByClasseId} from '@/API/api';
import studentList from "@/components/d_studentList_box.vue";//学生信息-学生列表
export default{
    data(){
        return{
            //classList:[],//班级列表
            checkedList:[],//选中的班级列表
            isStudent:false,
            list:{},
            chooseList:[],
            checkList:[],
            per_page:10,
            page:1,
        }
    },
    components:{studentList},
    mounted(){
        let that = this;
       

    },
    props: {
        classesList: {
            default: 0,
        },

        classList:{
            default:[]
        },

      status: {
        default: 0,
      },

    },
    watch: {
        classesList: {
            handler:function(val, olVal) {
                this.classesList = val           
            }
        },
        classList:{
            handler:function(val, olVal) {
              
           }
        }
    },
    methods:{

        //班级列表添加选中的状态
        addParamcheck(array){
         let that = this;
          for(var i=0;i<array.length;i++){
              that.$set(array[i], 'checked', 0)
           }
        },

       //班级选择
        checkClass(obj,num,checked){
          let that = this;
          that.$emit('checkClass',obj,num,checked)
        },
         //学生选择确认
        sureStudent(){
          let that = this;
          this.isStudent = false;
          that.$emit('getCourseById')
        

        },
        //学生列表返回班级列表
        backClass(){
          this.isStudent = false;

        },
        
        //子组件调用父组件
        handleCurrentChange(params){
        
           let that = this;
           let class_id = [];
           if(params[0]!=''){
              that.page = params[0];
           }
           if(params[1]!=''){
              class_id.push(params[1])         
              that.searchClassStudents(class_id)
           }else{
               
           that.searchClassStudents(that.checkedList)
           }
        },

        

        //班级学生信息
        searchClassStudents(list){
     
            //param list当前选中的班级
      
            let that = this;
            let obj = {}
            let classIds = [];
            obj.per_page = that.per_page
            obj.page = that.page

            for(let i=0;i<list.length;i++){
                classIds.push(list[i].id);          
            }
          
//console.log(list)
            obj.classIds = classIds //表示选中的班级
           
            getStudentsByClasses(obj).then(res=> {
                if(res.code==200){
    
                    //that.checkedList:班级选中的学生列表，如果用户列表为空代表该班级学生全部选中
                    //res.data.list:学生列表
                    
                    for (let i=0; i<that.checkedList.length; i++) {
                        if (that.checkedList[i].user_id_list.length == 0) {//该班级学生全部选中
                            for (let j=0; j<res.data.list.length; j++) {
                                if (res.data.list[j].classId == that.checkedList[i].id) {
                                    that.checkedList[i].user_id_list.push(res.data.list[j].userId)
                                    res.data.list[j].checked = true 
                                }
                            }
                        } else {//遍历学生数组，如果学生id在班级选中的学生数组中，那么该学生状态设置为选中
                            for (let j=0; j<res.data.list.length; j++) {
                                if (that.checkedList[i].user_id_list.indexOf(res.data.list[j].userId) != -1) {
                                    res.data.list[j].checked = true 
                                }
                            }
                        }
                    }

                    that.list = res.data;

                
                }else{
                    that.$toast(res.message,3000)
                }
            })

        },

        //班级选择确认
        sureCheckClass(){
            let that = this;        
            let temp = []
            for(let j = 0,  len = that.classList.length; j < len; j++){
                if(that.classList[j].checked==1 || that.classList[j].checked==2 ){
                   temp.push(that.classList[j]);  
                }
               

            }
            if(temp==0){
                return that.$toast('请先选择班级',2000)
            }
            //console.log(that.checkedList)
            //console.log('that.checkedList')
            that.checkedList = temp
            that.page = 1;
            that.searchClassStudents(that.checkedList)
            that.isStudent = true;
        },
    }
}
</script>
<style scoped lang="less">

/*学生信息-班级列表*/
.classList_box{margin-top: 30px;
    .classList_div{background: @background; min-height:280px; }
    .classList_intro{padding:20px 0; font-size: 18px; color: @fontColor1;text-align: center;
    span{display: inline-block; margin:0 15px;}
    .s1{background: url(../assets/img/rad1.png) left center no-repeat; padding-left: 26px;}
    .s2{background: url(../assets/img/radh1.png) left center no-repeat; padding-left: 26px;}
    .s3{background: url(../assets/img/radh2.png) left center no-repeat; padding-left: 26px;}
    }
}

/*班级列表*/
.classList_box{
.classList_ul{
    li{width: 25%; float: left; margin-bottom: 30px; }
    .class_info{margin: 0 20px; padding: 30px 20px; text-align: center; background:#fff;.borderRadius(5px,5px,5px,5px); overflow: hidden;position: relative;
        border: 1px solid #fff;
    }
    .class_info_part{border: 1px solid @basecolor1;}
    .class_info_all{border: 1px solid @basecolor}
    .p_name{font-size: 24px;color:@tabcolor;}
    .line{margin:20px 40px;height: 2px; background:@linecoloe;}
    .p_number{font-size:18px;color:@tabcolor;}
    .s-radion{width:28px;height: 28px;display: block;position: absolute; background: url(../assets/img/rad2.png) center no-repeat; left:15px;top:15px;cursor: pointer;}
    .checked_all{background: url(../assets/img/radh11.png) center no-repeat;}
    .checked_part{background: url(../assets/img/radh22.png) center no-repeat;}
    }
.btnbox{text-align: center; padding-top: 30px;}
}

 @media screen and (max-width:1470px){
     .classList_box{
        .classList_ul{
            .p_name{font-size: 18px;}
            .p_number{font-size: 16px;}
        }
    }
 }

</style>
