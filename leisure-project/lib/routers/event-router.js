module.exports = ({ app, express, controllers }) => {
    const router = new express.Router();
    const { eventController } = controllers;

    router
        .get('/', eventController.loadEventsPage)
        .get('/create', eventController.loadCreationPage)
        .get('/:eventId', eventController.loadEventDetailsPage)
        .get('/:eventId/edit', eventController.loadEventEditPage)
        .post('/', eventController.createEvent)
        .post('/:id', eventController.addComment)
        .post('/:eventId/edit', eventController.editEvent)
        .post('/:eventId/chat', eventController.addEventChat)
        .post('/:eventId/participate', eventController.addUserToEvent);

    app.use('/events', router);
};
