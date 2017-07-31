module.exports = (eventCollection, { eventValidator }, models, logger, { event }) => {
    const { Event } = models;

    return {
        getAllEvents(pageNumber) {
            const query = {};
            const projection = {};
            const sort = {};
            
            return Promise.all([
                eventCollection.findPaged(query, projection, pageNumber, event.defaultPageSize, sort),
                eventCollection.count({}),
                event.defaultPageSize,
            ]);
        },
        getEventById(id) {
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
                eventCollection.findPaged(query, projection, pageNumber, event.defaultPageSize, sort),
                eventCollection.count(query),
                event.defaultPageSize,
            ]);
        },
        createEvent(eventObject, chatTitle) {
            const event = new Event(eventObject.title, eventObject.creator,
                eventObject.description, eventObject.participants, chatTitle, eventObject.location);

            if (!eventValidator.isValid(event)) {
                return Promise.reject();
            }

            return eventCollection.insertOne(event);
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
            if (!eventValidator.isValidChatAdding(chatId, chatTitle)) {
                return Promise.reject();
            }

            return eventCollection.findAndModify(
                { _id: eventCollection.generateId(chatId) },
                { $set: { chatTitle: chatTitle } },
                {
                    projection: { 'participants': 1, 'chatTitle': 1 },
                    returnNewDocument: true,
                }
            );
        },
        editEvent(id, title, description, headerImage) {
            if (!eventValidator.isValidEventEdit(title, description, headerImage)) {
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
