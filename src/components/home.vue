<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <img src="../assets/logo.png">
            </div>
            <span>个人运动平台</span>
            <el-button type="info" @click="logout">安全退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="isCollapse?'60px':'200px'">
                <div class="home_collapse" @click='collapseClick'>|||</div>
                <el-menu
                    background-color="#545c64"
                    unique-opened
                    text-color="#fff"
                    :collapse='isCollapse'
                    :collapse-transition='false'
                    active-text-color="#ffd04b"
                    :default-active='activePath'
                    :router="true">
                    <!-- 一级菜单 -->
                    <!-- 设置了router支持路由跳转,根据:index绑定的数据来跳转 -->
                    <el-submenu v-for="item in mainMenu" :key="item.id" :index="item.path">
                        <template slot="title">
                            <i :class="iconArr[item.id]" class="home-menuIcon"></i>
                            <span>{{item.title}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item v-for="it in item.sList" :key="it.id" :index="it.path" @click="saveNavPath(it.path)">
                            <template slot="title">
                                <i :class="iconArr[it.id]" class="home-menuIcon"></i>
                                <span>{{it.title}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    methods:{
        // 安全退出
        logout (){
            window.sessionStorage.removeItem('user');
            this.$router.push('/');
        },
        // 获取侧边栏数据
        async getMenus(){
            const {data:res} = await this.$http.get('/getMenus');
            if(res.flag == 200){
                this.mainMenu = res.data;
            };
        },
        // 折叠侧边栏事件
        collapseClick(){
            this.isCollapse = !this.isCollapse;
        },
        saveNavPath(path){
            this.activePath = path;
            // 存储上次激活的菜单路径
            window.sessionStorage.setItem('activePath',JSON.stringify(this.activePath));
        }
    },
    created(){
        this.getMenus();
        // 去除上次激活的菜单路径
        this.activePath = JSON.parse(window.sessionStorage.getItem('activePath')) || '';
    },
    data(){
        return {
            // 左侧菜单列表
            mainMenu:[],
            // 是否折叠侧边栏
            isCollapse:false,
            // 侧边栏图标
            iconArr:{
                '100':'iconfont icon-guanliyuan',
                '200':'iconfont icon-yundong',
                '101':'iconfont icon-denglu-copy',
                '102':'iconfont icon-mima',
                '103':'iconfont icon-yundong',
                '104':'iconfont icon-shangpin',
                '201':'iconfont icon-shu',
                '202':'iconfont icon-qialuli',
                '203':'iconfont icon-shiwu',
                '204':'iconfont icon-denglu-copy',
            },
            // 当前激活菜单路径
            activePath:''
        }
    }
}
</script>

<style>
    .el-container{
        width: 100%;
        height: 100%;
    }
    .el-header{
        background: #373041;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        font-size: 14px;
    }
    .home_collapse{
        color: #fff;
        text-align: center;
        height: 30px;
        line-height: 30px;
        letter-spacing: .3em;
        cursor: pointer;
    }
    .el-aside{
        background: #333744;
    }
    .el-submenu__title{
        width: 200px;
    }
    .home-menuIcon{
        margin-right: 5px;
    }
    .el-main{
        background: #eaedf1;
    }
    img{
        width: 55px;
        height: 55px;
    }
</style>
