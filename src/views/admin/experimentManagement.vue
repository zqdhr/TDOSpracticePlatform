<template>
  <div class="pp_main boxsizing">
    <div class="container">
      <div class="pageTab clearfix">
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
          <a class="btnDefault pointer abtn" @click="click_Release(1,'')">一键释放</a>
          
          <!--
          <div class="d-serach"> 
            <input :placeholder="inplaceholder" type="text" autocomplete="off" />
            <a class="searchBtn pointer"></a>
          </div>
          -->
        </div>
      </div>

      <div class="tablex_box list_box">
        <template v-if="isHasData">
        <div class="l_box">
          <ul class="default_List">
             <li v-for="(item,index) in machineList" :key="index">
                 <div class="info-box ">
                   
                     <div class="d-icon"></div>
                      <p class="p_id textline1">ID：{{item.container_id}}</p>
                      <p class="p_id textline1">用户：{{item.user_name}}</p>
                     <p class="p_id textline1">实验名称：{{item.name}}</p>
                     <div class="btnbox">
                         <a class="btnDefault machbtn pointer" @click="click_Release(2,item.id)"><span>释放内存</span></a>
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
            :total="total"
          >
          </el-pagination>
        </div>
        </template>

       <nodata dataMess="当前暂无正在运行的实验" noDataType='1' v-if="!isHasData"></nodata>

      </div>
    </div>
   
    <!--虚拟机内存释放弹出框-->
    <el-dialog
      
      :visible.sync="show_Release"
      width="600px">
      <div slot="title" class="dialog_header">
          请注意!
      </div>
      <div class="confirm_dialog_body">
          <p class="dialog_mess" v-if="!release_success"><span class="span_icon icon_waring">{{dialog_machine}}</span></p>
          <p class="dialog_mess" v-if="release_success"><span class="span_icon icon_success">虚拟机内存已释放！</span></p>
      </div>
      <div slot="footer" class="dialog-footer " v-if="!release_success">
          <a class="btnDefault" @click="confiremRelease">确 认</a>
          <a class="btnDefault"   @click="release_success = false;show_Release=false">取 消</a>
      </div>
        <div slot="footer" class="dialog-footer " v-if="release_success">
          <a class="btnDefault"  @click="successConfirm">确 认</a>
    
      </div>
      </el-dialog>

  </div>
</template>
<script>
import { mapState } from "vuex";
import {getRunContainerList,searchClass,stopRunContainerList} from '@/API/api';
import nodata from '@/components/noData'
export default {
  data() {
    return {
     options: [ { value: "0", label: "全部"},{ value: "1", label: "教师"}, { value: "2", label: "学生"} ],
     type: "", //人员类型选择
      classList: [
        { id: "211", name: "10年03班" },
        { id: "212", name: "10年04班" },
      ],
      className: "", //选择的班级
      inplaceholder: "请输入虚拟机id",
      machineList:[
      ],//设备列表
      total:1,
      showDel: false, //删除多选是否显示
      perPage:24, //虚拟机每页
      curPage:1,
      show_Release:false,//虚拟机释放弹出框显示
      release_success:false,//是否是否成功
      dialog_machine:'',
       isHasData:true,//是否有数据 默认有数据
    };
  },
  components:{nodata},

  computed: {
    ...mapState({
      state: (state) => state,
    }),
  },
  created(){
    let that = this;
    that.type = that.options[0].value

  },
    mounted(){
        let that = this;
        that.getAllRunContainer();
        that.searchClass();
    },
  methods: {
      getRunContainerList(type,classId,page,perPage){
          let that = this;
          let obj = {};
          obj.type = type;
          obj.classId = classId;
          obj.page = page;
          obj.perPage = perPage;
          getRunContainerList(obj).then(res=> {
              if(res.code==200){
                  that.total = res.data.total;
                  res.data.total==0 ? that.isHasData = false :that.isHasData = true
                  that.machineList = res.data.list;
              }else{
                  this.$toast(res.message,2000)
              }
          })
      },
      getAllRunContainer(){
        let that = this;
        that.getRunContainerList(0,'',1,10);
      },
      //班级列表
      searchClass() {
          let that = this;
          searchClass().then((res) => {
              if (res.code == 200) {
                  that.classList = res.data;
              } else {
                  that.$toast(res.message, 3000);
              }
          });
      },
    //人员类别选择
    selectType(val) {
      //表示选择的是学生
      let that = this;
      that.className = "";
      if (val == 1) {
        console.log('老师')
        that.getRunContainerList(1,'',1,10);
      }
      if (val == 2) {
        console.log('学生')
        that.getRunContainerList(2,'',1,10);
      }
     
    },
    //班级选择事件
    selectClass(val) {
        let that = this;
        that.getRunContainerList(2,val,1,10);
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
    //虚拟机释放点击
    click_Release(num,id){
      let that = this;
      that.show_Release = true
      that.release_success = false
      if(num==1){
    
        that.type == 1?that.dialog_machine ='确定要一键释放所有学生内存吗？':that.type==2?that.dialog_machine ='确定要一键释放所有老师内存吗？':that.dialog_machine ='确定要一键释放所有内存吗？'
        
      }else{
        that.dialog_machine ='确定要释放ID：'+id+'的虚拟机内存吗？'
      }

    },
    //虚拟机释放确认
    confiremRelease(){
      let that = this;
    stopRunContainerList().then((res) => {
        if (res.code == 200) {
            that.release_success = true
        } else {
            that.$toast(res.message, 3000);
        }
    });

    },
    //释放成功确认
    successConfirm(){
      let that = this
       that.show_Release = false
      that.release_success = false
    }
   
  },
};
</script>
<style lang="less" scoped>
.stu_upload{width:100px; margin-right: 20px; cursor: pointer;}
.excel_file{cursor: pointer;}
@import url(../../assets/less/admin.less);
</style>