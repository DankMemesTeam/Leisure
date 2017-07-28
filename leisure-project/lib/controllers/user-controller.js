module.exports = ({ userData, statusData }) => {
    return {
        loadProfilePage(req, res) {
            Promise.all(
                [userData.findUserBy({ username: req.params.username }),
                statusData.findStatusesByUser(req.params.username),
                ])
                .then((result) => {
                    const isOwner = req.user && req.user.username === req.params.username;

                    res.render('user/user-profile',
                        {
                            pageUser: result[0], currentUser: req.user,
                            statuses: result[1], isOwner,
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

            return userData.getUserFollowed(req.user.username)
                .then((usersFollowed) => {
                    return statusData.getFeed(usersFollowed.followed || []);
                })
                .then((statuses) => {
                    return res.render('user/user-feed', { statuses: statuses });
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
