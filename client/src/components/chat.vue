<template>
    <div class="chat">
        <div class="title">
            <i class="fa fa-angle-left" @click="back"></i>
            <span>佳仪是天才</span>
            <i class="more" @click="openSide">...</i>
        </div>
        <div id="tip" v-show="isShowTip"></div>
        <div id="message">
            <!-- <div class="msg">
                <div class="avatar">冒</div>
                <div class="content">
                    <div class="nickname">冒佳仪</div>
                    <div class="text">这里是内容啊哈哈哈哈哦吼吼吼吼</div>
                </div>
            </div>
            <div class="msg msgmyself">
                <div class="avatar">冒</div>
                <div class="content">
                    <div class="nickname">冒佳仪</div>
                    <div class="text">这里是内容啊哈哈哈哈哦吼吼吼吼</div>
                </div>
            </div> -->
        </div>
        <div class="send">
            <div contenteditable="true" class="sendbox" id="sendText"></div>
            <input type="button" value="发送" id="sendBtn">
        </div>
        <transition name="slide">
        <div class="sider" v-show="isShowSide">
            <div class="title">
                <i class="fa fa-angle-left" @click="closeSide"></i>
                <span>聊天信息({{ count }})</span>
            </div>
            <ul>
                <li v-for="(member, index) in members" v-bind:key="index">
                    <div class="avatar"><span class="text">{{ member.slice(0, 1) }}</span></div>
                    <div class="nickname">{{ member }}</div>
                </li>
            </ul>
        </div>
        </transition>
    </div>
</template>

<script>
export default {
    data () {
        return {
            ws: null,
            isShowTip: false,
            message: {},
            isShowSide: false,
            count: 0,
            members: []
        };
    },
    mounted () {
        this.initWebSocket();
        // 滚动条处理
        var message = document.getElementById('message');
        message.scrollTop = message.scrollHeight;
    },
    methods: {
        back () {
            // left
            this.message = {};
            this.message.type = 'left';
            this.ws.send(JSON.stringify(this.message));
            this.$router.push({
                path: '/'
            });
        },
        initWebSocket () {
            this.ws = new WebSocket('ws://39.106.208.211:8081');
            this.ws.onopen = this.wsOpen;
            this.ws.onmessage = this.wsMessage;
            this.ws.onclose = this.wsClose;
            this.ws.onerror = this.wsError;
        },
        wsOpen () {
            console.log('connected.');

            // 发送昵称给server
            this.message = {};
            this.message.type = 'nickname';
            this.message.msg = sessionStorage.getItem('nickName');
            if (this.message.msg) this.ws.send(JSON.stringify(this.message));

            // 按键发送的监听事件
            document.getElementById('sendBtn').onclick = this.send;

            // 回车发送的监听事件
            document.onkeydown = function (e) {
                e = e || window.event;
                if (e.keyCode === 13) {
                    document.getElementById('sendBtn').onclick();
                    return false;
                }
            };
        },
        wsMessage (e) {
            console.log(e.data);
            var res = JSON.parse(e.data);
            if (res.type === 'msg') {
                this.showMessage(res.nickName, res.msg);
            } else if (res.type === 'nickname') {
                this.showTip(res.msg + ' comes in');
            } else if (res.type === 'left') {
                this.showTip(res.msg + ' left');
            } else if (res.type === 'info') {
                this.count = res.count;
                this.members = res.members;
            }
        },
        wsClose () {
            console.log('close');
        },
        wsError () {
            console.log('error');
        },
        send () {
            this.message = {};
            this.message.type = 'msg';
            this.message.msg = document.getElementById('sendText').innerText;
            if (this.message.msg) this.ws.send(JSON.stringify(this.message));
            document.getElementById('sendText').innerText = '';
        },
        showTip (tip) {
            document.getElementById('tip').innerHTML = tip;
            this.isShowTip = true;
            setTimeout(() => {
                this.isShowTip = false;
            }, 3000);
        },
        showMessage (nickName, msg) {
            if (nickName === sessionStorage.getItem('nickName')) {
                let html = '<div class="msg msgmyself">' +
                                '<div class="avatar">' + nickName.slice(0, 1) + '</div>' +
                                '<div class="content">' +
                                    '<div class="nickname">' + nickName + '</div>' +
                                    '<div class="text">' + msg + '</div>' +
                                '</div>' +
                            '</div>';
                let div = document.createElement('div');
                div.innerHTML = html;
                document.getElementById('message').appendChild(div);
            } else {
                let html = '<div class="msg">' +
                                '<div class="avatar">' + nickName.slice(0, 1) + '</div>' +
                                '<div class="content">' +
                                    '<div class="nickname">' + nickName + '</div>' +
                                    '<div class="text">' + msg + '</div>' +
                                '</div>' +
                            '</div>';
                let div = document.createElement('div');
                div.innerHTML = html;
                document.getElementById('message').appendChild(div);
            }
            // 滚动条处理
            var message = document.getElementById('message');
            message.scrollTop = message.scrollHeight;
        },
        openSide () {
            this.isShowSide = true;
            this.message = {};
            this.message.type = 'info';
            this.ws.send(JSON.stringify(this.message));
        },
        closeSide () {
            this.isShowSide = false;
        }
    }
};
</script>

