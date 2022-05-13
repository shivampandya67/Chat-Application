/*
* Imported libraries
*/
import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import redis from 'redis';
import path from 'path';
import Router from './src/routes/Routes'
import * as consolidate from 'consolidate';
const engines = consolidate;
const app = express();
const server = require('http').createServer(app);
const io = require("socket.io")(server, {
    allowEIO3: true
});

dotenv.config();

/*
* Creating a redisClient
*/
const redisConfig: redis.ClientOpts = {};

redisConfig.host = process.env.REDIS_HOST;
redisConfig.port = parseInt(`${process.env.REDIS_PORT}`);
export const redisClient = redis.createClient(redisConfig);

redisClient.once('ready', () => {
    redisClient.get('chatUser', (err, reply) => {
        if (err) { console.log(err); }
        if (reply) {
            chatters = JSON.parse(reply);
        }
    })

    redisClient.get('chatAppMessage', (err, reply) => {
        if (err) { console.log(err); }
        if (reply) {
            chatMessages = JSON.parse(reply);
        }
    })
})

/*
* Creation of port and listening to it
*/
const port = process.env.PORT;

server.listen(port, () => {
    console.log('Server Started. Listening on :', port);
});


/*
* Store people in chatroom
*/
export let chatters: string[] = [];

/*
* Store messages in chatroom
*/
export let chatMessages: object[] = [];


/*
* Express middleware
*/
app.use(express.json());
app.set('views', 'F:/Work/shivam_p/nodejs/chatApplication/src/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.use("/static", express.static('./static/'));
app.use(express.static(path.join(__dirname, 'src')));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', Router);

/*
*   Socket connection
*/
io.on('connection', (socket: any) => {

    socket.on('connectError', (err: any) => {
        console.log(`connect_error due to ${err.message}`);
    });

    socket.on('message', (data: string) => {
        io.emit('send', data);
    });

    socket.on('quitChat', (data: string) => {
        io.emit('leaveChat', data);
    })

    socket.on('updateChatterCount', (data: string) => {
        io.emit('countChatters', data);
    });
});
