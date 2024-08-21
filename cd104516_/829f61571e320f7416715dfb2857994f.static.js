(function () {
  function loadScript(params) {
    var script = document.createElement("script");

    script.async = true;
    script.src = params.src;
    script.onload = params.onLoad;
    document.body.appendChild(script);
  }

  function start(params) {
    function checkPhoneForm() {
      var isValid =
        $formPhone.get(0).offsetWidth === 0 || fields.phoneInput.isValid;
      $formBtn.attr("disabled", !isValid);
      $formBtn.css({
        opacity: isValid ? 1 : 0.5,
      });
    }

    var $formPhone = $(".form-phone");
    var $formBtn = $(".form-btn");

    var fields = {
      phoneInput: {
        $el: $(".phone-input"),
        isValid: false,
      },
      phoneSelect: {
        $el: $(".phone-prefix__select"),
      },
    };

    fields.phoneInput.$el.attr("type", "text");
    fields.phoneInput.$el.attr("inputmode", "tel");

    var errorEl = fields.phoneInput.$el
      .closest(".phone-prefix__wrap")
      .parent()
      .get(0)
      .querySelector(".formError.phone-error");

    fields.phoneSelect.$el.on("change", function (e) {
      var phone = params.phones.find(function (phone) {
        return phone.alpha2.toLowerCase() === e.target.value.toLowerCase();
      });

      if (phone) {
        var mask = phone.phone_sample.replace(/\d/gi, "0");

        fields.phoneInput.$el.attr("placeholder", phone.phone_sample);

        fields.phoneInput.$el.mask(mask, {
          onComplete() {
            fields.phoneInput.isValid = true;
            checkPhoneForm();
          },

          onInvalid() {
            console.log("invalid");
          },

          onKeyPress() {
            fields.phoneInput.isValid = false;
            checkPhoneForm();

            if (!errorEl) {
              errorEl = document.createElement("div");
              fields.phoneInput.$el
                .closest(".phone-prefix__wrap")
                .parent()
                .get(0)
                .appendChild(errorEl);
            }

            errorEl.className = "formError phone-error";

            var min = phone.phone_sample.replace(/ /gi, "").length;
            var estimate = min - fields.phoneInput.$el.cleanVal().length;

            if (estimate > 0 && min - estimate > 1) {
              errorEl.innerHTML = params.translations.validation.min
                .replace("{min}", min)
                .replace("{length}", estimate);
            } else {
              errorEl.innerHTML = "";
            }
          },
        });

        fields.phoneInput.isValid =
          fields.phoneInput.$el.masked(fields.phoneInput.$el.cleanVal())
            .length === mask.length;

        checkPhoneForm();
      } else {
        fields.phoneInput.$el.unmask();
      }
    });

    fields.phoneSelect.$el.trigger("change");

    checkPhoneForm();
    $("body").on("click", checkPhoneForm);
  }

  $.ajax("./js/translations.json").then(function (translations) {
    loadScript({
      src: "./js/phones.js",
      onLoad() {
        loadScript({
          src:
            "https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.16/jquery.mask.min.js",
          onLoad() {
            start({ phones: window.phones, translations: translations });
          },
        });
      },
    });
  });
})();
