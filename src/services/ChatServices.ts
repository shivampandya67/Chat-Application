import express from 'express';
import { chatters, chatMessages } from '../..';
import { redisClient } from '../..';

export const homepage = async (req: express.Request, res: express.Response) => {
    __dirname = 'E:/Work/shivam_p/nodejs/chatApplication'
    res.sendFile('src/views/index.html', {
        root: __dirname
    });
}

export const joinChat = async (req: express.Request, res: express.Response) => {
    const username = req.body.username;
    if (chatters.indexOf(username) === -1) {
        chatters.push(username);
        redisClient.set('chatUsers', JSON.stringify(chatters));
        res.send({
            'chatters': chatters,
            'status': 'OK'
        });
    } else {
        res.send({
            'status': 'FAILED'
        });
    }
}

export const leaveChat = async (req: express.Request, res: express.Response) => {
    const username = req.body.username;
    chatters.splice(chatters.indexOf(username), 1);
    redisClient.set('chatUsers', JSON.stringify(chatters));
    res.send({
        'status': 'OK'
    });
}

export const sendAndStoreMessage = async (req: express.Request, res: express.Response) => {
    const username = req.body.username;
    const message = req.body.message;
    chatMessages.push({
        'sender': username,
        'message': message
    });
    redisClient.set('chatAppMessages', JSON.stringify(chatMessages));
    res.send({
        'status': 'OK'
    });
}

export const getMessages = async (_: express.Request, res: express.Response) => {
    res.send(chatMessages);
}

export const getChatters = async (_: express.Request, res: express.Response) => {
    res.send(chatters);
}

