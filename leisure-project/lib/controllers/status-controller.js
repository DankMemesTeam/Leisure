module.exports = ({ statusData, userData }, renderer) => {
    return {
        createStatus(req, res) {
            if (!req.user) {
                return res.redirect('/auth/login');
            }

            const status = {
                content: req.body.content,
                imageUrl: req.body.imageUrl,
            };

            return userData.findUserBy({ username: req.user.username })
                .then((foundUser) => {
                    status.author = {
                        username: foundUser.username,
                        firstName: foundUser.firstName,
                        lastName: foundUser.lastName,
                        profilePic: foundUser.profilePic,
                    };

                    return statusData.createStatus(status);
                })
                .catch((err) => {
                    return res.json({ errorMessage: 'Invalid status' });
                })
                .then((stat) => {
                    return renderer.render('status-template',
                        {
                            statusAuthor: status.author,
                            status: stat.ops[0],
                            currentUser: req.user,
                        });
                })
                .then((result) => {
                    return res.json({ compiledTemplate: result });
                });
        },
        addCommentToStatus(req, res) {
            if (!req.user) {
                return res.redirect('/auth/login');
            }

            const comment = {
                content: req.body.commentContent,
            };


            return userData.findUserBy({ username: req.user.username })
                .then((foundUser) => {
                    comment.author = {
                        username: foundUser.username,
                        firstName: foundUser.firstName,
                        lastName: foundUser.lastName,
                        profilePic: foundUser.profilePic,
                    };

                    return statusData.addStatusComment(
                        req.params.username,
                        req.params.statusId,
                        comment,
                    );
                })
                .then(() => {
                    return res.json({ comment: comment });
                })
                .catch((err) => {
                    return res.json({ errorMessage: 'Invalid comment!' });
                });
        },
        likeStatus(req, res) {
            return statusData.likeStatus(req.params.username,
                req.params.statusId, req.user.username)
                .then(() => {
                    return res.json({});
                })
                .catch((err) => {
                    return res.json({ errorMessage: 'Oops something went wrong!' });
                });
        },
        dislikeStatus(req, res) {
            return statusData.dislikeStatus(req.params.username,
                req.params.statusId, req.user.username)
                .then(() => {
                    return res.json({});
                })
                .catch((err) => {
                    return res.json({ errorMessage: 'Oops something went wrong!' });
                });
        },
    };
};
