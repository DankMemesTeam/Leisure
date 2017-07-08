module.exports = ({ app, express, controllers }) => {
    const router = new express.Router();
    const { userController } = controllers;
    
    router.get('/:username/settings', userController.loadProfileSettingsPage);
    router.post('/:username/settings', userController.editUserProfile);
    router.post('/:username/posts', userController.insertPost);
    router.get('/:username', userController.loadProfilePage);

    app.use('/user', router);
};
