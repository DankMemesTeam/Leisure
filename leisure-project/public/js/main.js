/* globals $, io  */

$('.button-collapse').sideNav();

$(document).ready(() => {
  $('ul.tabs.pagination').tabs();
  $('ul.tabs.pagination').tabs('select_tab', 'tab_id');

  $('.modal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: 0.5, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '4%', // Starting top style attribute
        endingTop: '10%', // Ending top style attribute
        ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
        },
        complete: function() { }, // Callback for Modal close
    });
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
