module.exports = class Chatroom {
    constructor(participants, chatType) {
        this.chatType = chatType;
        this.participants = participants;
        this.messages = [];
    }
};
