import express from 'express';
import { joinChat, leaveChat, sendAndStoreMessage, homepage, getMessages, getChatters } from '../services/ChatServices';

const Router = express.Router();

/*
* Render main HTML file
*/
Router.get('/', homepage);


/*
* Join Chat
*/
Router.post('/join', joinChat);

/*
*  Leave Chat
*/
Router.post('/leave', leaveChat);

/*
*  Send and Store Message
*/
Router.post('/sendMessage', sendAndStoreMessage);

/*
*  Get Messages
*/
Router.get('/getMessages', getMessages);

/*
*  Get Chatters
*/
Router.get('/getChatters', getChatters);

export default Router;