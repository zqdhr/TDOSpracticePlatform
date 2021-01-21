<template>
  <div class="pp_main boxsizing">
    <div class="container">
      <div class="pageTab clearfix">
        <div class="fl">
          <div class="sel-box">
            <el-select v-model="type" placeholder="镜像类型" @change="selectType" >
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" > </el-option>
            </el-select>
          </div>
       
        </div>
        <div class="fr">
          <a class="btnDefault pointer abtn" @click="delDataList">删除镜像</a>
          <a class="btnDefault pointer abtn" @click="show_Add=true">新增镜像</a>
          <div class="d-serach"> 
            <input :placeholder="inplaceholder" type="text" autocomplete="off" />
            <a class="searchBtn pointer"></a>
          </div>
        </div>
      </div>

      <div class="tablex_box list_box">
       <div class="tablex_box imageReposittory_table">
        <!--镜像列表-->
        <el-table
          class="center-tab tab-userList"
          :data="Imagelibraries"
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" v-if="showDel">
          </el-table-column>

          <el-table-column prop="name" label="名称" width="240">
          </el-table-column>
          <el-table-column prop="type" label="镜像类型">
            <template slot-scope="scope">
              <span>{{
                scope.row.type == 0
                  ? "KVM"
                  : "Docker"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="size" label="容量"> </el-table-column>
          <el-table-column prop="Introduction" label="简介" width="280">
          </el-table-column>
           <el-table-column prop="applicationNumber" label="被引用次数">
          </el-table-column>
        </el-table>
        </div>
        <div class="tab-pagination imageReposittory_pagination">
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

     <!--删除镜像弹出框-->
    <el-dialog :visible.sync="isDelete" width="600px">
      <div slot="title" class="dialog_header">请注意!</div>
      <div class="confirm_dialog_body">
        <p class="dialog_mess">
          <span class="span_icon icon_waring">确定要删除当前选中镜像吗？</span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <a class="btnDefault" @click="confirmDeleteList">确 认</a>
        <a class="btnDefault" @click="isDelete = false">取 消</a>
      </div>
    </el-dialog>
   
    <!--新增镜像弹出框-->
    <el-dialog class="dialog_add_mirroring dialog_body_nopadding_bottom"
      
      :visible.sync="show_Add"
      width="600px">
      <div slot="title" class="dialog_header">
          请注意!
      </div>
      <div class="confirm_dialog_body">
          <div class="dialog_add_body">
          <el-form ref="form" label-width="100px">
                <el-form-item label="镜像名称:">
                    <el-input v-model="Mirroring.name"></el-input>
                </el-form-item>
                 <el-form-item label="镜像简介:">
                    <el-input v-model="Mirroring.introduction" type="textarea"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <ul class="fileList_name">
                        <li v-for="(file) in files" :key="file.id">
                        <span>{{file.name}}</span>          
                        </li>
                    </ul>
                    <div class="upload_person">
                        <file-upload
                            style="overflow: visible"
                            :maximum="1"
                            :multiple="true"
                            ref="upload"
                            v-model="files"
                            extensions="xlsx,xls"
                            :post-action="uploadUrl"
                            :auto-upload="false"
                            @input-file="inputFile"
                            @input-filter="inputFilter"
                            name="excel_file"
                            :headers="{ Authorization: jwt }"
                        >
                            <a class="a_upload pointer"><span>添加镜像</span></a>
                        </file-upload>
                    </div>
                </el-form-item>
          </el-form>
         
          </div>
      </div>
  
        <div slot="footer" class="dialog-footer ">
          <a class="btnDefault"  @click="confiremNew">确认上传</a>
    
      </div>
      </el-dialog>

  </div>
</template>
<script>
import { mapState } from "vuex";
import FileUpload from "vue-upload-component";
export default {
  data() {
    return {
     options: [ { value: "0", label: "KVM"}, { value: "1", label: "Docker"} ],
     type: "", //
      className: "", //
      inplaceholder: "请输入镜像名称",
      
      //新增镜像
      Imagelibraries:[
          {id:'ddddoogk',name:'c7_k_2c4g50g_bigdate_linux',type:0,size:'2.5GB',Introduction:'简介文本简介文本简介文本简介文本 简介文本简介文本简介文本',applicationNumber:'6'},
          {id:'ddddoogk',name:'c7_k_2c4g50g_bigdate_linux',type:1,size:'2.5GB',Introduction:'简介文本简介文本简介文本简介文本 简介文本简介文本简介文本',applicationNumber:'6'},
          {id:'ddddoogk',name:'c7_k_2c4g50g_bigdate_linux',type:0,size:'2.5GB',Introduction:'简介文本简介文本简介文本简介文本 简介文本简介文本简介文本',applicationNumber:'6'},
          {id:'ddddoogk',name:'c7_k_2c4g50g_bigdate_linux',type:0,size:'2.5GB',Introduction:'简介文本简介文本简介文本简介文本 简介文本简介文本简介文本',applicationNumber:'6'},
          {id:'ddddoogk',name:'c7_k_2c4g50g_bigdate_linux',type:1,size:'2.5GB',Introduction:'简介文本简介文本简介文本简介文本 简介文本简介文本简介文本',applicationNumber:'6'},
          {id:'ddddoogk',name:'c7_k_2c4g50g_bigdate_linux',type:0,size:'2.5GB',Introduction:'简介文本简介文本简介文本简介文本 简介文本简介文本简介文本',applicationNumber:'6'},
          {id:'ddddoogk',name:'c7_k_2c4g50g_bigdate_linux',type:1,size:'2.5GB',Introduction:'简介文本简介文本简介文本简介文本 简介文本简介文本简介文本',applicationNumber:'6'},
          {id:'ddddoogk',name:'c7_k_2c4g50g_bigdate_linux',type:0,size:'2.5GB',Introduction:'简介文本简介文本简介文本简介文本 简介文本简介文本简介文本',applicationNumber:'6'}
      ],
      showDel: false, //删除多选是否显示
      perPage:24, //虚拟机每页
      curPage:1,
      show_Add:false,//虚拟机释放弹出框显示
      dialog_machine:'',
      multipleSelection:[],//删除镜像库的选择
      isDelete:false,//是否删除弹出框
      Mirroring:{//新增镜像对象
          name:'',
          introduction:''
      },
      jwt:'',
      uploadUrl:'',
      files:[]
    };
  },
  components:{
      FileUpload
  },
  computed: {
    ...mapState({
      state: (state) => state,
    }),
  },
  methods: {
    //人员类别选择
    selectType(val) {
      //表示选择的是学生
      let that = this;
      if (val == 0) {
        console.log('KVM')
      }
      if (val == 1) {
        console.log('Docker')
      }
     
    },

  
    //删除镜像点击
    delDataList() {
      let that = this;
      if (that.multipleSelection.length <= 0) {
        that.showDel = !that.showDel;
      } else {
        that.isDelete = true;
      }
    },
      handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    //确认删除镜像列表
    confirmDeleteList(){
        let that = this;
        console.log('确认删除镜像')
    },

     //上传前的钩子函数
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        const extension = newFile.name.substring(
          newFile.name.lastIndexOf(".") + 1
        );
        console.log(extension);
        if (extension != "xlsx" && extension != "xls") {
          this.$toast("只能上传后缀是.xlsx或xls的文件", 3000);
          return prevent();
        }
      }
    },
        //上传的回调函数，每次上传回调都不一样
    inputFile(newFile, oldFile) {
      let that = this;
      console.log('123')
      
      if ( Boolean(newFile) !== Boolean(oldFile) ||oldFile.error !== newFile.error) {
        if (!this.$refs.upload.active) {
          this.$refs.upload.active = true;
        }
      }
    
      if (newFile && oldFile) {
        //add
        if (newFile && oldFile && !newFile.active && oldFile.active) {
          //console.log('response', newFile.response)
          let response = newFile.response;
          console.log(this.files)
          if (response.code == 200) {
            this.$message.success("文件上传成功");
            that.searchUser(2, "", "", 1, 10);
            
          } else {
            this.$message.error("文件上传失败");
          }
          if (newFile.xhr) {
            //  Get the response status code
            console.log("status", newFile.xhr.status);
          }
        }
      }
      if (newFile && oldFile) {
        // update
        console.log("update", newFile);
      }
      if (!newFile && oldFile) {
        // remove
        console.log("remove", oldFile);
      }
    },
    //底部分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    upLoad() {
      this.$refs.upload.active = true;
    },
    
    //虚拟机释放确认
    confiremNew(){
      let that = this;
      that.show_Add = false
    },
 
   
  },
};
</script>
<style lang="less" scoped>
.stu_upload{width:100px; margin-right: 20px; cursor: pointer;}
.excel_file{cursor: pointer;}
@import url(../../assets/less/admin.less);
</style>