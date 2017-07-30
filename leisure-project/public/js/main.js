/* globals $, io  */

$('.button-collapse').sideNav();

$(document).ready(() => {
  $('ul.tabs').tabs();
  $('ul.tabs').tabs('select_tab', 'tab_id');
});

const updateNotifications = (badgeValue) => {
  const badge = $('#notifications');
  const navBadge = $('#notifications-nav');

  badge.text(badgeValue);
  navBadge.text(badgeValue);

  if (+badge.text() !== 0) {
    navBadge.removeClass('hidden');
    badge.removeClass('hidden');
  } else {
    navBadge.addClass('hidden');
    badge.addClass('hidden');
  }
};

const socket = io.connect();

socket.on('conneting user', () => {
  socket.emit('connected user', $('#username').text());
});

socket.on('notification', (data) => {
  updateNotifications(data.notificationsLength);
});
