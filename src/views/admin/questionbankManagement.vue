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
          <a class="btnDefault pointer abtn">删除题目</a>
          <a class="btnDefault pointer abtn">新增题目</a>
          
          
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
          >
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
                        <span class="s-text textline1 pointer" :preview-src-list="srcList">{{scope.row.pictureAddress}}</span>
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
    <el-image-viewer v-if="showViewer" on:close="showViewerClose" :url-list="[srcList]"></el-image-viewer>
</div>
</template>
<script>
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
            srcList: [
                'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
            ],
            total:100,//总共条数
            perPage:15,//每页页数
            curPage:1,//当前页
        }
    },
    created(){
        let that = this;
        //默认显示选择题
        that.quest_type = that.typeList[0].value
    },
    methods:{
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
    }
}
</script>
<style lang="less" scoped>
@import url(../../assets/less/admin.less);
.table_box_questionBank{min-height: 500px;}
.s-text{display: block;}
</style>