module.exports = class Article {
    constructor(author, title, description, content, category, tags) {
        this.dateCreated = new Date();
        this.author = author;
        this.title = title;
        this.description = description;
        this.content = content;
        this.likes = [];
        this.comments = [];
        this.category = category;
        this.tags = tags;
    }
};
