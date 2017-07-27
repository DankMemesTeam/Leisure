const constants = require('../../config/data-conf');

module.exports = class Event {
    constructor(title, creator, description, participants) {
        this.dateCreated = new Date();
        this.title = title;
        this.creator = creator;
        this.description = description;
        this.headerImage = constants.event.defaultHeaderPic;
        this.participants = participants;
        this.comments = [];
    }
};
