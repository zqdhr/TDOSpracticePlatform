<template>
<div class="pp_main boxsizing">
    <div class="container">
      <div class="pageTab clearfix">
        <div class="fl">
          <div class="sel-box">
            <el-select v-model="customClass" placeholder="自定义分类" @change="selectType" >
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" > </el-option>
            </el-select>
          </div>
          <div class="sel-box" v-if="  options1.length>0">
            <el-select v-model="i_customClass" placeholder="自定义分类" @change="selectType1" >
              <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id" > </el-option>
            </el-select>
          </div>

           <!-- <div class="sel-box" v-if="i_customClass!=''">
            <el-select v-model="ii_customClass" placeholder="自定义分类" @change="selectType2" >
              <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" > </el-option>
            </el-select>
          </div> -->

        </div>
        <div class="fr">
          <a class="btnDefault pointer abtn"  @click="click_new">新增实验</a>


          <div class="d-serach">
            <input :placeholder="inplaceholder" type="text" v-emoji v-model="searchTx" autocomplete="off" @keyup.enter="findExperiment(1)" />
            <a class="searchBtn pointer" @click="findExperiment(1)"></a>
          </div>
        </div>
      </div>
    </div>

    <div class="experimentLibrary_box">
        <div class="container">
            <template v-if="isHasData">
            <div class="list_box">
                <ul class="list_ul clearfix">
                    <li v-for="(item,index) in experimentList" :key="index">
                        <div class="info boxShadow pointer" @click="link_Detail(item.id)">

                            <!--
                            <el-tooltip class="item" effect="dark" content="设置" placement="top">
                                <a class="icon icon_set pointer"></a>
                            </el-tooltip>
                            -->
                            <div class="pic">
                                <div class="pic_box"><img :src="item.pic_url"/><div class="trans"></div></div>
                            </div>
                            <p class="p-text textline1">{{item.name}}</p>
                             <p class="p-text textline1">虚拟机{{item.num}}台</p>
                            <p class="p-text textline1">实验时长：{{item.duration}}分钟</p>
                             <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <a class="icon icon_close pointer" @click.stop="deleteExper(item.id)"></a>
                            </el-tooltip>

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

            <nodata dataMess="实验库暂无内容" noDataType='1' v-if="!isHasData"></nodata>
        </div>
    </div>
    <!--删除实验弹出框-->
    <el-dialog :visible.sync="isDelete" width="500px">
      <div slot="title" class="dialog_header">警告!</div>
      <div class="confirm_dialog_body">
        <p class="dialog_mess">
          <span class="span_icon icon_waring">确定要删除当前实验吗？</span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <a class="btnDefault" @click="confirmDeleteExper">确 认</a>
        <a class="btnDefault" @click="isDelete = false">取 消</a>
      </div>
    </el-dialog>
    <newExperiment  ref="newExperiment"></newExperiment>
    <experimentDetail ref="experimentDetail"></experimentDetail>
</div>
</template>
<script>
import { findParentCategory,findChildCategory,findExperiment,deleteExperiment } from "@/API/api";
import newExperiment from '@/components/admin_new_experiment'
import experimentDetail from '@/components/experimentDetail'
import nodata from '@/components/noData'
export default {
    data(){
        return{
            inplaceholder:'请输入实验名称',
            customClass:'',//自定义分类
            i_customClass:'',//自定义分类,
            ii_customClass:'',//自定义分类
            options:[{value:'0',label:'区块链1'},{value:'1',label:'节点启动与暂停'}],
            options1:[],
            options2:[{value:'0',label:'区块链1'},{value:'1',label:'节点启动与暂停'}],
            total:0,//总共条数
            perPage:15,//每页页数
            curPage:1,//当前页
            experimentList:[
              //  {id:'52dddz',name:'模拟启动一条真实链',duration:'45分钟',num:'1'}
            ],
            isDelete:false,//删除实验弹出框
            isNewExperiment:false,
            cateId:'',//查询的分类ID
            searchTx:'',//搜索的关键字
            deleteExperId:'',//需要删除的实验ID
            experId:'',//获取详情点击的id
            isHasData:true,//是否有数据 默认有数据
        }
    },
    created(){
        this.findParentCategory()
        this.findExperiment(1)
    },
    components:{newExperiment,experimentDetail,nodata},
    methods:{

        //自定义分类
        selectType(val){
          let that = this
          that.cateId  =val
          that.i_customClass = ''
          that.findChildCategory(val)
          that.findExperiment(1)
          console.log(that.customClass)

        },
        //自定义分类
        selectType1(val){
          let that = this
          that.cateId = val
          that.findExperiment(1)

        },
        //自定义分类
        selectType2(val){

        },
         //底部分页
        handleCurrentChange(val) {
        let that = this;
        that.findExperiment(val)
        console.log(`当前页: ${val}`);
        },
        //删除前获取实验id
        deleteExper(experId){
          let that = this
          that.deleteExperId = experId
          that.isDelete=true

        },
        //实验确认删除
        confirmDeleteExper(){
          let that = this
          that.isDelete = false
          let obj={}
          obj.id=that.deleteExperId
          deleteExperiment(obj).then(res=> {
                if(res.code==200){
                   that.findExperiment(1)
                }else{
                   console.log(res.message)
                   that.$toast(res.message,3000)
                }
            })

        },
        //点击新增实验
        click_new(){
          let that = this;
          that.isNewExperiment = true;
          that.$refs.newExperiment.click_new();

        },
        //查看实验详情
        link_Detail(experId){
          let that = this;
          that.isNewExperiment = true;
          that.experId = experId
          that.$refs.experimentDetail.click_Detail(experId);

        },
        //输入关键字查询列表
        doSearch(){
          let that  =this
          that.findExperiment(1)

        },
        //获取一级分类
        findParentCategory(){
          let that = this
          findParentCategory().then(res=> {
                if(res.code==200){
                   that.options = res.data

                }else{
                    that.$toast(res.message,3000)
                }
            })
        },
        //根据一级分类id查询二级分类
        findChildCategory(cateId){
          let that = this
          let obj={}
          obj.parent_category_id = cateId
          findChildCategory(obj).then(res=> {
                if(res.code==200){
                   that.options1 = res.data
                }else{
                    that.$toast(res.message,3000)
                }
            })

        },
        //查询实验列表
        findExperiment(page){
          let that  = this
          that.curPage=page
          let obj={}
          obj.category_id = that.cateId
          obj.name= that.searchTx
          obj.perPage =that.perPage
          obj.page = page
          findExperiment(obj).then(res=> {
                if(res.code==200){
                   console.log(res.data)
                   that.experimentList  =res.data.list
                   res.data.total==0 ? that.isHasData = false :that.isHasData = true
                   for (let index = 0; index <  that.experimentList.length; index++) {
                    that.experimentList[index].pic_url = that.$store.state.pic_Url+ that.experimentList[index].pic_url

                   }
                   that.total = res.data.total

                }else{
                    that.$toast(res.message,3000)
                }
            })
        },





    }
}
</script>
<style lang="less" scoped>
@import url(../../assets/less/admin.less);

</style>
