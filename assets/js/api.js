const api = (method = false, params = {}, callback = (r)=>{}, quiet=true) => {

	if(!navigator.onLine){
		console.log("No Internet Connection..");
		return;
	}

	let build_params = (a = {}) => {
		r = "";
		if(Object.keys(a).length == 0) return;
		$(Object.keys(a)).each(function(i, k) {
			r += k + "=" + encodeURIComponent(a[k]) + "&";
		});
		if(r.length > 0)
			r.substr(0, r.length - 1);
		return r;
	}
	if(!quiet)
		loading = true;
	// let url = 'http://3.3.3.3/animevost.app/api/'
	url = 'https://naziksbots.000webhostapp.com/animevost/api/'
	url = url +method+'?'+build_params(params)

	$.ajax(url)
	.done(function(r){
		loading = false;
		if(typeof(r) != "object")
			r = JSON.parse(r);

		if(typeof(params) == "function"){
			params(r);
		}else{
			callback(r);
		}
	})
	.fail(function(a){
		modal_box({
			body: "Server Error<br>",
			can_close:false
		}, {
			reload:true
		})
	});
	return;
}

const trim_text = (text, length = 300) => {
	return text.substr(0,length).split(" ").slice(0,-1).join(" ");
}

const create_article_post = (options = {id:null, title:null, image:null, type:null, duration:null, tags:null, description:null}) => {
	options.tags = options.tags.map(function(a){return "<li>"+a+"</li>"}).join("\n")
	let r = ''
	+'<article type="search" xmlns="http://www.w3.org/1999/xhtml">'
	+	'<h1 onclick="router.navigate(\'/anime/'+options.id+'\')" class="title">'
	+		'<span>$ANIME_TITLE$</span>'
	+	'</h1>'
	+	'<img src="$IMAGE$" alt="Poster" />'
	+	'<main class="text">'
	+		'<p>'
	+			'<strong>Type:&nbsp;</strong>'
	+			'<span>$TYPE$</span>'
	+		'</p>'
	+		'<p>'
	+			'<strong>Duration:&nbsp;</strong>'
	+			'<span>$DURATION$</span>'
	+		'</p>'
	+		'<div class="tags">'
	+			'<strong>Tags:&nbsp;</strong>'
	+			'<ul>$TAGS$</ul>'
	+		'</div>'
	+		'<p class="description">'
	+			'<strong>Description:&nbsp;</strong>'
	+			'<span>$DESCRIPTION$</span>'
	+		'</p>'
	+	'</main>'
	+'</article>'
	return r.replace('$ANIME_TITLE$', options.title.split(" / ")[0])
	.replace('$IMAGE$', options.image)
	.replace('$TYPE$', options.type)
	.replace('$DURATION$', options.duration)
	.replace('$TAGS$', options.tags)
	.replace('$DESCRIPTION$', trim_text(options.description)+"...");
}

const create_full_article = (options = {id:null, title:null, urlImagePreview:null, type:null, duration:"?", tags:null, description:null}) => {
	options.genre = options.genre.map(function(a){return "<li>"+a+"</li>"}).join("\n")
	options.series_list = options.series.map(function(a){
		return "<option value=\""+a.id+"\">"+a.title+"</option>"
	}).join("\n");
	let r = ''
	+'<article type="post" xmlns="http://www.w3.org/1999/xhtml">'
	+	'<h2 class="title">'
	+		'<span>%TITLE%</span>'
	+	'</h2>'
	+	'<div class="poster">'
	+		'<img src="%POSTER%" data-src="%POSTER_SRC%" alt="Poster" />'
	+	'</div>'
	+	'<main class="text">'
	+		'<div class="director">'
	+			'<strong>Director:&nbsp;</strong>'
	+			'<span>%DIRECTOR%</span>'
	+		'</div>'
	+		'<div class="year">'
	+			'<strong>Year:&nbsp;</strong>'
	+			'<span>%YEAR%</span>'
	+		'</div>'
	+		'<div class="type">'
	+			'<strong>Type:&nbsp;</strong>'
	+			'<span>%TYPE%</span>'
	+		'</div>'
	+		'<div class="duration">'
	+			'<strong>Duration:&nbsp;</strong>'
	+			'<span>%DURATION%</span>'
	+		'</div>'
	+		'<div class="genre">'
	+			'<strong>Genres:&nbsp;</strong>'
	+			'<ul>%TAGS%</ul>'
	+		'</div>'
	+		'<p class="description" itemProp="description">'
	+			'<strong>Description:&nbsp;</strong>'
	+			'<span>%DESCRIPTION%</span>'
	+		'</p>'
	+	'</main>'
	+	'<div class="player">'
	+		'<select onchange="set_seria(this.value, this.innerHTML)">'
	+			'%PLAYER%'
	+		'</select>'
	+		'<video poster="./assets/img/placeholder.png" class="vidplayer" crossOrigin="anonymous" crossorigin="anonymous" controls />'
	+	'</div>'
	+'</article>';
	return {
		data:r.replace('%TITLE%', options.title.split(" / ")[0])
		.replace('%POSTER%', options.urlImagePreview)
		.replace('%POSTER_SRC%', options.urlImagePreview)
		.replace('%TYPE%', options.type)
		.replace('%DIRECTOR%', options.director)
		.replace('%DURATION%', options.duration)
		.replace('%TAGS%', options.genre)
		.replace('%YEAR%', options.year)
		.replace('%DESCRIPTION%', options.description)
		.replace('%PLAYER%', options.series_list),
		cb: function(options){
			init_player();
			set_seria(options.series[0].id, options.series[0].title)
		}
	}
}

const create_player_article = (options = {id:null, title:null, urlImagePreview:null, type:null, duration:"?", tags:null, description:null}) => {
	options.series_list = options.series.map(function(a){
		return "<option value=\""+a.id+"\">"+a.title+"</option>"
	}).join("\n");

	let r = ''
	+'<article type="player" xmlns="http://www.w3.org/1999/xhtml">'
	+	'<div class="player player-fullscreen">'
	+		'<select onchange="set_seria(this.value, this.innerHTML)">'
	+			'%PLAYER%'
	+		'</select>'
	+		'<video poster="./assets/img/placeholder.png" class="vidplayer" crossOrigin="anonymous" crossorigin="anonymous" controls />'
	+	'</div>'
	+'</article>';
	return {
		data:r.replace('%PLAYER%', options.series_list),
		cb: function(options){
			init_player();
			set_seria(options.series[0].id, options.series[0].title)
		}
	}
}

const create_pagination = (path = "/news/page/", current_page = 1, pages = 1) => {
	let btn1 = 'onclick="router.navigate(\''+path + (current_page - 1)+'\')"';
	if(current_page - 1 < 1){
		btn1 = "disabled=\"disabled\"";
	}

	let btn2 = 'onclick="router.navigate(\''+path+(current_page+1)+'\')"';
	if(current_page + 1 > pages){
		btn2 = "disabled=\"disabled\"";
	}

	return ''
	+'<div class="pagination">'
	+   '<button '+btn1+'>'
	+       'Prev'
	+   '</button>'
	+   '<button>'
	+       current_page + ' / ' + pages
	+   '</button>'
	+   '<button '+btn2+'>'
	+       'Next'
	+   '</button>'
	+'</div>';
}