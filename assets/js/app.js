let router = new Navigo(null, true, "#!");
let loading = false;
let loading_timeout = false;
let is_search = false;
let modal_box = ()=>{}

const page_type = (type) => {
	if(type == "player"){
		$('footer').fadeOut();
	}else{
		$('footer').fadeIn();
	}
}


window.mobileAndTabletcheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

const search_commands = {
	id: function(id){
		if(Number(id[0]) > 0){
			loading = true;
			router.navigate("/anime/"+Number(id[0]));
			return false;
		}

		return true;
	},

	pid: function(id){
		if(Number(id[0]) > 0){
			loading = true;
			router.navigate("/player/"+Number(id[0]));
			return false;
		}

		return true;
	}
}


router
.on('/news', function () {
	is_search = false;
	page_type("news");
	$(".search-sm .search-button-sm").fadeIn();
	$('body').removeAttr('style');
	$("#search_box").val("");
	$("#search_box_sm").val("");
	document.title = "News - AnimeVost (by Naziks)";
	api('anime.news', {}, function(r){
		if(r.ok){
			r = r.result.list;

			r = r.map(function(j){
				return create_article_post({
					id: j.id,
					title: j.title,
					image: j.poster,
					type: j.type.title,
					duration: j.length,
					tags: j.genre,
					description: j.description
				})
			}).join("\n\n");

			r += create_pagination("/news/page/", 1, 200)

			$("#app")[0].innerHTML = r;
		}else{
			console.log('Something went wrong!');
			modal_box({
				body: "Cannot Load this page.. <br><b style=\"text-align: left; width: 100%; display: inline-block; padding: 0 30px;\">API response:</b><br><pre class=\"api-error\">"+JSON.stringify(r, null, 4)+"</pre>",
				can_close:false
			}, {
				reload:true
			})
		}
	}, false)
})
.on('/news/page/:page', function (params) {
	is_search = false;
	page_type("news");
	$(".search-sm .search-button-sm").fadeIn();
	$('body').removeAttr('style');
	document.title = "News - AnimeVost (by Naziks)";

	if(isNaN(Number(params.page)) || Number(params.page) <= 0){
		modal_box({
			body: "Cannot Load this page..<br>Incorrect Page Number",
			can_close:false
		}, {
			// reload:true,
			home: true,
			back:true
		})
		return;
	}

	api('anime.news', {
		page: params.page
	}, function(r){
		if(r.ok){
			r = r.result.list;

			r = r.map(function(j){
				return create_article_post({
					id: j.id,
					title: j.title,
					image: j.poster,
					type: j.type.title,
					duration: j.length,
					tags: j.genre,
					description: j.description
				})
			}).join("\n\n");

			r += create_pagination("/news/page/", Number(params.page), 200)

			$("#app")[0].innerHTML = r;
		}else{
			modal_box({
				body: "Cannot Load this page.. <br><b style=\"text-align: left; width: 100%; display: inline-block; padding: 0 30px;\">API response:</b><br><pre class=\"api-error\">"+JSON.stringify(r, null, 4)+"</pre>",
				can_close:false
			}, {
				reload:true
			})
		}
	}, false)
})
.on('/anime/:id', function (params) {
	is_search = false;

	if(isNaN(Number(params.id)) || Number(params.id) <= 0){
		$("#search_text").val("");
		$("#search_text_sm").val("");
		modal_box({
			body: "Cannot Load this page..<br>Incorrect Anime Id",
			can_close:false
		}, {
			// reload:true,
			home: true,
			back:true
		})
		return;
	}

	page_type("post");

	$("#search_text").val('id:'+params.id);
	$("#search_text_sm").val('id:'+params.id);
	$(".search-sm .search-button-sm").fadeIn();
	$('body').removeAttr('style');
	document.title = "Loading... - AnimeVost (by Naziks)";
	api('anime.info', {id: params.id}, function(r){
		if(r.ok){
			r = r.result.data;
			document.title = r.title + " - AnimeVost (by Naziks)";
			let article = create_full_article(r)
			$("#app")[0].innerHTML = article.data;
			memory.init(params.id);
			article.cb(r);
			$("#app").fadeIn();
		}else{
			modal_box({
				body: "Cannot Load this page.. <br><b style=\"text-align: left; width: 100%; display: inline-block; padding: 0 30px;\">API response:</b><br><pre class=\"api-error\">"+JSON.stringify(r, null, 4)+"</pre>",
				can_close:false
			}, {
				reload:true,
				home: true
			})
		}
	}, false)
	console.log('anime: '+params.id)
})
.on('/player/:id', function (params) {
	is_search = false;

	if(isNaN(Number(params.id)) || Number(params.id) <= 0){
		$("#search_text").val("");
		$("#search_text_sm").val("");
		modal_box({
			body: "Cannot Load this page..<br>Incorrect Player Id",
			can_close:false
		}, {
			// reload:true,
			home: true,
			back:true
		})
		return;
	}

	page_type("player");

	$("#search_text").val('pid:'+params.id);
	$("#search_text_sm").val('pid:'+params.id);
	$(".search-sm .search-button-sm").fadeIn();
	$('body').removeAttr('style');
	document.title = "Loading... - AnimeVost (by Naziks)";
	api('anime.info', {id: params.id}, function(r){
		if(r.ok){
			r = r.result.data;
			document.title = "Player - AnimeVost (by Naziks)";
			let article = create_player_article(r)
			$("#app")[0].innerHTML = article.data;
			memory.init(params.id);
			article.cb(r);
		}else{
			modal_box({
				body: "Cannot Load this page.. <br><b style=\"text-align: left; width: 100%; display: inline-block; padding: 0 30px;\">API response:</b><br><pre class=\"api-error\">"+JSON.stringify(r, null, 4)+"</pre>",
				can_close:false
			}, {
				reload:true
			})
		}
	}, false)
	console.log('player: '+params.id)
})
.on('/search/:text', function (params) {
	is_search = true;
	console.log('Search: '+params.text);
	document.title = params.text + " - AnimeVost (by Naziks)";
	page_type("search");
	$("#search_text").val(params.text);
	$("#search_text_sm").val(params.text);
	$(".search-sm .search-button-sm").fadeOut();
	$('.search-input-sm').slideDown();
	$('body').attr('style', 'padding-top: 100px;');
	api('anime.search', {
		text: params.text
	}, function(r){
		if(r.ok){
			r = r.result;

			result = r.list.map(function(j){
				return create_article_post({
					id: j.id,
					title: j.title,
					image: j.poster,
					type: j.type.title,
					duration: j.length,
					tags: j.genre,
					description: j.description
				});
			}).join("\n\n");

			if(Number(r.pages) > 1){
				result += create_pagination("/search/"+params.text+"/page/", 1, Number(r.pages))
			}else{
				result = "Nothing Found!";
			}

			$("#app")[0].innerHTML = result;
		}else{
			modal_box({
				body: "Cannot Load this page.. <br><b style=\"text-align: left; width: 100%; display: inline-block; padding: 0 30px;\">API response:</b><br><pre class=\"api-error\">"+JSON.stringify(r, null, 4)+"</pre>",
				can_close:false
			}, {
				reload:true
			})
		}
	}, false)
})
.on('/search/:text/page/:page', function (params) {
	is_search = true;

	if(isNaN(Number(params.page)) || Number(params.page) <= 0){
		modal_box({
			body: "Cannot Load this page..<br>Incorrect Page Number",
			can_close:false
		}, {
			// reload:true,
			home: true,
			back:true
		})
		return;
	}

	page_type("search");

	console.log('Search: '+params.text);
	document.title = params.text + " - AnimeVost (by Naziks)"
	$("#search_text").val(params.text);
	$("#search_text_sm").val(params.text);
	$(".search-sm .search-button-sm").fadeOut();
	$('.search-input-sm').slideDown();
	$('body').attr('style', 'padding-top: 100px;');
	api('anime.search', {
		text: params.text,
		page: params.page
	}, function(r){
		if(r.ok){
			r = r.result;

			result = r.list.map(function(j){
				return create_article_post({
					id: j.id,
					title: j.title,
					image: j.poster,
					type: j.type.title,
					duration: j.length,
					tags: j.genre,
					description: j.description
				})
			}).join("\n\n");

			result += create_pagination("/search/"+params.text+"/page/", Number(params.page), Number(r.pages))

			$("#app")[0].innerHTML = result;
		}else{
			modal_box({
				body: "Cannot Load this page.. <br><b style=\"text-align: left; width: 100%; display: inline-block; padding: 0 30px;\">API response:</b><br><pre class=\"api-error\">"+JSON.stringify(r, null, 4)+"</pre>",
				can_close:false
			}, {
				reload:true
			})
		}
	}, false)
})
.notFound(function(){
	is_search = false;
	loading = false;

	page_type("404");

	$(".search-sm .search-button-sm").fadeIn();
	$('.search-input-sm').slideUp();
	modal_box({
		body: "This Page is not found on this server!<br>" + window.location.href,
		can_close:true
	}, {
		home:true,
		reload: true
	})
})

