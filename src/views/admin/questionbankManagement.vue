<template>
    <div class="pp_main boxsizing">
    <div class="container">
      <div class="pageTab clearfix">
        <div class="fl">
          <div class="sel-box">
            <el-select v-model="customClass" placeholder="自定义分类" @change="selectType" >
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" > </el-option>
            </el-select>
          </div>
          <div class="sel-box" v-if="customClass!=''">
            <el-select v-model="i_customClass" placeholder="自定义分类" @change="selectType1" >
              <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value" > </el-option>
            </el-select>
          </div>

           <div class="sel-box" v-if="i_customClass!=''">
            <el-select v-model="ii_customClass" placeholder="自定义分类" @change="selectType2" >
              <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" > </el-option>
            </el-select>
          </div>

          <div class="sel-box" >
            <el-select v-model="quest_type" placeholder="题目类型" @change="selectQuestType" >
              <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" > </el-option>
            </el-select>
          </div>
          
        </div>
        <div class="fr">
          <a class="btnDefault pointer abtn" @click="delList">删除题目</a>
          <a class="btnDefault pointer abtn" @click="isNew=true;files=[];isNewType=0">新增题目</a>
          
          
          <div class="d-serach"> 
            <input :placeholder="inplaceholder" type="text" autocomplete="off" />
            <a class="searchBtn pointer"></a>
          </div>
        </div>
      </div>
       
       <div class="table_box table_box_questionBank">
           <el-table
        
          class="center-tab tab-userList"
          :data="questionList"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" v-if="showDel">
             </el-table-column>
             <el-table-column prop="serial_number" label="题目序号" width="150">
                <template scope="scope">
                    <span>{{(curPage - 1) * perPage + scope.$index + 1}}</span>
                </template>
             </el-table-column>
             <el-table-column prop="title" label="题目简介">
                 <template slot-scope="scope">
                     <div class="">
                         <el-tooltip popper-class="quest_tooltip"  ref="tooltip" :content="scope.row.title" placement="top" effect="light">
                             <span class="s-text textline1 pointer">{{ scope.row.title }}</span>
                         </el-tooltip>
                    </div>
                 </template>
                 
             </el-table-column>
              <el-table-column prop="answer" label="题目答案">
                 <template slot-scope="scope">
                     <div class="">
                         <!--根据题目类型，确定答案是否需要放上去提示完全-->
                         <el-tooltip popper-class="quest_tooltip" ref="tooltip" :content="scope.row.title" placement="top" effect="light" v-if="quest_type!=0" show-overflow-tooltip="false">
                             <span class="s-text textline1 pointer">{{ scope.row.answer }}</span>
                         </el-tooltip>
                         <span class="s-text textline1" v-if="quest_type==0">{{ scope.row.answer }}</span>
                     </div>
                 </template>
                 
             </el-table-column>
             <el-table-column prop="pictureAddress" label="图片地址">
                 <template slot-scope="scope">
                     <div class="">
                        <span class="s-text textline1 pointer" @click="getPreview">{{scope.row.pictureAddress}}</span>
                     </div>
                 </template>
                 
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
            :total="total"
          >
          </el-pagination>
        </div>


    </div>
    <el-image-viewer v-if="showViewer"  :on-close="showViewerClose" :url-list="[guidePic]"></el-image-viewer>

    <!--删除题目-->
    <el-dialog :visible.sync="isDelete" width="600px">
      <div slot="title" class="dialog_header">请注意!</div>
      <div class="confirm_dialog_body">
        <p class="dialog_mess">
          <span class="span_icon icon_waring">确定要删除当前选中的题目吗？</span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <a class="btnDefault" @click="confirmDelete">确 认</a>
        <a class="btnDefault" @click="isDelete = false">取 消</a>
      </div>
    </el-dialog>

    <!--新增题目-->
      <el-dialog
      class="dialog_pagination"
      :visible.sync="isNew"
       width="600px"
      :class="{'newCourseware_dialog':isNewType==0}"
    > 
      <template v-if="isNewType==0">
        <div slot="title" class="dialog_header">新增题目</div>
        <div class="confirm_dialog_body"></div>
        <div slot="footer" class="dialog-footer">
          <a class="btnDefault" @click="isNewType=1">批量上传</a>
          <a class="btnDefault">单个上传</a>
          <p class="dialog-mess">（点击此处下载“<a>批量上传</a>”模板）</p>
        </div>
      </template>
      <template v-if="isNewType == 1">
        <div slot="title" class="dialog_header">本地上传</div>
        <div class="confirm_dialog_body" style="padding: 60px 0 40px 0">
          <ul class="fileList_name">
            <li v-for="file in files" :key="file.id">
              <span>{{ file.name }}</span>
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
              <a class="a_upload pointer"><span>选择需要添加的课件</span></a>
            </file-upload>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <a class="btnDefault pointer" @click="confimBatchUpload">确认上传</a>
        </div>
      </template>
      
      </el-dialog>

