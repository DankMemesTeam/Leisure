module.exports = ({ app, data, express, controllers }) => {
    const router = new express.Router();
    const { homeController } = controllers;

    router.get('/', homeController.loadHomePage);

    app.use('/', router);
};
