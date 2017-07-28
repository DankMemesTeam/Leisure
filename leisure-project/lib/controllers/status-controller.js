module.exports = ({ statusData, userData }) => {
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
                .then(() => {
                    return res.json({ redirect: '/users/' + req.user.username });
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
                    return res.json(comment);
                });
        },
        likeStatus(req, res) {
            return statusData.likeStatus(req.params.username,
                req.params.statusId, req.user.username)
                .then(() => {
                    return res.sendStatus(200);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        dislikeStatus(req, res) {
            return statusData.dislikeStatus(req.params.username,
                req.params.statusId, req.user.username)
                .then(() => {
                    return res.sendStatus(200);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    };
};
