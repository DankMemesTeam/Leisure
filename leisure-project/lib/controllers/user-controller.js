module.exports = ({ userData }) => {
    return {
        loadProfilePage(req, res) {
            userData.findUserBy({ username: req.params.username })
                .then((foundUser) => {
                    const isOwner = req.params.username === req.user.username;

                    res.render('user-profile',
                        { pageUser: foundUser, isOwner });
                });
        },
        insertPost(req, res) {
            const post = {
                author: req.user.username,
                likes: [],
                content: req.body.postInput,
            };

            return userData.createPost(post)
                .then(res.redirect('/user/' + req.user.username));
        },
        loadProfileSettingsPage(req, res) {
            userData.findUserBy({ username: req.params.username })
                .then((foundUser) => {
                    if (foundUser.username !== req.user.username) {
                        res.redirect(`/user/${req.params.username}`);
                        return;
                    }

                    res.render('profile-settings', foundUser);
                });
        },
        editUserProfile(req, res) {
            userData.findUserBy({ username: req.params.username })
                .then((foundUser) => {
                    if (foundUser.username !== req.user.username) {
                        res.redirect(`/user/${req.params.username}`);
                        return;
                    }

                    const data = req.body;
                    console.log(req.body);

                    userData.editUser(foundUser.username, data)
                        .then(() => {
                            res.redirect(`/user/${req.params.username}/settings`);
                        });
                });
        },
        addCommentToPost(req, res) {
            if (!req.user) {
                res.redirect('/auth/login');
                return;
            }

            if (req.body.action) {
                userData.addLike(req.params.username, req.params.postId, req.user.username)
                    .then((result) => {
                        res.redirect(`/`);
                    })
                    .catch((err) => {
                        console.log(err);
                    });

                return;
            }
            const comment = {
                author: req.user.username,
                content: req.body.commentContent,
            };

            userData.addPostComment(req.params.username, req.params.postId, comment)
                .then(() => {
                    res.redirect(`/user/${req.params.username}`);
                });
        },
    };
};
