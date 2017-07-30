module.exports = (eventCollection, validator, models, logger) => {
    const { Event } = models;

    return {
        getAllEvents(pageNumber, pageSize) {
            const query = {};
            const projection = {};
            const sort = {};

            return Promise.all([
                eventCollection.findPaged(query, projection, pageNumber, pageSize, sort),
                eventCollection.count({}),
            ]);
        },
        getEventById(id) {
            return eventCollection.findById(id);
        },
        getEventsBy(title, pageNumber, pageSize) {
            const regexExpression = `.*${title}.*`;

            const query = {
                title: {
                    $regex: regexExpression,
                },
            };
            const projection = {};
            const sort = {};

            return Promise.all([
                eventCollection.findPaged(query, projection, pageNumber, pageSize, sort),
                eventCollection.count(query),
            ]);
        },
        createEvent(eventObject, chatTitle) {
            const event = new Event(eventObject.title, eventObject.creator,
                eventObject.description, eventObject.participants, chatTitle, eventObject.location);

            return eventCollection.insertOne(event);
        },
        addUserToEvent(eventId, username) {
            return eventCollection.findAndModify(
                { _id: eventCollection.generateId(eventId) },
                { $addToSet: { participants: username } },
                {
                    projection: { chatTitle: 1 },
                }
            );
        },
        addChatToEvent(chatId, chatTitle) {
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