<style>
    .chat {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #ebebeb;
    }
    .chat .title {
        position: relative;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #1d9d74;
        color: white;
    }
    .chat .title .fa-angle-left {
        position: absolute;
        left: 10px;
        top: 5px;
        font-size: 30px;
    }
    .chat .title .more {
        position: absolute;
        right: 10px;
        top: -5px;
        font-size: 25px;
    }
    .chat #tip {
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        padding: 3px 10px;
        border-radius: 15px;
        font-size: 14px;
        background: rgba(0, 0, 0, 0.3);
        z-index: 1;
    }
    .chat #message {
        position: absolute;
        top: 40px;
        bottom: 50px;
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        overflow: auto;
    }
    .chat .msg {
        display: flex;
        width: 70%;
        margin-bottom: 15px;
    }
    .chat .msg .avatar {
        width: 30px;
        height: 30px;
        margin-right: 15px;
        text-align: center;
        line-height: 30px;
        border-radius: 50%;
        background: #4fc08d;
        color: white;
    }
    .chat .msg .content {
        flex: 1;
        font-size: 14px;
    }
    .chat .msg .nickname {
        margin-bottom: 5px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.5);
    }
    .chat .msg .text {
        position: relative;
        display: inline-block;
        padding: 10px;
        background: #f4f4f6;
    }
    .chat .msg .text::before {
        position: absolute;
        content: '';
        left: -16px;
        top: 10px;
        border: 8px solid;
        border-color: transparent #f4f4f6 transparent transparent;
    }
    .chat .msgmyself {
        flex-direction: row-reverse;
        float: right;
    }
    .chat .msgmyself .avatar {
        margin: 0;
        margin-left: 15px;
    }
    .chat .msgmyself .nickname {
        text-align: right;
    }
    .chat .msgmyself .text {
        float: right;
    }
    .chat .msgmyself .text::before {
        left: 100%;
        right: -16px;
        border-color: transparent transparent transparent #f4f4f6;
    }
    .chat .send {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 45px;
        background: #f4f4f6;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
    .chat .send .sendbox {
        position: absolute;
        left: 10px;
        right: 90px;
        top: 7px;
        bottom: 7px;
        padding: 0 5px;
        line-height: 30px;
        border: 1px solid #ccc;
        overflow: auto;
    }
    .chat .send input[type="button"] {
        position: absolute;
        right: 10px;
        width: 70px;
        top: 7px;
        bottom: 7px;
        border: none;
        background: #4fc08d;
        color: white;
    }
    .chat .sider {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #f4f4f6;
    }
    .chat .sider.slide-enter-active, .chat .sider.slide-leave-active {
        transition: all 0.3s linear;
    }
    .chat .sider.slide-enter, .chat .sider.slide-leave-to {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 100%;
        right: -100%;
    }
    .chat .sider ul {
        padding: 20px 0;
        margin: 0;
        margin-left: 10px;
        overflow: hidden;
    }
    .chat .sider ul li {
        float: left;
        width: 20%;
        padding-right: 10px;
        margin-bottom: 20px;
        box-sizing: border-box;
        text-align: center;
        list-style: none;
    }
    .chat .sider li .avatar {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 100%;
        font-size: 30px;
        background: #4fc08d;
        color: white;
    }
    .chat .sider li .avatar .text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .chat .sider li .nickname {
        font-size: 12px;
    }
</style>
