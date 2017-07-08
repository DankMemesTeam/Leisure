module.exports = ({ userData }) => {
    return {
        loadProfilePage(req, res) {
            res.render('user-profile', userData);
        },
        insertPost(req, res) {
            const post = {
                author: req.user.username,
                content: req.body.postInput,
            };

            return userData.createPost(post)
                .then(res.redirect('/user/' + req.user.username));
        },
    };
};
