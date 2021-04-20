<template>
    <!-- 登录页面 -->
    <div class="login_container">
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/logo.png">
            </div>
            <!-- 登录表单区域 -->
            <el-form :model="loginForm" :rules="loginRules" ref="ruleForm" label-width="0px" class="login_form">
                <el-form-item prop="username" >
                    <el-input placeholder="请输入用户名" clearable v-model="loginForm.username" prefix-icon="iconfont icon-denglu-copy"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input placeholder="请输入密码" clearable v-model="loginForm.password" prefix-icon="iconfont icon-mima" show-password></el-input>
                </el-form-item>
                <el-form-item class="login_btns">
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button type="info" @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            loginForm: {
                username: '',
                password: ''
            },
            loginRules:{
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        submitForm (formName) {
            this.$refs[formName].validate(async valid=>{
                if(valid){
                    const {data:res} = await this.$http.post('login',this.loginForm);
                    if(res.flag === 'ok'){
                        this.$router.push('/home');
                        window.sessionStorage.setItem('user',JSON.stringify(res.user));
                        return this.$message.success('登录成功');
                    }
                    this.$message.error('用户名或密码错误');
                }
            })
        },
        resetForm (formName) {
            this.$refs[formName].resetFields();
        }
    }
}
</script>

<style scoped>
    .login_container{
        width: 100%;
        height: 100%;
        background: #27486e;
    }
    .login_box{
        width: 400px;
        height: 300px;
        background: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .avatar_box{
        width: 150px;
        height: 150px;
        box-sizing: border-box;
        border: 5px solid #04d1e9;
        border-radius: 50%;
        background: #fff;
        position: relative;
        top: -60px;
    }
    .avatar_box img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
    .login_form{
        width: 100%;
        box-sizing: border-box;
        padding: 0 10px;
        position: relative;
        top: -20px;
    }
    .login_btns{
        display: flex;
        justify-content: flex-end;
    }
</style>
