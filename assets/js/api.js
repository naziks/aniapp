let modal_box;

const loading = function(is_loading = true){
	if(is_loading){
		if(loading_timeout == false){
			loading_timeout = setTimeout(function(){
				modal_box({
					body: "Cannot Load this page<br>(Timeout Error)",
					can_close:false
				}, {
					reload:true
				});
				loading_timeout = -1;
			}, 8000);
		}else if(loading_timeout == -1){
			return;
		}else{
			$('#app').fadeOut();
			$('.loader').show();
		}
	}else{
		if(loading_timeout != false && loading_timeout != -1){
			clearTimeout(loading_timeout);
			loading_timeout = false;
			window.scroll(0,0);
			$(".loader").fadeOut();
			$("#app").fadeIn();
		}
	}
}

const api = (method = false, params = {}, callback = (r)=>{}, quiet=true) => {

	// if(!navigator.onLine){
	// 	console.log("No Internet Connection..");
	// 	return;
	// }

	let build_params = (p = {}) => Object.keys(p).map(e => e+"="+encodeURIComponent(p[e])).join("&");

	if(!quiet)
		loading(true);
	// let url = 'http://3.3.3.3/animevost.app/api/'
	let url = 'https://apps.nazarko.tk/aniapp/api/'
	url = url + method+'?'+build_params(params)

	$.ajax(url)
	.done(function(r){
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
			body: "API Error<br><br><b>Requested Method:&nbsp;</b>" + method+'<br><br><b style="text-align:left;">Resuested Params:&nbsp;</b><br><pre class="api-error">'+JSON.stringify(params,null,4)+'</pre>',
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

const cors_image = (url = "") => {
	return "https://apps.nazarko.tk/aniapp/api/utils.loadImage?url="+encodeURIComponent(url);
}
