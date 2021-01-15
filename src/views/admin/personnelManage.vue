<template>
  <div class="pp_main boxsizing">
    <div class="container container-userList">
      <div class="pageTab">
        <div class="fl">
          <div class="sel-box">
            <el-select v-model="type" placeholder="请选择人员类别" @change="selectType" >
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" > </el-option>
            </el-select>
          </div>
          <div class="sel-box" v-show="type == '学生' || type == 2">
            <el-select v-model="className" placeholder="请选择班级" @change="selectClass" >
              <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id" > </el-option>
            </el-select>
          </div>
        </div>
        <div class="fr">
          <a class="btnDefault pointer abtn" @click="delUser">删除人员</a>
          <file-upload
            class="stu_upload"
            style="overflow: visible"
            :maximum="3"
            :multiple="true"
            ref="upload"
            v-model="files"
            extensions="xlsx,xls"
            :post-action="uploadUrl"
            @input-file="inputFile"
            @input-filter="inputFilter"
            name="excel_file"
            :headers="{ 'Authorization': jwt }"
          >
  
            <a class="btnDefault pointer abtn" @click.prevent="$refs.upload.active = true">上传人员</a>
          </file-upload>
          
          <div class="d-serach"> 
            <input :placeholder="inplaceholder" type="text" autocomplete="off" v-model="searchText" />
            <a class="searchBtn pointer" @click="searchByIdOrName"></a>
          </div>
        </div>
      </div>

      <div class="tablex_box">
        <!--学生列表-->
        <el-table v-if="type == '学生' || type == 2"
          class="center-tab tab-userList"
          :data="studentList" 
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" v-if="showDel">
          </el-table-column>
          <el-table-column prop="id" label="学号" width="150">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="gender" label="性别"> </el-table-column>
          <el-table-column prop="phoneNumber" label="号码"> </el-table-column>
          <el-table-column prop="identificationNumber" label="邮箱"> </el-table-column>
          <el-table-column prop="" label="操作">
            <template slot-scope="scope">
              <div>
                <a class="pointer atab-btn" @click="aedit(scope.row)">编辑</a>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!--教师列表-->
        <el-table v-if="type==1"
                class="center-tab tab-userList"
                :data="teacherList"
                @selection-change="handleSelectionChange"
                style="width: 100%"
        >
          <el-table-column type="selection" width="55" v-if="showDel">
          </el-table-column>
          <el-table-column prop="id" label="工号" width="150">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="gender" label="性别"> </el-table-column>
          <el-table-column prop="phoneNumber" label="号码"> </el-table-column>
          <el-table-column prop="identificationNumber" label="邮箱"> </el-table-column>
          <el-table-column prop="" label="操作">
            <template slot-scope="scope">
              <div>
                <a class="pointer atab-btn" @click="aedit(scope.row)">编辑</a>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!--管理员列表-->
        <el-table v-if="type==0"
                  class="center-tab tab-userList"
                  :data="adminList"
                  @selection-change="handleSelectionChange"
                  style="width: 100%"
        >
          <el-table-column type="selection" width="55" v-if="showDel">
          </el-table-column>
          <el-table-column prop="id" label="账号" width="150">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="gender" label="性别"> </el-table-column>
          <el-table-column prop="phoneNumber" label="号码"> </el-table-column>
          <el-table-column prop="identificationNumber" label="邮箱"> </el-table-column>
          <el-table-column prop="" label="操作">
            <template slot-scope="scope">
              <div>
                <a class="pointer atab-btn" @click="aedit(scope.row)">编辑</a>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="tab-pagination">
          <el-pagination
            background
            :current-page="curPage"
            :page-size="perPage"
            @current-change="handleCurrentChange"
            layout="prev, pager, next,jumper"
            :total="total"
          >
          </el-pagination>
        </div>
    </div>
    </div>
    </div>