$(window).on('load', function(){
	if(window.location.hash.replace("#").replace("!").length == 0)
		router.navigate('/news');
	router.resolve();
	$('.loader').fadeOut();
});

const do_search = (text = "") => {
	text = String(text).trim();

	if(Object.keys(search_commands).includes(text.trim().split(":")[0]) && text.split(":")[0].length > 0){
		let a = text.trim().split(":").filter(function(a,i){
			return i != 0;
		});

		let r = search_commands[text.trim().split(":")[0]](a);

		if(r == false){
			return;
		}
	}

	if(text.length < 4) return;

	loading = true;

	router.navigate("/search/"+text);
}

$("#search_text").on("keydown", function(e){
	if(e.keyCode == 13){
		do_search(this.value);
	}
})

$("#search_text_sm").on("keydown", function(e){
	if(e.keyCode == 13){
		do_search(this.value);
		$(this).blur();
	}
})
.on('blur', function(e){
	if(!is_search)
		$('.search-input-sm').slideUp();
})

$(".search-button").on("click", function() {
	do_search($("#search_text").val())
})

let loading_interval = setInterval(function(){
	if(loading){
		if(loading_timeout == false){
			loading_timeout = setTimeout(function(){
				
				modal_box({
					body: "Cannot Load this page<br>(Timeout Error)",
					can_close:false
				}, {
					reload:true
				})

				clearInterval(loading_interval);
				clearTimeout(loading_timeout)
				loading_timeout = false
			}, 20000)
		}

		$(".loader").show();
		$("#app").fadeOut();
	}else{
		if(loading_timeout != false){
			clearTimeout(loading_timeout)
			loading_timeout = false;
			$(".loader").fadeOut(function(){
				$("#app").fadeIn();
			});
		}
	}
}, 500);

