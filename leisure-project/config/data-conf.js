module.exports = {
    user: {
        defaultProfilePic: 'lorem ipsum',
    },
    event: {
        defaultHeaderPic: '/images/event/default-header-1.jpg',
        defaultPageSize: 6,
        headerPictures: [
            { name: 'Sky', image: '/images/event/default-header-1.jpg' },
            { name: 'Park', image: '/images/event/default-header-2.jpg' },
            { name: 'Concert', image: '/images/event/default-header-3.jpg' },
            { name: 'Work', image: '/images/event/default-header-4.jpg' },
            { name: 'Beach', image: '/images/event/default-header-5.jpg' },
            { name: 'Park', image: '/images/event/default-header-6.jpg' },
            { name: 'Mountain', image: '/images/event/default-header-7.jpg' },
        ],
    },
    article: {
        defaultPageSize: 2,
        initialCategories: [
            'Programming',
            'Science',
            'Math',
            'Other',
        ],
    },
    // Export default profile picture etc here?
};
