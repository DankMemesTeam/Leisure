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
        createEvent(eventObject) {
            const event = new Event(eventObject.title, eventObject.creator,
                eventObject.description, eventObject.participants);

            return eventCollection.insertOne(event);
        },
    };
};
