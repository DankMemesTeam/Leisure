module.exports = ({ userData, eventData, chatData }) => {
    return {
        loadEventsPage(req, res) {
            let loadEvents = null;

            if (!req.query.query) {
                loadEvents = eventData.getAllEvents();
            } else {
                loadEvents = eventData.getEventsBy(req.query.query);
            }

            loadEvents
                .then((events) => {
                    res.render('event/event-page',
                        { currentUser: req.user.username, events: events });
                });
        },
        loadCreationPage(req, res) {
            res.render('event/event-create');
        },
        loadEventDetailsPage(req, res) {
            eventData.getEventById(req.params.eventId)
                .then((event) => {
                    res.render('event/event-details',
                        { currentUser: req.user.username, event: event });
                });
        },
        createEvent(req, res) {
            const eventObj = {
                title: req.body.title,
                description: req.body.description,
                creator: req.user.username,
                participants: [req.user.username],
            };

            let chatPromise = Promise.resolve(null);
            // SHOULD be able to create event chat after event is created also
            if (req.body.addChat) {
                chatPromise = chatData
                    .createEventChatroom([req.user.username],
                    'event', req.body.chatTitle);
            }

            chatPromise
                .then((chat) => {
                    return eventData.createEvent(eventObj, chat.chatTitle || null);
                })
                .then((event) => {
                    req.toastr.success('Successfully created event!');
                    res.redirect('/events');
                })
                .catch((err) => {
                    // Should not redirect when error
                    req.toastr.error(err);
                    res.redirect('/events/create');
                });
        },
        createEventChat(req, res) {
            // eventData.getEventById(// id)
            // chatData.createEventChatroom()

            // then assign all event participants to chat and make event chatTitle = new ChatTitle
        },
    };
};
