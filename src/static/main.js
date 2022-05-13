let chatterCount = 0;
let socket = io();
let nameOfTheUser;
/*
* function to display total number of chatter in the lobby.
*/
$.get('/getChatters', (response) => {
    $('.chat-info').text('There are currently ' + response.length + ' people in the chat room');
    chatterCount = response.length;
});


/*
*  Onclick event to join the chat.
*/
$('#joinChat').click(() => {

    const username = $.trim($('#username').val());
    if (username === '') {
        alert('Input proper username');
        return;
    }
    nameOfTheUser = username;
    $.ajax({
        url: '/join',
        type: 'POST',
        data: {
            username: username
        },
        success: (response) => {
            if (response.status === 'OK') {
                socket.emit('updateChatterCount', {
                    'action': 'increase'
                });
                $('.chat').show();

                $.get('/getMessages', (response) => {
                    if (response.length > 0) {
                        const message_count = response.length;
                        let html = '';
                        for (item of [...Array(message_count).keys()]) {
                            const finalUsername = username === response[item].sender ? 'me' : response[item].sender;
                            if (finalUsername === 'me') {
                                html +=
                                '<div class=\'card border-danger w-40\' style=\'float: right;margin-right:5px;margin-top:5px;\'>' +
                                '<div class=\'card-body\'>' +
                                '<div class=\'msg\'>' +
                                '<div class=\'user\' style=\'color: rgb(203,65,84);float:right\'>'
                                + finalUsername +
                                '</div><br>' +
                                '<div class=\'txt\' style=\';float:right\'>'
                                + response[item].message +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '<br>' + '<br>' + '<br>' + '<br>';
                            }
                            else {
                                html +=
                                    '<div class=\'card border-danger w-40\' style=\'float: left;margin-left:5px;margin-top:5px;\'>' +
                                    '<div class=\'card-body\'>' +
                                    '<div class=\'msg\'>' +
                                    '<div class=\'user\' style=\'color: maroon;float: left;\'>'
                                    + finalUsername +
                                    '</div><br>' +
                                    '<div class=\'txt\'>'
                                    + response[item].message +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '<br>' + '<br>' + '<br>' + '<br>';
                            }
                        }
                        $('.messages').html(html);
                    }
                });
                $('.join-chat').hide();
            } else if (response.status === 'FAILED') {
                alert('Sorry but the username already exists, please choose another one');
                $('#username').val('').focus();
            }
        }
    });
});

/*
* Onclick event to leave the chat.
*/
$('#leaveChat').click(() => {
    const username = nameOfTheUser;
    $.ajax({
        url: '/leave',
        type: 'POST',
        dataType: 'json',
        data: {
            username: username
        },
        success: (response) => {
            if (response.status === 'OK') {
                socket.emit('quitChat', {
                    'message': ' ' + username + ' has left the chat room..'
                });
                socket.emit('updateChatterCount', {
                    'action': 'decrease'
                });
                $('.chat').hide();
                $('.join-chat').show();
                $('#username').val('');
                alert('You have successfully left the chat room');
            }
        }
    });
});


/*
*   Onclick event to send messages.
*/
$('#sendMessage').click(() => {

    const username = nameOfTheUser;
    const message = $.trim($('#message').val());
    if (message === '') {
        alert('Message can not be empty!');
        return;
    }
    $.ajax({
        url: '/sendMessage',
        type: 'POST',
        dataType: 'json',
        data: {
            'username': username,
            'message': message
        },
        success: (response) => {
            if (response.status === 'OK') {
                socket.emit('message', {
                    'username': username,
                    'message': message
                });
                $('#message').val('');
            }
        }
    });
});

socket.on('leaveChat', (data) => {

    const message = data.message;

    let html = '<div class=\'msg\'>' + '<div class=\'txt\' style=\'color: maroon;text-align:center\'>' + message + '</div></div>';
    $('.messages').append(html);
});


socket.on('send', (data) => {

    const username = data.username;
    const message = data.message;
    const finalUsername = username === nameOfTheUser ? 'me' : username;
    if (finalUsername === 'me') {
        let html =
            '<div class=\'card border-danger w-40\' style=\'float: right;margin-right:5px;margin-top:5px;\'>' +
            '<div class=\'card-body\'>' +
            '<div class=\'msg\'>' +
            '<div class=\'user\' style=\'color: rgb(203,65,84);float:right\'>'
            + finalUsername +
            '</div><br>' +
            '<div class=\'txt\' style=\';float:right\'>'
            + message +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<br>' + '<br>' + '<br>' + '<br>';
        $('.messages').append(html);
    }
    else {
        let html =
            '<div class=\'card border-danger w-40\' style=\'float: left;margin-left:5px; margin-top:5px;\'>' +
            '<div class=\'card-body\'>' +
            '<div class=\'msg\'>' +
            '<div class=\'user\' style=\'color: maroon;float: left;\'>'
            + finalUsername +
            '</div><br>' +
            '<div class=\'txt\'>'
            + message +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<br>' + '<br>' + '<br>' + '<br>';
        $('.messages').append(html);
    }
});
socket.on('countChatters', (data) => {
    if (data.action === 'increase') {
        chatterCount++;
    } else {
        chatterCount--;
    }
    $('.chat-info').text('There are currently ' + chatterCount + ' people in the chat room');
});


