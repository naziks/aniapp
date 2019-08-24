let router = new Navigo(null, true, "#!");
let loading = false;
let loading_timeout = false;
let is_search = false;

router
.on('/news', function () {
	is_search = false;
	$(".search-sm .search-button-sm").fadeIn();
	$('body').removeAttr('style');
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
			console.log('Error:');
			console.error(r);
		}
	}, false)
})
.on('/news/page/:page', function (params) {
	is_search = false;
	$(".search-sm .search-button-sm").fadeIn();
	$('body').removeAttr('style');
	document.title = "News - AnimeVost (by Naziks)";
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
			console.log('Error:');
			console.error(r);
		}
	}, false)
})
.on('/anime/:id', function (params) {
	is_search = false;
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
		}else{
			alert("Error: " + r.error.text);
		}
	}, false)
	console.log('anime: '+params.id)
})
.on('/player/:id', function (params) {
	is_search = false;
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
			console.log('Error:');
			console.error(r);
		}
	}, false)
})
.on('/search/:text/page/:page', function (params) {
	is_search = true;
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
			console.log('Error:');
			console.error(r);
		}
	}, false)
})
.notFound(function(){
	is_search = false;
	loading = false;
	$(".search-sm .search-button-sm").fadeIn();
	$('.search-input-sm').slideUp();
	console.log(404)
})

$(document).ready(function() {
	router.resolve();
	if(window.location.hash.replace("#").replace("!").length == 0)
		router.navigate('/news');
	$('.loader').fadeOut();
});

const do_search = (text = "") => {
	text = String(text).trim();

	if(text.split(":")[0] == "id" && text.split(":")[0].length > 0 && Number(text.split(":")[1]) > 0){
		loading = true;
		router.navigate("/anime/"+Number(text.split(":")[1]));
		return;
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
				console.log("Failed to load");
				clearInterval(loading_interval);
				clearTimeout(loading_timeout)
				loading_timeout = false
			}, 20000)
		}

		$(".loader").show();
		$("#app").fadeOut(function(){
		});
	}else{
		if(loading_timeout != false){
			clearTimeout(loading_timeout)
			loading_timeout = false;
			$(".loader").fadeOut(function(){
				$("#app").fadeIn();
			});
		}
	}
}, 500)