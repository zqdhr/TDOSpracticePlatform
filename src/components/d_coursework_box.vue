<!--课程作业-->
<template>
  <div class="experiment_box">
    <div class="exper_main">
      <courseNav></courseNav>
      <div class="right_box">
        <!--小节下面有作业-->
  
        <div class="add_btn_box" v-if="!noData">
          <div class="sel-box">
            <el-select
              v-model="cate"
              placeholder="请选择作业类型"
              @change="selectCate"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <a class="btnDefault pointer mr20" @click="deleteOperation"
            >删除题目</a
          >
          <a class="btnDefault pointer" @click="click_new">新增题目</a>
        </div>
        <!--课程题目-->
        <div class="coursework_box" v-if="!noData">
          <!--未开课显示的样式 根据情况只显示一个-->
          <template>
            <div class="in-box">
              <input
                placeholder="请输入作业名称"
                type="text"
                autocomplete="off"
                maxlength="15"
                ref="inputVal"
              /><a class="edit" @click="input_focus"></a>
            </div>
          </template>
          <!--已开课显示的样式-->
          <template v-if="1 == 0">
            <div class="coursework_name">区块链原理篇作业</div>
          </template>

          <div class="course_list">
            <!--选择题-->
            <ul class="choice_question">
              <li
                :class="{ li_choose: isShow }"
                v-for="(item, index) in courseList"
                :key="index"
              >
                <div class="title">{{ item.title }}</div>
                <div class="pic">
                  <span><img :src="item.pic" /></span>
                </div>
          
                <p class="answer_box" v-if="item.type == 1">
                  <span
                    class="s_radio"
                    :class="{ 's_radio_answer': iindex+1 == item.answer }"
                    v-for="(iitem, iindex) in item.chose"
                    :key="iindex"
                  >
                  {{iitem}}
                  </span>
                </p>
                <p class="answer_box" v-if="item.type == 2">
                  {{ item.answer }}
                </p>
                <!--选中的状态添加class   li_radio_h-->
                <span
                  class="li_radio"
                  @click="cheeckedList(1,item, index, item.checked)"
                  :class="{ li_radio_h: item.checked }"
                ></span>
              </li>
            </ul>
          </div>
        </div>
        
        <!--小节作业不存在-->
        <div class="noData_box" v-if="noData">
            <p class="mess">当前小节下暂无作业，请点击下方新增作业按钮。</p>
            <div><a class="btnDefault pointer"  @click="noData=false">新增作业</a></div>
        </div>
      </div>
    </div>
    <!--删除弹出框-->
    <el-dialog :visible.sync="isDelete" width="600px">
      <div slot="title" class="dialog_header">请注意!</div>
      <div class="confirm_dialog_body">
        <p class="dialog_mess">
          <span class="span_icon icon_waring">确定要删除当前选中作业吗？</span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <a class="btnDefault" @click="confirmDeleteCourseWork">确 认</a>
        <a
          class="btnDefault"
          @click="
            isDelete = false;
            isShow = false;
          "
          >取 消</a
        >
      </div>
    </el-dialog>
    <!--题库选择弹出框-->
    <el-dialog :visible.sync="showQuestionBank" width="1100px" class="dialog_pagination">
      <div slot="title" class="dialog_header">新增题目（题目库选择）</div>
      <div class="course_list dialog_course_list">
        <div class="pageTab clearfix ">
        <div class="fl">
          <div class="sel-box">
            <el-select v-model="type" placeholder="题目类型" @change="selectQuestionType" >
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" > </el-option>
            </el-select>
          </div>
       
        </div>
        <div class="fr">
         
          <div class="d-serach"> 
            <input placeholder="请输入作业标题" type="text" autocomplete="off" />
            <a class="searchBtn pointer"></a>
          </div>
        </div>
      </div>
        <!--选择题-->
        <ul class="choice_question">
          <li
            class="li_choose"
            v-for="(item, index) in all_courseList"
            :key="index"
          >
            <div class="title">{{ item.title }}</div>
            <div class="pic">
              <span><img :src="item.pic" /></span>
            </div>
            <p class="answer_box" v-if="item.type == 1">
              <span
                class="s_radio"
                :class="{ s_radio_answer: iindex+1 == item.answer }"
                v-for="(iitem, iindex) in item.chose"
                :key="iindex"
              >
               {{iitem}} 
              </span>
             
            </p>
            <p class="answer_box" v-if="item.type == 2">{{ item.answer }}</p>
            <!--选中的状态添加class   li_radio_h-->
            <span
              class="li_radio"
              :class="{ li_radio_h: item.checked }"
              @click="cheeckedList(2,item, index, item.checked)"
            ></span>
          </li>
        </ul>
      </div>


      <div  class="choseFooter clearfix">
          <a class="btnDefault fl pointer" @click="showQuestionBank = false">确认</a>

          <div class="tab-pagination fr">
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
    </el-dialog>
  </div>
