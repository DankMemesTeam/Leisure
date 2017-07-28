module.exports = class PrivateChat {
    constructor(participants, chatType) {
        this.chatType = chatType;
        this.participants = participants;
        this.messages = [];
    }
};
