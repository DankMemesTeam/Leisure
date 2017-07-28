module.exports = class EventChat {
    constructor(participants, chatType, chatTitle) {
        this.chatType = chatType;
        this.chatTitle = chatTitle;
        this.chatIcon = '/images/event/default-header.jpg';
        this.participants = participants;
        this.messages = [];
    }
};
