<template>  
    <div class="userlist-container">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 用户列表主体 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear='getUserList'>
                        <el-button type="primary" slot="append" icon="el-icon-search" @click="getUserList">搜索</el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addUserDialog = true">添加用户</el-button>
                </el-col>
            </el-row>
        </el-card>
        <!-- 用户列表表格 -->
        <el-table
            :data="userList" border stripe style="width: 100%">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="password" label="密码"></el-table-column>
            <el-table-column prop="role" label="角色"></el-table-column>
            <el-table-column
                label="状态">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.state"
                        active-color="#339cff"
                        inactive-color="#dedfea">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作">
                <template slot-scope="scope">
                    <!-- 修改 -->
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row)"></el-button>
                    <!-- 删除 -->
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row)"></el-button>
                    <!-- 权限 -->
                    <el-tooltip effect="dark" content="分配权限" placement="top-start" :enterable='false'>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="updateUserState(scope.row)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table> 
        <div class="pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pageNum"
                :page-sizes="[3,5,10]"
                :page-size="queryInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalNum">
            </el-pagination>
        </div>
        <!-- 新增用户对话框 -->
        <el-dialog title="添加用户" :visible.sync="addUserDialog" :before-close="resetFields" width="30%">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" >
                <el-form-item label="用户名" label-width="100px" prop="username">
                    <el-input v-model="ruleForm.username"></el-input>
                </el-form-item> 
                <el-form-item label="邮箱" label-width="100px" prop="email">
                    <el-input v-model="ruleForm.email"></el-input>
                </el-form-item> 
                <el-form-item label="密码" label-width="100px" prop="password">
                    <el-input v-model="ruleForm.password"></el-input>
                </el-form-item> 
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetFields">取 消</el-button>
                <el-button type="primary" @click="addUserSubmit('ruleForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑用户对话框 -->
        <el-dialog title="编辑用户" :visible.sync="updateUserDialog" :before-close="resetFields1" width="30%">
            <el-form :model="ruleForm1" :rules="rules" ref="ruleForm1" >
                <el-form-item label="用户名" label-width="100px" prop="username">
                    <el-input v-model="ruleForm1.username"></el-input>
                </el-form-item> 
                <el-form-item label="邮箱" label-width="100px" prop="email">
                    <el-input v-model="ruleForm1.email"></el-input>
                </el-form-item> 
                <el-form-item label="密码" label-width="100px" prop="password">
                    <el-input v-model="ruleForm1.password"></el-input>
                </el-form-item> 
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetFields1">取 消</el-button>
                <el-button type="primary" @click="updateUserSubmit('ruleForm1')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        var validateEmail = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入邮箱'));
            } else {
                if (!/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/.test(value)) {
                    callback(new Error('邮箱格式不正确'))
                }
                callback();
            }
        };
        return {
            // 查询信息实体，对应java实体类
            queryInfo:{
                query:'',
                pageNum:1,
                pageSize:5
            },
            userList:[], //用户列表
            totalNum:0,  //总记录数
            addUserDialog:false,
            updateUserDialog:false,
            // 添加用户校验
            ruleForm:{
                username:'',
                email:'',
                password:''
            },
            // 编辑用户校验
            ruleForm1:{
                id:1,
                username:'',
                email:'',
                password:''
            },
            // 表单校验规则
            rules:{
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
                ],
                email: [
                    { validator: validateEmail, trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
                ],
            }
        }
    },
    created(){
        this.getUserList();
    },
    methods:{
        async getUserList(){
            const {data:res} = await this.$http.get('getAllUser',{params:this.queryInfo});
            this.userList = res.userList;
            this.totalNum = res.totalNum;
        },
        // 分页器pageSize改变
        handleSizeChange(newPageSize){
            this.queryInfo.pageSize = newPageSize;
            this.getUserList();
        },
        // 分页器pageNum改变
        handleCurrentChange(newPageNum){
            this.queryInfo.pageNum = newPageNum;
            this.getUserList();
        },
        // 改变用户状态
        async updateUserState(rowData){
            const params = {
                id: rowData.id,
                state: !rowData.state
            };
            const {data:res} = await this.$http.get('updateState',{params});
            if(res.flag === '更新用户状态成功'){
                rowData.state = !rowData.state;
                return this.$message.success('操作成功');
            };
            this.$message.error('操作失败');
        },
        // 重置表单
        resetFields(){
            this.$refs.ruleForm.resetFields();
            this.addUserDialog = false;
        },
        resetFields1(){
            this.$refs.ruleForm1.resetFields();
            this.updateUserDialog = false;
        },
        // 添加用户
        addUserSubmit(formName){
            this.$refs[formName].validate(async valid => {
                if(valid){
                    const {data:res} = await this.$http.post('addUser',this.ruleForm);
                    if(res === 'success'){
                        this.getUserList();
                        this.resetFields();
                        return this.$message.success('新用户添加成功');
                    }
                    this.$message.error('新用户添加失败');
                }
            })
        },
        // 删除用户
        async deleteUser(rowData){
            const confirm = await this.$confirm('确定永久删除该用户吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            if(confirm === 'confirm') {
                const {data:res} = await this.$http.get('deleteUser',{params:{id:rowData.id}});
                if(res === 'success') {
                    this.getUserList();
                    return this.$message.success('删除成功');
                }
                this.$message.error('删除失败')
            }else{
                this.$message.info('取消删除');
            }
        },
        // 点击得到编辑用户弹窗并复制给输入框
        editUser(rowData){
            this.ruleForm1.id = rowData.id;
            this.ruleForm1.username = rowData.username;
            this.ruleForm1.email = rowData.email;
            this.ruleForm1.password = rowData.password;
            this.updateUserDialog = true;
        },
        // 编辑用户
        updateUserSubmit(formName){
            this.$refs[formName].validate(async valid => {
                if(valid){
                    const {data:res} = await this.$http.post('updateUserInfo',this.ruleForm1);
                    if(res === 'success'){
                        this.getUserList();
                        this.resetFields1();
                        return this.$message.success('用户修改成功');
                    }
                    this.$message.error('用户修改失败');
                }
            })
        }
    }
}
</script>

<style scoped>
    .el-breadcrumb{
        margin-bottom: 15px;
        font-size: 17px;
    }
    .el-card{
        box-shadow: 0 1px 1px rgba(0, 8, 10, 0.15) !important;
    }
    .pagination{
        display: flex;
        justify-content: flex-end;
        margin-top: 15px;
    }
    
</style>