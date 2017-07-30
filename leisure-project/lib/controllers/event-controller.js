module.exports = ({ userData, eventData, chatData }) => {
    return {
        loadEventsPage(req, res) {
            const pageNumber = req.query.page || 1;

            let loadEvents = null;

            if (!req.query.query) {
                loadEvents = eventData.getAllEvents(pageNumber);
            } else {
                // Take care of paging
                loadEvents = eventData.getEventsBy(req.query.query, pageNumber);
            }

            loadEvents
                .then(([events, count, pageSize]) => {
                    res.render('event/event-page', {
                        currentUser: req.user || null,
                        events: events,
                        pageNumber,
                        pagesCount: Math.ceil(count / pageSize),
                        query: req.query.query,
                    });
                });
        },
        loadCreationPage(req, res) {
            if (req.user) {
                res.render('event/event-create');
            } else {
                res.redirect('/auth/login');
            }
        },
        loadEventDetailsPage(req, res) {
            eventData.getEventById(req.params.eventId)
                .then((event) => {
                    res.render('event/event-details',
                        { currentUser: req.user || null, event: event });
                });
        },
        createEvent(req, res) {
            const eventObj = {
                title: req.body.title,
                description: req.body.description,
                creator: req.user.username,
                participants: [req.user.username],
                location: {
                    address: req.body.address,
                    longitude: req.body.longitude,
                    latitude: req.body.latitude,
                },
            };            

            const apiKey = 'AIzaSyCLFJNN2PJekPGTkfqk_weQTi-u7HCOuaI';

            const lat = req.body.latitude;
            const long = req.body.longitude;

            const mapType = 'maptype=roadmap';
            const mapSize = 'size=1200x800';
            const zoom = 'zoom=17';
            const center = `center=${lat},${long}`;
            const marker = `&markers=color:red%7Clabel:C%7C${lat},${long}`;

            const googleMapsLink = `https://maps.googleapis.com/maps/api/staticmap?${mapSize}&${zoom}&${center}&${marker}&${mapType}&key=${apiKey}`;

            eventObj.location.mapUrl = googleMapsLink;

            let chatPromise = Promise.resolve(null);
            // SHOULD be able to create event chat after event is created also
            if (req.body.addChat) {
                chatPromise = chatData
                    .createEventChatroom([req.user.username],
                    'event', req.body.chatTitle);
            }

            chatPromise
                .then((chat) => {
                    return eventData.createEvent(eventObj, req.body.chatTitle || null);
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
        addEventChat(req, res) {
            eventData.addChatToEvent(req.params.eventId, req.body.chatTitle)
                .then((event) => {
                    return chatData.createEventChatroom(event.value.participants, 'event', req.body.chatTitle);
                })
                .then((chat) => {
                    res.json({ redirect: '/events/' + req.params.eventId });
                })
                .catch((err) => {
                    // should send json with the error message
                    req.toastr.error(err);
                    res.redirect('/events/' + req.params.eventId);
                });
        },
        addUserToEvent(req, res) {
            eventData.addUserToEvent(req.params.eventId, req.user.username)
                .then((event) => {
                    console.log(event);
                    if (event.value.chatTitle) {
                        chatData
                            .addUserToChat(event.value.chatTitle, req.user.username);
                    }
                })
                .then((result) => {
                    res.json({ redirect: '/events/' + req.params.eventId });
                })
                .catch((err) => {
                    // should send json with the error message
                    req.toastr.error(err);
                    res.redirect('/events/' + req.params.eventId);
                });
        },
        loadEventEditPage(req, res) {
            return eventData.getEventById(req.params.eventId)
                .then((event) => {
                    res.render('event/event-edit', {
                        event,
                        currentUser: req.user
                            ? req.user.username
                            : null,
                    });
                });
        },
        editEvent(req, res) {
            if (!req.user) {
                return res.redirect('/auth/login');
            }

            return eventData.editEvent(req.params.eventId, req.body.title, req.body.description, req.body.headerImage)
                .then(() => {
                    res.redirect(`/events/${req.params.eventId}`);
                });
        },
    };
};
