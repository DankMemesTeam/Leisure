module.exports = ({ app, data, express, controllers }) => {
    const router = new express.Router();

    const { homeController } = controllers;
    const { userController } = controllers;

    router.get('/', homeController.loadHomePage);
    router.get('/feed', userController.loadUserFeed);

    app.use('/', router);
};
