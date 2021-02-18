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
                            @click="checkClass(item,item.checked)">
                        </span>
                        <p class="p_name">{{item.name}}</p>
                        <div class="line"></div>
                        <p class="p_number">(共有{{item.number}}名学员)</p>
                    </div>
                </li>
            </ul>  
        </div>
        <!--已开课班级列表不可编辑-->
        <div class="btnbox">
            <a class="btnDefault pointer" @click="sureCheckClass" >查看</a>
        </div>
   </div>
   </template>
 
    <!--学生列表-->
    <studentList @sureStudent="sureStudent" @backClass="backClass" v-if="isStudent" :studentsList="list" :classList = this.checkedList></studentList>

   </div>
</template>
<script>
import {searchClass,searchClassCount,getStudentsByClasses} from '@/API/api';
import studentList from "@/components/d_studentList_box.vue";//学生信息-学生列表
export default{
    data(){
        return{
            classList:[//班级列表
               
            ],
            checkedList:[],//选中的班级列表

            isStudent:false,
            list:{}
        }
    },
    components:{studentList},
    mounted(){
        let that = this;
        
        //班级列表添加班级是否被选中状态参数，checked 0未选中 1全部选中 2部分选中
        
        that.searchClass();
    },
    methods:{
        
        //班级列表添加选中的状态
        addParamcheck(array){
         let that = this;
          for(var i=0;i<array.length;i++){
              that.$set(array[i], 'checked', 0)
           }
        },

        //班级列表
        searchClass(){
            let that = this;
            searchClass().then(res=> {
                if(res.code==200){
                    that.classList = res.data
                    for(let i =0;i<res.data.length;i++){
                        let objCount = {}
                        objCount.classId= res.data[i].id
                        searchClassCount(objCount).then(res1=> {
                            if(res.code==200){
                                that.$set(that.classList[i], "number", res1.data);
                                that.$set(that.classList[i], 'checked', 0)
                            }else{
                                that.$toast(res.message,3000)
                            }
                        })
                    }
                }else{
                    that.$toast(res.message,3000)
                }
            })
        },
       
       //班级选择
        checkClass(obj,checked){
            let that = this;
            that.$set(obj,'checked',!checked)
         
            let tmp = JSON.parse(JSON.stringify(that.checkedList))
            alert(obj+"111"+checked)
            if(checked==0){
             that.checkedList.push(obj)
            }else{
               for(var i=0;i<that.checkedList.length;i++){
                   if(that.checkedList[i].id == obj.id){
                      tmp.splice(i,1)
                   }
               }
              that.checkedList = tmp;
              
            }
        
        },
         //学生选择确认
        sureStudent(){
          let that = this;
          this.isStudent = false;
          console.log('选择学生确认')
          
        },
        //学生列表返回班级列表
        backClass(){
          this.isStudent = false;
       
        },

        //班级学生信息
        searchClassStudents(list){
            let that = this;
            let obj = {}
            let classIds = [];
            obj.per_page = 10
            obj.page = 1
            for(let i=0;i<list.length;i++){
                classIds.push(list[i].id)
            }
            obj.classIds = classIds
            getStudentsByClasses(obj).then(res=> {
                if(res.code==200){
                    that.list = res.data
                }else{
                    that.$toast(res.message,3000)
                }
            })
        },

        //班级选择确认
        sureCheckClass(){
            let that = this;
            console.log(that.checkedList)
            if(that.checkedList.length==0){
                return that.$toast('请先选择班级',2000)
            }
            that.searchClassStudents(that.checkedList)
            that.isStudent = true;

            //that.$emit('sureCheckClass')
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