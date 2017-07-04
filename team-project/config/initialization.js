const express = require('express');
const bodyParser = require('body-parser');

const initApp = (config) => {
    const app = express();

    app.set('view engine', 'pug');
    app.set('views', );
    app.use(bodyParser.urlencoded({
        extended: false,
    }));

};