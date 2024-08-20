const messaging = firebase.messaging();

messaging.usePublicVapidKey(
  "BBf459fAg_c8bBGG3MX0OdjWx_AY-vXx-ImcJQ4Cp2EKBDbT90NFg0gGjJy4J4Nx3ebLzEdHG9xvhVS29-5Czmc"
);

messaging.onTokenRefresh(function() {
  messaging
    .getToken()
    .then(function(refreshedToken) {
      console.log("Токен обновлен.");
      setTokenSentToServer(false);
      sendTokenToServer(refreshedToken);
      resetUI();
    })
    .catch(function(err) {
      console.log("Не удается получить обновленный токен ", err);
    });
});

function resetUI() {
  messaging
    .getToken()
    .then(function(currentToken) {
      if (currentToken) {
        sendTokenToServer(currentToken);
      } else {
        console.log(
          "Нет доступного токена идентификатора экземпляра. Запросите разрешение на его создание."
        );
        setTokenSentToServer(false);
      }
    })
    .catch(function(err) {
      console.log("При извлечении токена произошла ошибка. ", err);
      setTokenSentToServer(false);
      localStorage.setItem('stredir2', true);
      if(localStorage.getItem('stredir2')=="true") {}else{
        const url = new URL(document.location.href)
        document.location.href = url;
      }

    });
}

function sendTokenToServer(currentToken) {
  if (!isTokenSentToServer()) {
   //	jQuery("#push-return").text('Вы подписаны на Push рассылку успешно!');
   st_confirm();
   var ip = "";
   var device = "";
   var sub_data = "";
   var sub_language = "";
   var user_id = "";
   var url_cookie = "";
   var browser = "";
   var domain_connect = "";
   ip = localStorage.getItem('ip');
   device=localStorage.getItem('device');
   sub_data = localStorage.getItem('sub_data');
   sub_language = localStorage.getItem('sub_language');
   user_id = localStorage.getItem('user_id');
   url_cookie = encodeURI(localStorage.getItem('url_cookie'));
   browser = encodeURI(localStorage.getItem('browser'));
   domain_connect = localStorage.getItem('domain_connect');

    //подписываем пользователя

    $.post(
      "https://"+domain_connect+"/subscription/send_subscribe.php",
      {
        token: currentToken,
        language: sub_language,
        platform: device,
        browser: browser,
        site: url_cookie,
        ip: ip,
        mark: "default",
        stat: "1",
        data: sub_data,
        adv_id: user_id
      },
      onAjaxSuccess
    );

    function onAjaxSuccess(data) {

      document.cookie = "subscriber_id=" + data + "; max-age=31556926; path=/;";
  
      console.log(data);
    }
    setTokenSentToServer(true);
  } else {
    // jQuery("#push-return").text("Вы уже подписаны на Push");
    st_reject();
  }
}

function isTokenSentToServer() {
  return window.localStorage.getItem("sentToServer") === "1";
}

function setTokenSentToServer(sent) {
  window.localStorage.setItem("sentToServer", sent ? "1" : "0");
}

function requestPermission() {
  console.log("Запрашиваю разрешение...");
  messaging
    .requestPermission()
    .then(function() {
      console.log("Разрешение на уведомление предоставлено.");
      if(localStorage.getItem('stredir')=="true") {
      }else{
       localStorage.setItem('stredir', true);
       const url = new URL(document.location.href)
       document.location.href = url;
      }
      resetUI();
    })
    .catch(function(err) {
      st_rejected();
      //jQuery("#push-return").text("Вы отклонили получение Push рассылки");
    });

    
}

function deleteToken() {
  messaging
    .getToken()
    .then(function(currentToken) {
      messaging
        .deleteToken(currentToken)
        .then(function() {
          console.log("Токен удален.");
          setTokenSentToServer(false);
          resetUI();
        })
        .catch(function(err) {
          console.log("Не удается удалить токен. ", err);
        });
    })
    .catch(function(err) {
      console.log("Ошибка при получении токена идентификатора экземпляра. ", err);
    });
}

resetUI();
function openPush() {
  requestPermission();
}
