module.exports = (app, homeController) => {
    const { Router } = require('express');
    const router = new Router();

    router.get('/', homeController.loadHomePage);

    app.use('/', router);
};