</template>
<script>
import courseNav from "@/components/left_courseNav.vue";
export default {
  data() {
    return {
      options: [
        { value: "1", label: "选择题" },
        { value: "2", label: "简答题" },
      ],

      cate: "选择题", //课件分类默认内置课件
      showQuestionBank: false, //题库是否显示(弹出框)
      dialogWidth: 0,
      //作业列表参数根据具体实际情况来定
      coursework: {
        name: "",
      },
      courseList: [
        {
          id: "1",
          title: "1.题目文本题目文本题目文本题目文本题目?",
          type: 1,
          chose: ["选项111", "选项222", "选项3333", "选项4444"],
          pic: "",
          answer: 2,
        },
        {
          id: "2",
          title: "1.题目文本题目文本题目文本题目文本题目?",
          type: 2,
          pic: "",
          answer: "题目文本题目文本题目文本题目文本题目",
        },
      ],
      //全部题目
      all_courseList:[
         {
          id: "1",
          title: "1.题目文本题目文本题目文本题目文本题目?",
          type: 1,
          chose: ["选项111", "选项222", "选项3333", "选项4444"],
          pic: "",
          answer: 2,
        },
        {
          id: "2",
          title: "1.题目文本题目文本题目文本题目文本题目?",
          type: 2,
          pic: "",
          answer: "题目文本题目文本题目文本题目文本题目",
        }, 
      ],
      isShow: false,
      deleteList: [], //选中需要删除的题目列表
      chooseList:[],//新增题目选中
      isDelete: false,
      type:'',//题目类型
      curPage:1,
      perPage:10,
      total:100,
      noData:true,//小节没有内容
    };
  },
  components: {
    courseNav,
  },
  created() {
    let that = this;
    this.cate = this.options[0].value; //默认选中内置课件
    this.setDialogWidth();
    that.addState(that.courseList);
  },
  mounted() {
    let that = this;
    window.onresize = () => {
      return (() => {
        this.setDialogWidth();
      })();
    };
  },
  methods: {
    //分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    //选中事件
    cheeckedList(num,obj, index, checked) {
      let that = this;
      //删除选中
      if(num==1){
        if (!checked) {
            if (!(that.deleteList.indexOf(obj.id) != -1)) {
            that.deleteList.push(obj.id);
            }
            that.$set(that.courseList[index], "checked", true);
            
        } else {
            that.$set(that.courseList[index], "checked", false);
            let  i = that.deleteList.indexOf(obj.id);
            that.deleteList.splice(i, 1);
        }
      }else{
        //新增选中
        
        if (!checked) {
            if (!(that.chooseList.indexOf(obj.id) != -1)) {
            that.chooseList.push(obj.id);
            }
            that.$set(that.all_courseList[index], "checked", true);
            
        } else {
            that.$set(that.all_courseList[index], "checked", false);
            let i = that.chooseList.indexOf(obj.id);
            that.chooseList.splice(i, 1);
        }
          
      }
    },
    
    //数组列表添加是否选中字段
    addState(array) {
     

      let that = this;
      for (var i = 0; i < array.length; i++) {
        that.$set(array[i], "checked", false);
      }
    },
    //弹出框设置响应式宽度
    setDialogWidth() {
      var val = document.documentElement.clientWidth;
      const def = 1200; // 默认宽度
      if (val < def) {
        this.dialogWidth = "80%";
      } else {
        this.dialogWidth = def - 200 + "px";
      }
    },
    //弹出框右上角关闭安妮
    handleClose() {
      let that = this;
      that.showQuestionBank = false;
    },
    //选择分类
    selectCate(val) {
      console.log(val);
    },

    //删除题目
    deleteOperation() {
      let that = this;

      if (that.isShow && that.deleteList.length > 0) {
        that.isDelete = true;
      } else {
        that.isShow = !that.isShow;
        that.addState(that.courseList);

        that.deleteList = [];
      }
    },
    //点击编辑框输入作业名获取焦点
    input_focus() {
      this.$nextTick(function () {
        //DOM 更新了
        this.$refs.inputVal.focus();
      });
    },
    //新增题目弹出框
    selectQuestionType(val){
       let that = this;
       console.log('选择题类型'+val)
    },
    //删除确认
    confirmDeleteCourseWork() {
      let that = this;
      that.isDelete = false;
      that.isShow = false;
    },
    //点击新增题目
    click_new() {
      let that = this;
      that.showQuestionBank = true;
      that.addState(that.all_courseList);
      that.deleteList = [];
    },
  },
};
</script>
<style lang="less" scoped>
@import url(../assets/less/admin.less);
@import url(../assets/less/coursework.less);
</style>