module.exports = ({ app, express, controllers }) => {
    const router = new express.Router();
    const { eventController } = controllers;

    router
        .get('/', eventController.loadEventsPage)
        .post('/', eventController.createEvent)
        .get('/create', eventController.loadCreationPage)
        .get('/:eventId', eventController.loadEventDetailsPage);

    app.use('/events', router);
};
