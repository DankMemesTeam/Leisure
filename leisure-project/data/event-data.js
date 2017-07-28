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
    };
};
