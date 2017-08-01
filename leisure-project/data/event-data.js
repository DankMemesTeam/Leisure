module.exports = (eventCollection, { eventValidator },
     models, logger, { event }) => {
    const { Event } = models;

    return {
        getAllEvents(pageNumber) {
            const query = {};
            const projection = {};
            const sort = {};

            return Promise.all([
                eventCollection.findPaged(query, projection,
                     pageNumber, event.defaultPageSize, sort),
                eventCollection.count({}),
                event.defaultPageSize,
            ]);
        },
        getEventById(id) {
            if (!eventValidator.isValidId(id)) {
                return Promise.reject();
            }

            return eventCollection.findById(id);
        },
        getEventsBy(title, pageNumber) {
            const regexExpression = `.*${title}.*`;

            const query = {
                title: {
                    $regex: regexExpression,
                },
            };
            const projection = {};
            const sort = {};

            return Promise.all([
                eventCollection.findPaged(query, projection,
                     pageNumber, event.defaultPageSize, sort),
                eventCollection.count(query),
                event.defaultPageSize,
            ]);
        },
        createEvent(eventObject, chatTitle) {
            const eventToCreate = new Event(eventObject.title,
                 eventObject.creator, eventObject.description,
                  eventObject.participants,
                 chatTitle, eventObject.location);

            if (!eventValidator.isValid(eventToCreate)) {
                return Promise.reject();
            }

            return eventCollection.insertOne(eventToCreate);
        },
        addCommentToEvent(eventId, comment) {
            if (!eventValidator.isValidId(eventId)) {
                return Promise.reject();
            }

            if (!eventValidator.isValidComment(comment)) {
                return Promise.reject();
            }

            const filter = {
                _id: eventCollection.generateId(eventId),
            };

            const update = {
                $addToSet: {
                    comments: comment,
                },
            };

            return eventCollection.findAndModify(filter, update);
        },
        addUserToEvent(eventId, username) {
            if (!eventValidator.isValidUserAdding(username)) {
                return Promise.reject();
            }

            return eventCollection.findAndModify(
                { _id: eventCollection.generateId(eventId) },
                { $addToSet: { participants: username } },
                {
                    projection: { chatTitle: 1 },
                }
            );
        },
        addChatToEvent(chatId, chatTitle) {
            if (!eventValidator.isValidId(chatId)) {
                return Promise.reject();
            }

            if (!eventValidator.isValidChatAdding(chatId, chatTitle)) {
                return Promise.reject();
            }

            return eventCollection.findAndModify(
                { _id: eventCollection.generateId(chatId) },
                { $set: { chatTitle: chatTitle } },
                {
                    projection: {
                        'participants': 1,
                        'chatTitle': 1,
                        'headerImage': 1,
                    },
                    returnOriginal: false,
                }
            );
        },
        editEvent(id, title, description, headerImage) {
            if (!eventValidator.isValidId(id)) {
                return Promise.reject();
            }

            if (!eventValidator
                .isValidEventEdit(title, description, headerImage)) {
                return Promise.reject();
            }

            const query = {
                _id: eventCollection.generateId(id),
            };

            const update = {
                $set: {
                    title,
                    description,
                    headerImage,
                },
            };

            return eventCollection.findAndModify(query, update);
        },
    };
};
