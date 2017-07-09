module.exports = class Status {
    constructor(author, content) {
        this.author = author;
        this.dateCreated = new Date();
        this.content = content;
        this.likes = [];
        this.comments = [];
    }
};
