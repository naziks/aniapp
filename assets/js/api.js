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
			}, 20000);
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

	let build_params = (a = {}) => {
		r = "";
		if(Object.keys(a).length == 0) return "";
		$(Object.keys(a)).each(function(i, k) {
			r += k + "=" + encodeURIComponent(a[k]) + "&";
		});
		if(r.length > 0)
			r.substr(0, r.length - 1);
		return r;
	}
	if(!quiet)
		loading(true);
	let url = 'http://3.3.3.3/animevost.app/api/'
	// let url = 'https://naziksbots.000webhostapp.com/animevost/api/'
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
	return "https://naziksbots.000webhostapp.com/animevost/api/utils.loadImage?url="+encodeURIComponent(url);
}