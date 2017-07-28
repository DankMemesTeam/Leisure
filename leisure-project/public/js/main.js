/* globals $, io  */

$('.button-collapse').sideNav();

$(document).ready(function(){
  $('ul.tabs').tabs();
});

$(document).ready(function(){
  $('ul.tabs').tabs('select_tab', 'tab_id');
});

const socket = io.connect();

socket.on('conneting user', () => {
    socket.emit('connected user', $('#username').text());
});

socket.on('notification', () => {
    console.log('new message recieved!');
});
