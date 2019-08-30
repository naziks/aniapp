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
		loading = true;
	// let url = 'http://3.3.3.3/animevost.app/api/'
	let url = 'https://naziksbots.000webhostapp.com/animevost/api/'
	url = url + method+'?'+build_params(params)

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