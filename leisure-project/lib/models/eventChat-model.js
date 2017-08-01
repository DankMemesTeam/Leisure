module.exports = class EventChat {
    constructor(participants, chatType, chatTitle, iconImage) {
        this.chatType = chatType;
        this.chatTitle = chatTitle;
        this.chatIcon = iconImage;
        this.participants = participants;
        this.messages = [];
    }
};
