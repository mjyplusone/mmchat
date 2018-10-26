var ws = require('nodejs-websocket');

var server = ws.createServer(function(conn) {
    console.log('new connection');

    conn.on('text', function(str) {
        var message = JSON.parse(str);
        console.log(message);

        var res = {};

        if (message.type === 'nickname') {
            conn.nickName = message.msg;
            res.type = 'nickname';
            res.nickName = conn.nickName;
            res.msg = conn.nickName;
            broadcast(JSON.stringify(res));
        } else if (message.type === 'msg') {
            res.type = 'msg';
            res.nickName = conn.nickName;
            res.msg = message.msg;
            broadcast(JSON.stringify(res));
        } else if (message.type === 'left') {
            console.log(conn.nickName + ' close');
            conn.close();
        } else if (message.type === 'info') {
            res.type = 'info';
            res.count = server.connections.length;
            res.members = [];
            server.connections.forEach((conn) => {
                res.members.push(conn.nickName);
            });
            broadcast(JSON.stringify(res));
        }
    });

    conn.on('close', function(code, reason) {
        console.log('connection closed.');

        var res = {};
        res.type = 'left';
        res.nickName = conn.nickName;
        res.msg = conn.nickName;
        broadcast(JSON.stringify(res));
    });

    conn.on('error', function(err) {
        console.log(err);
    })
}).listen(8081);

console.log('WebSocket server is listening on port 8081.');

function broadcast(str) {
    console.log(server.connections.length);
    server.connections.forEach((conn) => {
        console.log(conn.nickName);
        conn.sendText(str);
    });
}