</div>
</template>
<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import FileUpload from "vue-upload-component";

export default {
    data(){
        return{
            inplaceholder:'请输入题目标题',
            customClass:'',//自定义分类
            i_customClass:'',//自定义分类,
            ii_customClass:'',//自定义分类
            options:[{value:'0',label:'区块链1'},{value:'1',label:'节点启动与暂停'}],
            options1:[{value:'0',label:'区块链1'},{value:'1',label:'节点启动与暂停'}],
            options2:[{value:'0',label:'区块链1'},{value:'1',label:'节点启动与暂停'}],
            typeList:[{value:'0',label:'选择题'},{value:'1',label:'简答题'}],
            quest_type:'',
            
            questionList:[
                {serial_number:'001',title:'文本内容文本内容文本内容文本内容本内容文本内容文本内容文本内容文本内容文本内容本内容文本内容',answer:'B',pictureAddress:'C：AAAAAAAAAA>BBBBBBBBB>'},
                {serial_number:'002',title:'文本内容文本内容文本内容文本内容本内容文本内容文本内容文本内容文本内容文本内容本内容文本内容',answer:'B',pictureAddress:'C：AAAAAAAAAA>BBBBBBBBB>'},
                {serial_number:'002',title:'文本内容文本内容文本内容文本内容本内容文本内容文本内容文本内容文本内容文本内容本内容文本内容',answer:'文本内容文本内容文本内容文本内容本内容文本内容文本内容文本内容文本内容文本内容本内容文本内容',pictureAddress:'C：AAAAAAAAAA>BBBBBBBBB>'}
            ],
            multipleSelection:[],
            guidePic:null,
            total:100,//总共条数
            perPage:15,//每页页数
            curPage:1,//当前页
            showViewer:false, //图片预览
            showDel:false,
            isDelete:false,
            isNew:false, //新增题目
            isNewType:0,//题目新增方式，1批量上传 2单个上传
            jwt: "",
            uploadUrl: "",
            files: [],
        }
    },
    components:{
        ElImageViewer,FileUpload
    },
    created(){
        let that = this;
        //默认显示选择题
        that.quest_type = that.typeList[0].value
    },
    methods:{
      //上传前的钩子函数
      inputFilter(newFile, oldFile, prevent) {
        if (newFile && !oldFile) {
          const extension = newFile.name.substring(
            newFile.name.lastIndexOf(".") + 1
          );
         
          if (extension != "xlsx" && extension != "xls") {
            this.$toast("只能上传后缀是.xlsx或xls的文件", 3000);
            return prevent();
          }
        }
      },
      //上传的回调函数，每次上传回调都不一样
      inputFile(newFile, oldFile) {
        let that = this;
        console.log("123");
         /*
        if (
          Boolean(newFile) !== Boolean(oldFile) ||
          oldFile.error !== newFile.error
        ) {
          if (!this.$refs.upload.active) {
            this.$refs.upload.active = true;
          }
        }
         */
        if (newFile && oldFile) {
          //add
          if (newFile && oldFile && !newFile.active && oldFile.active) {
            //console.log('response', newFile.response)
            let response = newFile.response;
            console.log(this.files);
            if (response.code == 200) {
              this.$message.success("文件上传成功");
                  that.isNew = false;
     
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
        //自定义分类
        selectType(val){

        },
        //自定义分类
        selectType1(val){

        },
        //自定义分类
        selectType2(val){

        },
        //题目类型选择
        selectQuestType(val){
           
        },
         //底部分页
        handleCurrentChange(val) {
        let that = this;
       
        console.log(`当前页: ${val}`);
        },
        getPreview(){
            this.showViewer = true;
            this.guidePic = 'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
            this.guidePic ? this.showViewer = true: this.$message.info('当前没有可预览的图片')
        },
        //图片预览关闭
        showViewerClose(){
            console.log('ok')
            this.showViewer = false;
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log(val);
         },
        //删除题目
        delList(){
            let that = this;
           
            if (that.multipleSelection.length <= 0) {
                that.showDel = !that.showDel;
            } else {
                that.isDelete = true;
            }
        },
        //确认删除
        confirmDelete(){
            let that = this;
            that.showDel = !that.showDel;
            that.isDelete = false;
        },
        //批量上传确认
        confimBatchUpload(){
          let that = this;
          
            this.$refs.upload.active = true;
        
       
        }
        
    }
}
</script>
<style lang="less" scoped>
@import url(../../assets/less/admin.less);
.table_box_questionBank{min-height: 500px;}
.s-text{display: block;}
.dialog-mess{
  text-align: center; padding-top:10px; color:@hnavcolor;
  a{cursor: pointer; color: @basecolor;}
}
.fileList_name{
  li{
    text-align: center; padding-bottom:5px;
  }
}
</style>