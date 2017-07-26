module.exports = ({ statusData }) => {
    return {
        createStatus(req, res) {
            const status = {
                author: req.user.username,
                content: req.body.statusInput,
            };

            return statusData.createStatus(status)
                .then(res.redirect('/users/' + req.user.username));
        },
        addCommentToStatus(req, res) {
            if (!req.user) {
                res.redirect('/auth/login');
                return;
            }

            const comment = {
                author: req.user.username,
                content: req.body.commentContent,
            };

            statusData.addStatusComment(req.params.username,
                req.params.statusId, comment)
                .then(() => {
                    return res.json(comment);
                })
                .catch((err) => {
                    console.log(err);
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
