let refcode_id = getParameterByName('refcode', location.href)

function regBtnClick(redirect = '/register') {
	//setCookie('WINNER', 1, 5365);
	setCookie('WINNER_' + refcode_id, 1, 5365);
	window.location.href = `https://gdboxer.com/cc0kl7k.php?lp=1` + redirect + (location.search ? location.search : '?') + ('&landing=' + window.landing);
}    
function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
function setCookie(name,value,days) {
	var expires = "";
  var date = new Date();
	if (days) {		
		date.setTime(date.getTime() + (days*24*60*60*1000));
		expires = "; expires=" + date.toUTCString();
	} else {    
    var midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    expires = "; expires=" + midnight.toGMTString();
  }
	document.cookie = name + "=" + (value || "")  + expires + "; path=" + location.pathname;
}
function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length); 
	}
	return null;
}
function pixel(refcode_id, unique) {
	var imgId = new Date().getTime();
	var img = document.createElement('img');
	img.id = 'v2pp_' + refcode_id;
	
	let url = new URL(location.href);
	let subids = [];
	url.searchParams.forEach(function (val, key) {
		let match;
		if ((match = key.match(/^subid([\d]*)/)) != null) {
			subids[match[1] != '' ? parseInt(match[1]) : 0] = (key + '=' + val);
		}
	});
	subids = subids.filter(function (el) {
		return el != null;
	});
	let subid = subids.join('&');
	
	let clickid = url.searchParams.get("clickid");

	let query = '?refcode=' + refcode_id;
	if(subid && subid != '')
		query += '&subid=' + encodeURIComponent(subid);
	if (clickid && clickid != '')
        query += '&click_id=' + clickid;
	
	query += '&landing=' + window.landing + '&cache=' + new Date().getTime();
	if(unique)
		query += '&__u=' + new Date().getTime();

	img.src = 'https://p.1partners.link/pixel.gif' + query;
	img.width = 1
	img.height = 1
	img.style = 'display:none;'
	
	window.setTimeout(function () { 
		document.body.appendChild(img);
		window.setTimeout(function () { var t = document.getElementById('v2pp_' + refcode_id); t.parentElement.removeChild(t); }, 1000);
	}, 1000);
}

if(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(refcode_id)) {
	let isOldWinner = getCookie('WINNER');
	let isWinner = getCookie('WINNER_' + refcode_id);
	if(isWinner)
	  regBtnClick();
	else if(isOldWinner) //lets also support old way
		regBtnClick();

	//lets create pixel for hit
	let isUnique = getCookie('__partneruid');
	pixel(refcode_id, isUnique ? false : true);	
	if(!isUnique) {
		setCookie('__partneruid', refcode_id, null); //null expire by the end of the day
	}
}

//FACEBOOK PIXEL
window.setTimeout(function () { 
	var zpnediv = document.createElement('div');
	zpnediv.id = 'zone_1993595344';
	document.body.appendChild(zpnediv);

	(function(w,d,o,g,r,a,m){
			var cid='zone_1993595344';
			w[r]=w[r]||function(){(w[r+'l']=w[r+'l']||[]).push(arguments)};
			function e(b,w,r){if((w[r+'h']=b.pop())&&!w.ABN){
					var a=d.createElement(o),p=d.getElementsByTagName(o)[0];a.async=1;
					a.src='https://cdn.'+w[r+'h']+'/libs/e.js';a.onerror=function(){e(g,w,r)};
					p.parentNode.insertBefore(a,p)}}e(g,w,r);
			w[r](cid,{id:1993595344,domain:w[r+'h']});
	})(window,document,'script',['1casino.media'],'ABNS');
}, 1000);

