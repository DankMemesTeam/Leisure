const constants = require('../../config/data-conf');

module.exports = class Event {
    constructor(title, creator, description, participants, chatTitle) {
        this.dateCreated = new Date();
        this.title = title;
        this.creator = creator;
        // Must be unique
        this.chatTitle = chatTitle;
        this.description = description;
        this.headerImage = constants.event.defaultHeaderPic;
        this.participants = participants;
        this.comments = [];
    }
};
