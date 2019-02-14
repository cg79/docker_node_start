//mocha -R spec
const server = require("../server");
var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://localhost:3001';

var options = {
    transports: ['websocket'],
    'force new connection': true
};

console.clear();
jest.setTimeout(30000);
// console.log = function(x) {
//     return;
// }

var chatUser1 = {_id: '1',name: 'Tom'};
var chatUser2 = {_id: '2','name': 'Sally'};
var chatUser3 = {_id: '3','name': 'Dana'};

const rndchr = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1);
createRoom = (data) => (
return 
{
    name : rndchr(),
    users: [],
    joinRoom: () => {

    },
    leaveRoom: () => {

    },
});

describe("Chat Server", function () {
    it('Should broadcast new user to all users', function (done) {
        var client1 = io.connect(socketURL, options);

        client1.on('connect', function (data) {
            const name = rndchr();

            /* Since first client is connected, we connect
             the second client. */
            var client2 = io.connect(socketURL, options);

            client2.on('connect', function (data) {
                client1.emit('my name', {name});
            });

            client2.on('serverMessage', function (msg) {
                console.log(msg);
                msg.data.name.should.equal(name);
                client2.disconnect();
                done();
            });

        });

    });


    it('Should join room', function (done) {
        var client1 = io.connect(socketURL+"/rooms", options);
        var client2 = io.connect(socketURL+"/rooms", options);

        var room = createRoom();
        var roomId = null;

        client1.on('connect', function (data) {
            console.log('conectedddddddddddddddddddddddddddddddddddddddddd');
            client1.on('serverMessage', function (msg) {
                console.log('xxxxxxxxxxxxxxxxxxx');
                console.log(msg);
                msg.evtName.should.equal('roomAdded');
                roomId = msg.data._id;

                client1.emit('joinRoom', 
                {
                    room_id: msg.data._id,
                    user:chatUser1
                });
                
            });

            client1.on('joinRoom', function (msg) {
                    // console.log(msg);
                    msg.room_id.should.equal(roomId);

                    client1.emit('leaveRoom', 
                    {
                        room_id:msg.room_id,
                        user:chatUser1
                    });
                
                });

            client1.on('leaveRoom', function (msg) {
                    console.log('zzzzzzzzzzzzzz');
                    console.log(msg);
                    msg.room_id.should.equal(roomId);

                    done();
                
                });

            client1.emit('createRoom', {name:rndchr()});
            // done();

        });
    });


    var waitNMiliSecconds = (sec, callback, param) => {
                    console.log('before waitNSecconds ',sec);
                    setTimeout(() =>
                    { 
                        console.log('client waitNSecconds');
                        if(callback) {
                            callback(param);
                        }

                    }, sec);
                };

    it('Should join room and mark as ready', async (done) => {
        var client1 = io.connect(socketURL+"/rooms", options);
        var client2 = io.connect(socketURL, options);
        var roomId = null;

        client1.on('connect', function (data) {
            console.log('conectedddddddddddddddddddddddddddddddddddddddddd');
            client1.on('serverMessage', function (msg) {
                console.log('xxxxxxxxxxxxxxxxxxx');
                console.log(msg);
                msg.evtName.should.equal('roomAdded');
                roomId = msg.data._id;

                client1.emit('joinRoom', 
                {
                    room_id: msg.data._id,
                    user:chatUser1
                });
                
            });

            client1.on('joinRoom', function (msg) {
                    // console.log(msg);
                    msg.room_id.should.equal(roomId);

                    client1.emit('ready', 
                    {
                        room_id:msg.room_id,
                        user:chatUser1
                    });
                
                });

            client1.on('ready', async (msg) => {
                    console.log('vvvvvvvvvvv');
                    console.log(msg);
                    msg.room_id.should.equal(roomId);

                    

                    // done();
                
                });

            client1.on('allReady', function (msg) {
                    console.log('allReady');
                    // console.log(msg);
                    // msg.room_id.should.equal(roomId);
                });

            client1.on('question', function (msg) {
                    console.log('question ', msg);
                    // console.log(msg);
                    // msg.room_id.should.equal(roomId);
                    waitNMiliSecconds(1520, (data) => {
                        console.log('after 1520 ', data);
                        const ddd = {
                            user_id: chatUser1._id,
                            question_id:data._id, 
                            room_id:data.room._id, 
                            answer_id: Math.floor(Math.random()*3)+1
                        };
                        client1.emit('receiveAnswer', ddd);
                    }, msg);
                    // done();
                
                });

                client1.on('game_results', function (msg) {
                    console.log('game_results');
                    // console.log(msg);
                    // msg.room_id.should.equal(roomId);
                    
                    done();
                
                });
            client1.emit('createRoom', {name:rndchr()});
            // done();

        });
        await new Promise(resolve => setTimeout(resolve, 60 *1000));
    }, 60 *1000);

    // it('Should be able to broadcast messages', function (done) {
    //     var client1, client2, client3;
    //     var message = 'Hello World';
    //     var messages = 0;
    //
    //     var checkMessage = function (client) {
    //         client.on('message', function (msg) {
    //             message.should.equal(msg);
    //             client.disconnect();
    //             messages++;
    //             if (messages === 3) {
    //                 done();
    //             }
    //             ;
    //         });
    //     };
    //
    //     client1 = io.connect(socketURL, options);
    //     checkMessage(client1);
    //
    //     client1.on('connect', function (data) {
    //         client2 = io.connect(socketURL, options);
    //         checkMessage(client2);
    //
    //         client2.on('connect', function (data) {
    //             client3 = io.connect(socketURL, options);
    //             checkMessage(client3);
    //
    //             client3.on('connect', function (data) {
    //                 client2.send(message);
    //             });
    //         });
    //     });
    // });
    //
    //
    // it('Should be able to send private messages', function (done) {
    //     var client1, client2, client3;
    //     var message = {to: chatUser1.name, txt: 'Private Hello World'};
    //     var messages = 0;
    //
    //     var completeTest = function () {
    //         messages.should.equal(1);
    //         client1.disconnect();
    //         client2.disconnect();
    //         client3.disconnect();
    //         done();
    //     };
    //
    //     var checkPrivateMessage = function (client) {
    //         client.on('private message', function (msg) {
    //             message.txt.should.equal(msg.txt);
    //             msg.from.should.equal(chatUser3.name);
    //             messages++;
    //             if (client === client1) {
    //                 /* The first client has received the message
    //                  we give some time to ensure that the others
    //                  will not receive the same message. */
    //                 setTimeout(completeTest, 40);
    //             }
    //             ;
    //         });
    //     };
    //
    //     client1 = io.connect(socketURL, options);
    //     checkPrivateMessage(client1);
    //
    //     client1.on('connect', function (data) {
    //         client1.emit('connection name', chatUser1);
    //         client2 = io.connect(socketURL, options);
    //         checkPrivateMessage(client2);
    //
    //         client2.on('connect', function (data) {
    //             client2.emit('connection name', chatUser2);
    //             client3 = io.connect(socketURL, options);
    //             checkPrivateMessage(client3);
    //
    //             client3.on('connect', function (data) {
    //                 client3.emit('connection name', chatUser3);
    //                 client3.emit('private message', message)
    //             });
    //         });
    //     });
    // });


});