// let isOnline = setInterval(function(){
// 	if(!navigator.onLine){
// 		clearInterval(loading_interval);
// 		clearInterval(isOnline);
// 		loading = false;

// 		modal_box({
// 			body: "No Internet Connection",
// 			can_close:false
// 		}, {
// 			reload:true
// 		})
// 	}
// }, 500)

modal_box = (text = {}, buttons = {}) => {
	if($("#popup").is(":visible")) return false;
	let _buttons = {
		reload: false,
		home: false
	}

	let _text = {
		header: "Ooops..",
		body: "Some error during load this page, please reload page and try again.",
		can_close: true
	}

	Object.keys(_buttons).forEach(function(e){
		if(!buttons.hasOwnProperty(e)){
			buttons[e] = _buttons[e];
		}
	});

	Object.keys(_text).forEach(function(e){
		if(!text.hasOwnProperty(e)){
			text[e] = _text[e];
		}
	});

	$("#popup .header").html(text.header);
	$("#popup .body").html(text.body);

	if(text.can_close){
		$("#popup .cover, #popup .close-button").attr("onclick", "$('#popup').fadeOut()");
		$("#popup .close-button").show();
	}else{
		$("#popup .cover, #popup .close-button").removeAttr("onclick");
		$("#popup .close-button").hide();
	}

	Object.keys(buttons).forEach(function(e){
		let el = $('#popup .buttons .'+e);
		if(buttons[e]){
			el.show();
		}else{
			el.hide();
		}
	});

	$("#popup").fadeIn();
}


// Disable Safari Scale
// document.addEventListener('touchmove', function (event) {
// 	if (event.scale !== 1) { event.preventDefault(); }
// }, { passive: false });