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
        loadEventDetailsPage(req, res, next) {
            eventData.getEventById(req.params.eventId)
                .then((event) => {
                    if (!event) {
                        return next(new Error('Invalid event id'));
                    }

                    return res.render('event/event-details',
                        { currentUser: req.user || null, event: event });
                })
                .catch(() => {
                    return next(new Error('Invalid operation'));
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
            const mapSize = 'size=600x300';
            const zoom = 'zoom=17';
            const center = `center=${lat},${long}`;
            const marker = `&markers=color:red%7Clabel:C%7C${lat},${long}`;

            const googleMapsLink = `https://maps.googleapis.com/maps/api/staticmap?${mapSize}&${zoom}&${center}&${marker}&${mapType}&key=${apiKey}`;

            eventObj.location.mapUrl = googleMapsLink;

            let chatPromise = Promise.resolve(null);

            if (req.body.addChat) {
                chatPromise = chatData
                    .createEventChatroom([req.user.username],
                    'event', req.body.chatTitle);
            }

            chatPromise
                .then((chat) => {
                    return eventData
                        .createEvent(eventObj, req.body.chatTitle || null);
                })
                .then((event) => {
                    res.json({ redirectUrl: '/events' });
                })
                .catch((err) => {
                    res.json({ errorMessage: 'Invalid event!' });
                });
        },
        addEventChat(req, res) {
            eventData.addChatToEvent(req.params.eventId, req.body.chatTitle)
                .then((event) => {
                    return chatData
                        .createEventChatroom(event.value.participants,
                        'event', req.body.chatTitle);
                })
                .then((chat) => {
                    res.json({ redirectUrl: '/events/' + req.params.eventId });
                })
                .catch((err) => {
                    res.json({ errorMessage: 'Oops something went wrong!' });
                });
        },
        addUserToEvent(req, res, next) {
            eventData.addUserToEvent(req.params.eventId, req.user.username)
                .then((event) => {
                    if (event.lastErrorObject.n === 0) {
                        return next(new Error('Invalid operation'));
                    }

                    if (event.value.chatTitle) {
                        return chatData
                            .addUserToChat(event.value.chatTitle,
                            req.user.username);
                    }
                })
                .then((result) => {
                    res.json({ redirectUrl: '/events/' + req.params.eventId });
                })
                .catch((err) => {
                    res.json({ errorMessage: 'Oops something went wrong!' });
                });
        },
        loadEventEditPage(req, res, next) {
            return eventData.getEventById(req.params.eventId)
                .then((event) => {
                    if (!event) {
                        return res.next(new Error('Invalid event id.'));
                    }

                    return res.render('event/event-edit', {
                        event,
                        currentUser: req.user
                            ? req.user.username
                            : null,
                    });
                })
                .catch(() => {
                    return next(new Error('Invalid operation'));
                });
        },
        editEvent(req, res, next) {
            if (!req.user) {
                return res.redirect('/auth/login');
            }

            return eventData
                .editEvent(req.params.eventId, req.body.title,
                req.body.description, req.body.headerImage)
                .then((result) => {
                    if (result.lastErrorObject.n === 0) {
                        return next(new Error('Invalid event id.'));
                    }

                    return res.json({ redirectUrl: `/events/${req.params.eventId}` });
                })
                .catch(() => {
                    return res.json({ errorMessage: 'Oops something went wrong!' });
                });
        },
    };
};
