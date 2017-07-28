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
                    res.render('event/event-details', { event: event });
                });
        },
        createEvent(req, res) {
            const eventObj = {
                title: req.body.title,
                description: req.body.description,
                creator: req.user.username,
                participants: [req.user.username],
            };

            Promise.all([eventData.createEvent(eventObj),
            chatData.createChatroom([req.user.username], 'event')])
                .then((results) => {
                    req.toastr.success('Successfully created event!');
                    res.redirect('/events');
                })
                .catch((err) => {
                    req.toastr.error('Oops, something went wrong!');
                });
        },
    };
};
