module.exports = ({ app, express, controllers }) => {
    const router = new express.Router();
    const { userController, statusController, chatController } = controllers;

    router.post('/:username/chats', chatController.createPersonalChat);
    router.get('/:username/chats', chatController.loadPersonalChats);
    router.get('/:username/chats/:chatId', chatController.getRecentMessages);
    router.get('/:username/settings', userController.loadProfileSettingsPage);
    router.post('/:username/settings', userController.editUserProfile);
    router.post('/:username/statuses', statusController.createStatus);

    router.post('/:username/:statusId', statusController.addCommentToStatus);
    router.post('/:username/:statusId/like', statusController.likeStatus);
    router.post('/:username/:statusId/dislike', statusController.dislikeStatus);
    router.get('/:username', userController.loadProfilePage);

    app.use('/users', router);
};
