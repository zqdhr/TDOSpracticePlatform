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
          <div class="sel-box" v-show="type == '学生' || type == 0">
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
            :headers="{ Authorization: jwt }"
          >
  
            <a class="btnDefault pointer abtn" @click.prevent="$refs.upload.active = true">上传人员</a>
          </file-upload>
          
          <div class="d-serach"> 
            <input :placeholder="inplaceholder" type="text" autocomplete="off" />
            <a class="searchBtn pointer"></a>
          </div>
        </div>
      </div>

      <div class="tablex_box">
        <!--学生列表-->
        <el-table
          class="center-tab tab-userList"
          :data="studentList" 
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" v-if="showDel">
          </el-table-column>
          <el-table-column prop="sno" label="学号" width="150">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="sex" label="性别"> </el-table-column>
          <el-table-column prop="number" label="号码"> </el-table-column>
          <el-table-column prop="email" label="邮箱"> </el-table-column>
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
            :total="150"
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
export default {
  data() {
    return {
      options: [
        {
          value: "0",
          label: "学生",
        },
        {
          value: "1",
          label: "教师",
        },
        {
          value: "2",
          label: "管理员",
        },
      ],
      type: "学生", //人员类型选择
      classList: [
        { id: "211", name: "10年03班" },
        { id: "212", name: "10年04班" },
      ],
      className: "", //选择的班级
      inplaceholder: "请输入姓名和学号",
      studentList: [
        {
          sno: "001",
          name: "王威龙",
          sex: "男",
          number: "15864521369",
          email: "15864521369@qq.com",
        },
        {
          sno: "001",
          name: "王威龙",
          sex: "男",
          number: "15864521369",
          email: "15864521369@qq.com",
        },
        {
          sno: "001",
          name: "王威龙",
          sex: "男",
          number: "15864521369",
          email: "15864521369@qq.com",
        },
        {
          sno: "001",
          name: "王威龙",
          sex: "男",
          number: "15864521369",
          email: "15864521369@qq.com",
        },
        {
          sno: "001",
          name: "王威龙",
          sex: "男",
          number: "15864521369",
          email: "15864521369@qq.com",
        },
        {
          sno: "001",
          name: "王威龙",
          sex: "男",
          number: "15864521369",
          email: "15864521369@qq.com",
        },
        {
          sno: "001",
          name: "王威龙",
          sex: "男",
          number: "15864521369",
          email: "15864521369@qq.com",
        },
        {
          sno: "001",
          name: "王威龙",
          sex: "男",
          number: "15864521369",
          email: "15864521369@qq.com",
        },
        {
          sno: "001",
          name: "王威龙",
          sex: "男",
          number: "15864521369",
          email: "15864521369@qq.com",
        },
        {
          sno: "001",
          name: "王威龙",
          sex: "男",
          number: "15864521369",
          email: "15864521369@qq.com",
        },
        {
          sno: "001",
          name: "王威龙",
          sex: "男",
          number: "15864521369",
          email: "15864521369@qq.com",
        },
        {
          sno: "001",
          name: "王威龙",
          sex: "男",
          number: "15864521369",
          email: "15864521369@qq.com",
        },
      ],
      multipleSelection: [],
      showDel: false, //删除多选是否显示
      perPage: 12,//用户列表每页条数
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
      if (val == 0) {
        console.log(123);
        that.inplaceholder = "请输入姓名和学号";
      }
      if (val == 1) {
        that.inplaceholder = "请输入姓名和工号";
      }
      if (val == 2) {
        that.inplaceholder = "请输入姓名和账号";
      }
    },
    //班级选择事件
    selectClass() {},
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
        console.log("删除用户");
      }
    },
    //底部分页
    handleCurrentChange(val) {
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
            console.log("ok");
          } else {
            console.log("失败");
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
};
</script>
<style lang="less" scoped>
.stu_upload{width:100px; margin-right: 20px; cursor: pointer;}
.excel_file{cursor: pointer;}
@import url(../../assets/less/admin.less);
</style>