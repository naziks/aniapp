let router = new Navigo(null, true, "#!");
let loading = false;
let loading_timeout = false;
let is_search = false;
let modal_box = ()=>{}
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
	document.title = params.text + " - AnimeVost (by Naziks)"
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
	$(".search-sm .search-button-sm").fadeIn();
	$('.search-input-sm').slideUp();
	modal_box({
		body: "This Page is not found on this server!",
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
			}, 13000)
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
