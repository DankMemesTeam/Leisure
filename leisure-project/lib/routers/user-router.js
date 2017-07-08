module.exports = ({ app, express, controllers }) => {
    const router = new express.Router();
    const { userController } = controllers;

    router.get('/:username', userController.loadProfilePage);
    router.post('/:username/posts', userController.insertPost);
    router.get('/:username/settings', userController.loadProfileSettingsPage);

    app.use('/user', router);
};
