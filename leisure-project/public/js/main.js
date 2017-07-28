/* globals $, io  */

$('.button-collapse').sideNav();

const socket = io.connect();

socket.on('conneting user', () => {
    socket.emit('connected user', $('#username').text());
});

socket.on('notification', () => {
    console.log('new message recieved!');
});