</template>
<script>
import "vue-upload-component/dist/vue-upload-component.part.css";
import FileUpload from "vue-upload-component";
import { mapState } from "vuex";
import {searchUser,searchClass,deleteUser} from '@/API/api';
export default {
  data() {
    return {
      options: [
        {
          value: "2",
          label: "学生",
        },
        {
          value: "1",
          label: "教师",
        },
        {
          value: "0",
          label: "管理员",
        },
      ],
      type: "2", //人员类型选择
      classList: [
        { id: "211", name: "10年03班" },
        { id: "212", name: "10年04班" },
      ],
      className: "", //选择的班级
      inplaceholder: "请输入姓名和学号",
      searchText:"",
      studentList: [
        {
        }
      ],
      teacherList: [
        {
        },
      ],
      adminList: [
        {
        },
      ],
      //用户总数
      total:0,
      multipleSelection: [],
      showDel: false, //删除多选是否显示
      perPage: 10,//用户列表每页条数
      curPage:1,
      jwt: "",
      files: [], // excel文件列表
    };
  },
  components: { FileUpload },
  computed: {
    ...mapState({
      uploadUrl: (state) => state.uploadUrl,
    }),
  },
  methods: {
    //页面一进来默认显示学生
    //人员类别选择
    selectType(val) {
      //表示选择的是学生
      let that = this;
      that.className = "";
      if (val == 2) {
        that.inplaceholder = "请输入姓名和学号";
        that.searchUser(2,'','',1,10);
      }
      if (val == 1) {
        that.inplaceholder = "请输入姓名和工号";
        that.searchUser(1,'','',1,10);
      }
      if (val == 0) {
        that.inplaceholder = "请输入姓名和账号";
        that.searchUser(0,'','',1,10);
      }
    },
    searchUser(type,search,classes,page,per_page){
      let that = this;
      let obj = {};
      obj.type = type;
      obj.search = search;
      obj.classes = classes;
      obj.page = page;
      obj.per_page = per_page;
      searchUser(obj).then(res=> {
        if(res.code==200){
          for(let i =0;i<res.data.list.length;i++){
            if(res.data.list[i].gender == 0){
              res.data.list[i].gender = "男"
            }else res.data.list[i].gender = "女"
          }
          if(type == 0){
            that.adminList = res.data.list
          }else if(type == 1){
            that.teacherList = res.data.list
          }else if(type == 2) {
            that.studentList = res.data.list
          }
          that.total = res.data.total;
        }else{
          that.$toast(res.message,3000)
        }
      })
    },
    //搜索
    searchByIdOrName(){
      let that = this;
      let type = that.type;
      let search = that.searchText;
      let classes = that.className;
      that.searchUser(type,search,classes,1,10);
    },
    //班级选择事件
    selectClass() {
      let that = this;
      that.searchUser(2,'',that.className,1,10);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    //删除用户
    delUser() {
      let that = this;
      if (that.multipleSelection.length <= 0) {
        that.showDel = !that.showDel;
      } else {
        let obj = {};
        let list = [];
        for(let i = 0 ;i<that.multipleSelection.length;i++){
          list.push(that.multipleSelection[i].id)
        }
        console.log(that.searchText)
        console.log(that.className)
        obj.delete_id_list = list;
        console.log(JSON.stringify(obj))
        deleteUser(JSON.stringify(obj)).then(res=>{
          if(res.code == 200){
            that.searchUser(that.type,that.searchText,that.className,1,10)
          }else{
            that.$toast(res.message,3000)
          }
        })
        console.log("删除用户");
      }
    },
    //底部分页
    handleCurrentChange(val) {
      let that = this;
      console.log(that.type)
      that.searchUser(that.type,'','',val,10);
      console.log(`当前页: ${val}`);
    },
    upLoad() {
      this.$refs.upload.active = true;
    },
    //上传前的钩子函数
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        const extension = newFile.name.substring(
          newFile.name.lastIndexOf(".") + 1
        );
        console.log(extension)
        if (extension != "xlsx" && extension != "xls") {
          this.$toast("只能上传后缀是.xlsx或xls的文件", 3000);
          return prevent();
        }
      }
    },
    //学生列表
    searchUser1(){
      let that = this;
      that.searchUser(2,'','',1,10);
    },
    //班级列表
    searchClass(){
      let that = this;
      searchClass().then(res=> {
        if(res.code==200){
          that.classList = res.data
        }else{
          that.$toast(res.message,3000)
        }
      })
    },
    // 文件上传成功
    handleSuccess(res, file, fileList) {
      this.$message.success('文件上传成功')
    },

    //上传的回调函数，每次上传回调都不一样
    inputFile(newFile, oldFile) {
      let that = this;
      if (
        Boolean(newFile) !== Boolean(oldFile) ||
        oldFile.error !== newFile.error
      ) {
        if (!this.$refs.upload.active) {
          this.$refs.upload.active = true;
        }
      }
      if (newFile && oldFile) {
          //add
        if (newFile && oldFile && !newFile.active && oldFile.active) {
          //console.log('response', newFile.response)
          let response = newFile.response;
          if (response.code == 200) {
            this.$message.success('文件上传成功')
            that.searchUser(2,'','',1,10);
          } else {
            this.$message.error('文件上传失败')
          }
          if (newFile.xhr) {
            //  Get the response status code
            console.log("status", newFile.xhr.status);
          }
        }
        
      }
      if (newFile && oldFile) {
        // update
        console.log('update', newFile)
      }
      if (!newFile && oldFile) {
        // remove
        console.log('remove', oldFile)
      }
    },
  },
  mounted() {
    let that = this;
    that.jwt = sessionStorage.getItem('jwt')
    that.searchUser1();
    that.searchClass();
  },
};
</script>
<style lang="less" scoped>
.stu_upload{width:100px; margin-right: 20px; cursor: pointer;}
.excel_file{cursor: pointer;}
@import url(../../assets/less/admin.less);
</style>