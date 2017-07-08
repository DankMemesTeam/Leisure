module.exports = ({ app, express, controllers }) => {
    const router = new express.Router();
    const { userController } = controllers;

    router.get('/:username', userController.loadProfilePage);

    app.use('/user', router);
};
