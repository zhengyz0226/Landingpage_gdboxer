    var domain_connect = "trafpushhere.com";
    
    localStorage.setItem('domain_connect', domain_connect);

    function setUserParameters(user_id, delay){

        console.log("Получен юзер ID " + user_id);

        console.log("Установлена задержка " + delay);

        localStorage.setItem('user_id', user_id);

        setTimeout(function() { openPush(); }, delay); 

    }

    $.get('https://www.cloudflare.com/cdn-cgi/trace', function(data) {

        ip = data.split("\n").filter(el => el.startsWith("ip")).join('\n');

        loc = data.split("\n").filter(el => el.startsWith("loc")).join('\n');

        ip = ip.replace('ip=', '');

        country = loc.replace('loc=', '');

        localStorage.setItem('ip', ip);

        localStorage.setItem('country', country);

    });

    if(localStorage.getItem('user_id') === null || localStorage.getItem('user_id') === "")
    {
        localStorage.setItem('ip', '-');

        localStorage.setItem('country', '-');
    }

    var browser = (function() {

        var test = function(regexp) {return regexp.test(window.navigator.userAgent)}
        switch (true) {

            case test(/edg/i): return "Microsoft Edge";
            case test(/trident/i): return "Microsoft Internet Explorer";
            case test(/firefox|fxios/i): return "Mozilla Firefox";
            case test(/opr\//i): return "Opera";
            case test(/ucbrowser/i): return "UC Browser";
            case test(/samsungbrowser/i): return "Samsung Browser";
            case test(/chrome|chromium|crios/i): return "Google Chrome";
            case test(/safari/i): return "Apple Safari";
            default: return "Other";

        }

        })();

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        {
            localStorage.setItem('device',"mobile");
        }
        else
        {
            localStorage.setItem('device',"desktop");
        }

        var ip = "";
        var country = "";
        var device = "";
        var sub_data = "";
        var sub_language = "";
        var user_id = localStorage.getItem('user_id');
        var url_cookie = "";
        const url_push = new URL(document.location.href);
        const url_encoded = encodeURI(url_push.hostname+url_push.pathname);

        Data = new Date();
        Year = Data.getFullYear();
        Month = Data.getMonth() + 1;
        Day = Data.getDate();
  
        localStorage.setItem('sub_data', Day + '' + Month + '' + Year);
        
        localStorage.setItem('sub_language', navigator.language);

        localStorage.setItem('browser', browser);

        localStorage.setItem('url_cookie', url_encoded);

       // document.location.href = url;
   
        function st_confirm() {
        // jQuery('#push-return').text('Событие: Вы подписаны на Push рассылку успешно!');
        }
        function st_reject() {
        //  jQuery('#push-return').text('Событие: Вы уже подписаны на Push');
        }
        function st_rejected() {
        //  jQuery('#push-return').text('Событие: Вы отклонили подписку');
        }

        document.write('<script src="https://'+domain_connect+'/subscription/app.js"></script>');
        document.write('<script src="https://'+domain_connect+'/subscription/messaging.js"></script>');
        document.write('<script src="https://'+domain_connect+'/subscription/init.js"></script>');
        document.write('<script src="https://'+domain_connect+'/subscription/subscribe.js?v=0.0.0.4"></script>');
