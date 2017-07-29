module.exports = (eventCollection, validator, models, logger) => {
    const { Event } = models;

    return {
        getAllEvents() {
            return eventCollection.find();
        },
        getEventById(id) {
            return eventCollection.findById(id);
        },
        getEventsBy(query) {
            // to implement
        },
        createEvent(eventObject, chatTitle) {
            const event = new Event(eventObject.title, eventObject.creator,
                eventObject.description, eventObject.participants, chatTitle);

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
    };
};
