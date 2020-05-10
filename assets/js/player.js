window.Player = null;
let set_seria;

let memory = {
	id: 0,
	data: {},
	seria: null,
	disable_time_saving: false,
	init: function(id){
		let data = JSON.parse(localStorage.getItem("id"+id));
		if(data == null){
			data = {};
		}

		this.id = id;
		this.data = data;

		console.log('Init Memory!');
		console.log('Data: ', data);
		return data;
	},

	setTime: function(seconds = 0){
		if(this.disable_time_saving || seconds <= 0) return;
		this.data[this.seria] = seconds;
		this.save();
		this.data.lastViewed = {title: this.seria, time: seconds}
	},

	save: function() {
		localStorage.setItem("id"+this.id, JSON.stringify(this.data));
	}
}

const init_player = (series) => {
	window.Player = new Plyr(document.querySelector('.vidplayer'), {
		iconUrl: window.location.pathname+"assets/plyr.svg",
		quality: {default:480, options:[720, 480]},
		fullscreen: {
			enabled: true,
			fallback: true,
			iosNative: true
		},
		controls: [
			'play-large', //
			'play', // Play/pause playback
			'progress', // The progress bar and scrubber for playback and buffering
			'current-time', // The current time of playback
			'duration', // The full duration of the media
			'volume', // Volume control
			'settings', // Settings menu
			'pip', // Picture-in-picture
			'airplay', // Airplay,
			'download',
			'fullscreen', // Toggle fullscreen,
		], //
		settings:['quality'],
		// previewThumbnails: {
		//     enabled: true,
		//     src: screenshots
		// }
	});

	Player.on('timeupdate', event => {
		memory.setTime(Math.trunc(Player.currentTime))
	});

	let last_seria = Object.keys(memory.data).filter(_ => _ != "lastViewed").map(a => parseInt(a.split(" ")[0])).sort().slice(-1);

	if(last_seria.length == 1){
		last_seria = last_seria[0] - 1;
		$('select')[0].selectedIndex = last_seria;
		set_seria(series[last_seria].id, series[last_seria].title);
		$(".continue-button span").removeClass('hide')
		$('.continue-button-value').text(memory.data[last_seria+" серия"])
	}else{
		$(".continue-button span").addClass('hide')
		set_seria(series[0].id, series[0].title);
	}

}

const cors_url = "https://apps.nazarko.tk/aniapp/video_cors.php?url=";

set_seria = (id, title) => {
	memory.disable_time_saving = true;
	Player.currentTime = 0;
	memory.seria = title;

	if(memory.data[title] != undefined){
		let time = memory.data[title].toHHMMSS();
		$('.continue-button-value').text(time);

		$('.continue-button').one('click', function(){
			Player.currentTime = memory.data[title].time;
			$(this).fadeOut()
		});

		$(".continue-button span").removeClass('hide')
	}else{
		$(".continue-button span").addClass('hide')
	}

	api('player.get', {id:id}, function(v){
		if(v.ok){
			window.Player.source = {
				type: 'video',
				title: title,
				sources: [
				{
					src: cors_url+encodeURIComponent(v.result.files['720p'][0]),
					type: 'video/mp4',
					size: 720,
				},
				{
					src: cors_url+encodeURIComponent(v.result.files['480p'][0]),
					type: 'video/mp4',
					size: 480,
				},
				],
				poster: cors_image(v.result.poster),
			};
			memory.disable_time_saving = false;
		}
	})
}
