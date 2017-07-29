module.exports = ({ app, express, controllers }) => {
    const router = new express.Router();
    const { eventController } = controllers;

    router
        .get('/', eventController.loadEventsPage)
        .post('/', eventController.createEvent)
        .get('/create', eventController.loadCreationPage)
        .get('/:eventId', eventController.loadEventDetailsPage)
        .post('/:eventId/chat', eventController.addEventChat)
        .post('/:eventId/participate', eventController.addUserToEvent);

    app.use('/events', router);
};
