/*eslint-disable*/

$(document).ready(function() {
    scaleVideoContainer();

    initBannerVideoSize('.video-container .poster img');
    initBannerVideoSize('.video-container .filter');
    initBannerVideoSize('.video-container video');

    $(window).on('resize', function() {
        scaleVideoContainer();
        scaleBannerVideoSize('.video-container .poster img');
        scaleBannerVideoSize('.video-container .filter');
        scaleBannerVideoSize('.video-container video');
    });
});

function scaleVideoContainer() {
    $('.homepage-hero-module').css('height', '100vh');
}

function initBannerVideoSize(element) {
    $(element).each(function() {
        $(this).data('height', $(this).height());
        $(this).data('width', $(this).width());
    });

    scaleBannerVideoSize(element);
}

function scaleBannerVideoSize(element) {
    const windowWidth = $(window).width();
    const windowHeight = $(window).height() + 5;
    let videoWidth = null;
    let videoHeight = null;

    $(element).each(function() {
        const videoAspectRatio = $(this).data('height') / $(this).data('width');

        $(this).width(windowWidth);

        if (windowWidth < 1000) {
            videoHeight = windowHeight;
            videoWidth = videoHeight / videoAspectRatio;
            $(this).css({ 'margin-top': 0,
             'margin-left': -(videoWidth - windowWidth) / 2 + 'px' });
            $(this).width(videoWidth).height(videoHeight);
        }

        $('.homepage-hero-module .video-container video')
        .addClass('fadeIn animated');
    });
}
