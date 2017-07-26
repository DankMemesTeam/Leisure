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

                    userData.editUser(foundUser.username, req.body)
                        .then(() => {
                            res.redirect(`/users/${req.params.username}/settings`);
                        });
                });
        },
        loadUserFeed(req, res) {
            if (!req.user) {
                return res.redirect('auth/login');
            }

            return userData.getUserFollowed(req.user.username)
                .then((usersFollowed) => {
                    return statusData.getFeed(usersFollowed.followed);
                })
                .then((statuses) => {
                    return res.render('user/user-feed', { statuses: statuses });
                });
            /* 
                - userData.getUserByUsername(req.user.username) => foundUser
                - get foundUser.peopleFollowed => [usernames]
                - statusData.find({ author: $in: [usernames] }) => statuses => sort them
                - return res.render('user/user-feed', statuses)
            */
        },
        followUser(req, res) {
            /*
                - userData.followUser(follower: req.user.username, toFollow: req.params.username)
            */
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
        }
    };
};
