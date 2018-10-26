<template>
    <div class="login">
        <h1>Chat</h1>
        <img src="../../static/dog.jpg" alt="">
        <p>请输入您的昵称</p>
        <input type="text" id="name"><br>
        <input type="button" value="进入聊天室" @click="goChat">
    </div>
</template>

<script>
export default {
    mounted () {
        sessionStorage.clear();
    },
    methods: {
        goChat () {
            var nickName = document.getElementById('name').value;
            if (nickName) {
                sessionStorage.setItem('nickName', nickName);
                this.$router.push({
                    path: '/chat'
                });
            } else {
                alert('请输入您的昵称');
            }
        }
    }
};
</script>

<style>
    .login {
        text-align: center;
        color: #4fc08d;
    }
    .login h1 {
        margin-top: 60px;
    }
    .login img {
        width: 200px;
        height: 200px;
    }
    .login p {
        margin-top: 50px;
    }
    .login input[type="text"] {
        padding: 2px 5px;
        border: 1px solid black;
    }
    .login input[type="button"] {
        margin-top: 50px;
        padding: 7px 15px;
        border: none;
        border-radius: 15px;
        background: #4fc08d;
        color: white;
    }
</style>
