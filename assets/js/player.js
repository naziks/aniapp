window.Player = null;

const init_player = () => {
    window.Player = new Plyr(document.querySelector('.vidplayer'), {
        iconUrl: window.location.pathname+"assets/plyr.svg",
        quality: {default:480, options:[720, 480]},
        fullscreen: {
            enabled: true,
            fallback: true,
            iosNative: true
        },
        controls: [
    'play-large', 
    'play', // Play/pause playback
    'progress', // The progress bar and scrubber for playback and buffering
    'current-time', // The current time of playback
    'duration', // The full duration of the media
    'volume', // Volume control
    'settings', // Settings menu
    'pip', // Picture-in-picture (currently Safari only)
    'airplay', // Airplay (currently Safari only)
    'fullscreen', // Toggle fullscreen
    ],
    settings:['quality']
});
}

const set_seria = (id, title) => {
    api('player.get', {id:id}, function(v){
        if(v.ok){
            window.Player.source = {
                type: 'video',
                title: title,
                sources: [
                {
                    src: v.result.files['720p'][0],
                    type: 'video/mp4',
                    size: 720,
                },
                {
                    src: v.result.files['480p'][0],
                    type: 'video/mp4',
                    size: 480,
                },
                ],
                poster: v.result.poster,
            };
        }
    })
}