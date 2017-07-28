module.exports = ({ userData, statusData }) => {
    const pageSize = 2;

    return {
        loadProfilePage(req, res) {
            const pageNumber = req.query.page || 1;

            Promise.all([
                userData.findUserBy({ username: req.params.username }),
                statusData.findStatusesByUser(req.params.username, pageNumber, pageSize),
            ])
                .then(([foundUser, [statuses, count]]) => {
                    const isOwner = req.user && req.user.username === req.params.username;

                    res.render('user/user-profile', {
                        pageUser: foundUser,
                        currentUser: req.user,
                        statuses: statuses,
                        isOwner,
                        pageNumber,
                        pagesCount: Math.ceil(count / pageSize),
                    });
                });
        },
        loadProfileSettingsPage(req, res) {
            userData.findUserBy({ username: req.params.username })
                .then((foundUser) => {
                    if (foundUser.username !== req.user.username) {
                        res.redirect(`/users/${req.params.username}`);
                        return;
                    }

                    res.render('user/profile-settings', foundUser);
                });
        },
        editUserProfile(req, res) {
            userData.findUserBy({ username: req.params.username })
                .then((foundUser) => {
                    if (foundUser.username !== req.user.username) {
                        res.redirect(`/users/${req.params.username}`);
                        return;
                    }

                    // welp...
                    if (req.body.profilePic) {
                        req.body.profilePic = req.body.profilePic.replace(/(.*imgur.com\/)(.*)(\..*)/, '$1$2b$3');
                    }

                    userData.editUser(foundUser.username, req.body)
                        .then(() => {
                            if (req.body.profilePic) {
                                return res.json({
                                    redirect: `/users/${req.params.username}`,
                                });
                            }

                            return res.redirect(`/users/${req.params.username}/settings`);
                        });
                });
        },
        loadUserFeed(req, res) {
            if (!req.user) {
                return res.redirect('auth/login');
            }

            const pageNumber = req.query.page || 1;

            return userData.getUserFollowed(req.user.username)
                .then((usersFollowed) => {
                    return statusData.getFeed(usersFollowed.followed || [], pageNumber, pageSize);    // pageNumber, pageSize
                })
                .then(([statuses, count]) => {
                    return res.render('user/user-feed', {
                        statuses,
                        pageNumber,
                        pagesCount: Math.ceil(count / pageSize),
                    });
                });
        },
        followUser(req, res) {
            if (!req.user) {
                return res.redirect('auth/login');
            }

            return userData.followUser(req.user.username, req.params.username)
                .then(() => {
                    return res.sendStatus(200);
                });
        },
        unfollowUser(req, res) {
            if (!req.user) {
                return res.redirect('auth/login');
            }

            return userData.unfollowUser(req.user.username, req.params.username)
                .then(() => {
                    return res.sendStatus(200);
                });
        },
    };
};
