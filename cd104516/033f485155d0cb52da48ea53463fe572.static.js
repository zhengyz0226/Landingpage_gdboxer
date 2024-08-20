"use strict";
(function () {
  "use strict";

  let options = {
    regType: "phone",
    bonusType: "casino",

    tabButtonClass: ".tab", // set each tab data-register-type attribute email and phone
    formEmailClass: ".form-email", // email section
    formPhoneClass: ".form-phone", // phone section
    buttonActionClass: ".button-action", // submit
    emailInputClass: ".email-input", // email input
    passwordInputClass: ".password-input",
    passwordInput2Class: ".password-input2",
    phoneInputClass: ".phone-input", // phone input
    emailCountry: ".email-country", // countries select list
    phonePrefixSelect: ".phone-prefix__select", // phone codes select list
    phonePrefixCode: ".phone-prefix__code", //show current phone code
    phoneCurrency: ".phone-currency", // currencies select list for phone section
    emailCurrency: ".email-currency", // currencies select list for email section
    phonePrefixFlag: ".phone-prefix__flag", // country flag for phone-prefix

    emailErrorClass: ".email-error",
    passwordErrorClass: ".password-error",
    password2ErrorClass: ".password2-error",
    phoneErrorClass: ".phone-error",
    ofertaAgreementInputId: "#oferta-agreement",
  };

  let App = function App() {
    this.params = {
      mbHost: "",
      cid: null,
    };
    this.init();
    this.getMostbetHost();
  };

  App.prototype = {
    init: function () {
      let _this = this;

      this.regType = options.regType;
      this.bonusType = options.bonusType;

      this.tabButtons = document.querySelectorAll(options.tabButtonClass);
      this.formEmail = document.querySelector(options.formEmailClass);
      this.formPhone = document.querySelector(options.formPhoneClass);
      this.buttonAction = document.querySelector(options.buttonActionClass);
      this.emailInput = document.querySelector(options.emailInputClass);
      this.passwordInput = document.querySelector(options.passwordInputClass);
      this.passwordInput2 = document.querySelector(options.passwordInput2Class);
      this.phoneInput = document.querySelector(options.phoneInputClass);

      this.emailError = document.querySelector(options.emailErrorClass);
      this.passwordError = document.querySelector(options.passwordErrorClass);
      this.password2Error = document.querySelector(options.password2ErrorClass);
      this.phoneError = document.querySelector(options.phoneErrorClass);

      this.ofertaAgreementInput = document.querySelector(
        options.ofertaAgreementInputId
      );

      if (this.formEmail && this.formPhone) {
        if (this.regType === "email") {
          this.formPhone.style.display = "none";
        } else {
          this.formEmail.style.display = "none";
        }
      }
      if (this.tabButtons) {
        [].forEach.call(this.tabButtons, function (tabButton) {
          tabButton.addEventListener("click", _this.changeRegType.bind(_this));
        });
      }
      if (this.ofertaAgreementInput) {
        this.ofertaAgreementInput.checked = true;
      }
      if (this.emailInput)
        this.emailInput.addEventListener("change", function (event) {
          _this.showError({
            field: "email",
            message: ""
          });
        });
      if (this.passwordInput)
        this.passwordInput.addEventListener("change", function (event) {
          _this.showError({
            field: "password",
            message: ""
          });
        });
      if (this.passwordInput2)
        this.passwordInput2.addEventListener("change", function (event) {
          _this.showError({
            field: "password2",
            message: ""
          });
        });
      if (this.phoneInput) {
        this.phoneInput.addEventListener("change", function (event) {
          _this.showError({
            field: "phone",
            message: ""
          });
        });
      }
      if (this.buttonAction)
        this.buttonAction.addEventListener("click", function (event) {
          _this.submit();
        });
    },
    ajax: function (params) {
      let xhr = new XMLHttpRequest();
      params.contentType =
        params.contentType || "application/x-www-form-urlencoded";
      xhr.open(params.method, params.url, true);
      xhr.setRequestHeader("Content-Type", params.contentType);
      xhr.withCredentials = params.withCredentials || false;
      xhr.send(params.data || "");
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.status !== 200) {
          console.warn("ajax error", xhr.response);
        }
        if (typeof params.onDone === "function") params.onDone(xhr.response);
      };
    },
    getFormFields: function (callback) {
      this.ajax({
        url: this.params.mbHost + "/api/v1/external-register.json",
        method: "GET",
        onDone: function onDone(data) {
          if (typeof callback === "function") callback(JSON.parse(data));
        },
      });
    },
    urlGET: function (name) {
      const value = name ?
        new RegExp("[?&]" + encodeURIComponent(name) + "=([^&]*)").exec(
          location.search
        ) :
        null;
      return value === null ? "" : decodeURIComponent(value[1]);
    },
    JSONP: function (url) {
      let script = document.createElement("script");
      script.async = true;
      script.setAttribute("src", url);
      document.body.appendChild(script);
    },
    getMostbetHost: function () {
      let _this = this;
      window.lMostpartner = {
        changeLinksUrl: function changeLinksUrl(data) {
          _this.params.redirectUrl = data.redirectUrl;
          _this.params.mbHost = data.mbHost;
          _this.getFormFields(function (data) {
            // _this.removeLoader(document.body);
            _this.initComponents(data.fields);
          });
        },
      };
      this.params.cid = this.urlGET("cid");
      this.JSONP(
        location.protocol +
        "//" +
        this.urlGET("h") +
        "/transit-view?cid=" +
        this.params.cid +
        "&callback=lMostpartner.changeLinksUrl"
      );
    },
    getCountryOptions: function (options) {
      let data = [];
      for (let property in options) {
        data.push({
          id: options[property],
          text: property,
        });
      }
      return {
        data: data,
        width: "100%",
        language: {
          noResults: function noResults() {
              return '\u0048\u0065\u00e7\u0020\u0062\u0069\u0072\u0020\u006e\u0259\u0074\u0069\u0063\u0259\u0020\u0074\u0061\u0070\u0131\u006c\u006d\u0061\u0064\u0131' //Совпадений не найдено
          }
        },
      };
    },
    getPhoneNumberOptions: function (options) {
      let setFlag = function setFlag(state) {
        if (state.disabled) return false;
        var template = $(
          '<img class="' +
          options.phonePrefixFlag +
          '" src="./svg/' +
          state.id.toLowerCase() +
          '.svg">'
        );
        return template;
      };
      let data = [];
      for (let property in options) {
        data.push({
          id: property,
          text: options[property],
        });
      }
      return {
        data: data,
        width: "60px",
        templateSelection: setFlag,
        templateResult: setFlag,
        language: {
          noResults: function noResults() {
            return "";
          },
        },
      };
    },
    initComponents: function (fieldsData) {
      this.phonePrefixes =
        fieldsData.mobile_registration_form.fields.phonePrefix.choices;
      this.phonePrefix =
        fieldsData.mobile_registration_form.fields.phonePrefixDefault.choices[0];
        const isLatvia = !this.phonePrefixes[this.phonePrefix] && this.phonePrefix === 'LV';
        if (isLatvia){
            this.phonePrefix = 'IN';
        }
      let _this = this;
      $(options.phonePrefixSelect)
        .select2(this.getPhoneNumberOptions(this.phonePrefixes))
        .val(this.phonePrefix)
        .trigger("change")
        .on("change", function (event) {
          $(options.phonePrefixCode).text(
            "+" + _this.phonePrefixes[this.value]
          );
        });
      $(options.phonePrefixCode).text(
        "+" + this.phonePrefixes[this.phonePrefix]
      );

      this.countries =
        fieldsData.email_registration_form.fields.country.choices;
      this.country =
        fieldsData.email_registration_form.fields.defaultCountry.choices[0];
      if (isLatvia){
        for (let c in this.countries) {
            if (this.countries.hasOwnProperty(c) && this.countries[c] === 10105) this.country = c;
        }
      }
      $(options.emailCountry)
        .select2(this.getCountryOptions(this.countries))
        .val(this.countries[this.country])
        .trigger("change");

      this.currencies =
        fieldsData.mobile_registration_form.fields.currencyId.choices;
      this.currency =
        fieldsData.mobile_registration_form.fields.activeCurrencyCode.choices[0];
      $(options.phoneCurrency)
        .select2(this.getCountryOptions(this.currencies))
        .val(this.currencies[this.currency])
        .trigger("change");
      $(options.emailCurrency)
        .select2(this.getCountryOptions(this.currencies))
        .val(this.currencies[this.currency])
        .trigger("change");
    },
    changeRegType: function (event) {
      if (event.currentTarget.classList.contains("active")) return;
      [].forEach.call(this.tabButtons, function (tabButton) {
        tabButton.classList.remove("active");
      });
      event.currentTarget.classList.add("active");
      if (this.regType === "email") {
        this.formPhone.style.display = "block";
        this.formEmail.style.display = "none";
      } else {
        this.formPhone.style.display = "none";
        this.formEmail.style.display = "block";
      }
      this.regType = event.currentTarget.getAttribute("data-register-type");
    },
    showError: function (error) {
      switch (error.field) {
        case "email":
          if (this.emailError) this.emailError.innerText = error.message;
          break;
        case "password":
          if (this.passwordError) this.passwordError.innerHTML = error.message;
          break;
        case "password2":
          if (this.password2Error)
            this.password2Error.innerHTML = error.message;
          break;
        case "phone":
          if (this.phoneError) this.phoneError.innerHTML = error.message;
          break;
      }
    },
    validate: function () {
      let messages = {
          required: '\u0053\u0061\u0068\u0259\u006e\u0069\u0020\u0064\u006f\u006c\u0064\u0075\u0072\u0075\u006e', //заполните поле
          phone: {
              incorrect: '\u0059\u0061\u006e\u006c\u0131\u015f\u0020\u0074\u0065\u006c\u0065\u0066\u006f\u006e\u0020\u006e\u00f6\u006d\u0072\u0259\u0073\u0069' //Некорректный номер телефона
          },
          email: {
              incorrect: '\u0059\u0061\u006e\u006c\u0131\u015f\u0020\u00fc\u006e\u0076\u0061\u006e\u0020\u0066\u006f\u0072\u006d\u0061\u0074\u0131', //Адрес в неправильном формате
              symbolNotFound: '\u00dc\u006e\u0076\u0061\u006e\u0064\u0061\u0020\u0022\u0040\u0022\u0020\u0073\u0069\u006d\u0076\u006f\u006c\u0075\u0020\u006f\u006c\u006d\u0061\u006c\u0131\u0064\u0131\u0072\u002e\u0020\u00dc\u006e\u0076\u0061\u006e\u0064\u0061\u0020\u0022\u0040\u0022\u0020\u0073\u0069\u006d\u0076\u006f\u006c\u0075\u0020\u0079\u006f\u0078\u0064\u0075\u0072', //Адрес должен содержать символ “@“. В адресе отсутствует символ "@"
              addressIsNotFull: '\u0022\u0040\u0022\u0020\u0073\u0069\u006d\u0076\u006f\u006c\u0075\u006e\u0064\u0061\u006e\u0020\u0073\u006f\u006e\u0072\u0061\u0020\u00fc\u006e\u0076\u0061\u006e\u0131\u006e\u0020\u0068\u0069\u0073\u0073\u0259\u0073\u0069\u006e\u0069\u0020\u0064\u0061\u0078\u0069\u006c\u0020\u0065\u0064\u0069\u006e\u002e\u0020\u00dc\u006e\u0076\u0061\u006e\u0020\u0074\u0061\u006d\u0020\u0064\u0065\u0079\u0069\u006c' //Введите часть адреса после символа “@“. Адрес не полный
          },
          password: {
              minLength: '\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u0435 \u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u043E\u0435 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432: 6. \u0421\u0435\u0439\u0447\u0430\u0441: %current_length%' //Минимальное допустимое количество символов: 6. Сейчас: 
          },
          repeatPassword: {
              discrepancy: '\u0044\u0061\u0078\u0069\u006c\u0020\u0065\u0064\u0069\u006c\u006d\u0069\u015f\u0020\u015f\u0069\u0066\u0072\u0259\u006c\u0259\u0072\u0020\u0075\u0079\u011f\u0075\u006e\u0020\u0067\u0259\u006c\u006d\u0069\u0072' //Введенные пароли не совпадают
          },
          ofertaAgreement: {
              notChecked: '\u0051\u0061\u0079\u0064\u0061\u006c\u0061\u0072\u0131\u006e\u0131\u007a\u0131\u0020\u0071\u0259\u0062\u0075\u006c\u0020\u0065\u0074\u0064\u0069\u0079\u0069\u006e\u0069\u007a\u0069\u006e\u0069\u007a\u0069\u0020\u0074\u0259\u0073\u0064\u0069\u0071\u006c\u0259\u0079\u0069\u006e' //Подтвердите свое согласие с правилами
          }
      };
      if (this.regType === 'phone') {
          const phoneValue = parseInt(this.phoneInput.value.replace(/[^\d]/g, ''));
          if (phoneValue.length === 0) {
              this.showError({
                  field: 'phone',
                  message: messages.required
              });
              return false
          } else if (!isFinite(phoneValue)) {
              this.showError({
                  field: 'phone',
                  message: messages.phone.incorrect
              });
              return false
          }
      }
      if (this.regType === 'email') {
          const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (this.emailInput.value.length === 0) {
              this.showError({
                  field: 'email',
                  message: messages.required
              });
              return false
          } else if (this.emailInput.value.indexOf('@') === -1) {
              this.showError({
                  field: 'email',
                  message: messages.email.symbolNotFound
              });
              return false
          } else if (!this.emailInput.value[this.emailInput.value.indexOf('@') + 1]) {
              this.showError({
                  field: 'email',
                  message: messages.email.addressIsNotFull
              });
              return false
          } else if (!emailReg.test(this.emailInput.value.toLowerCase())) {
              this.showError({
                  field: 'email',
                  message: messages.email.incorrect
              });
              return false
          }
          if (this.passwordInput.value.length === 0) {
              this.showError({
                  field: 'password',
                  message: messages.required
              });
              return false
          } else if (this.passwordInput.value.length < 6) {
              this.showError({
                  field: 'password',
                  message: messages.password.minLength.replace('%current_length%', this.passwordInput.value.length)
              });
              return false
          }
          if (this.passwordInput2) {
              if (this.passwordInput2.value.length === 0) {
                  this.showError({
                      field: 'password2',
                      message: messages.required
                  });
                  return false
              } else if (this.passwordInput2.value.length < 6) {
                  this.showError({
                      field: 'password2',
                      message: messages.password.minLength.replace('%current_length%', this.passwordInput2.value.length)
                  });
                  return false
              } else if (this.passwordInput2.value !== this.passwordInput.value) {
                  this.showError({
                      field: 'password2',
                      message: messages.repeatPassword.discrepancy
                  });
                  return false
              }
          }
      }
      return true
  },
    submit: function () {
      if (!this.validate()) return false;
      const ofertaAgreement = this.ofertaAgreementInput ?
        +this.ofertaAgreementInput.checked :
        1;
      const countryId =
        $(options.emailCountry).val() || this.countries[this.country];
      if (this.regType === "email") {
        const currencyId =
          $(options.emailCurrency).val() || this.currencies[this.currency];
        this.register({
          email: this.emailInput.value,
          plainPasswordFirst: this.passwordInput.value,
          plainPasswordSecond: this.passwordInput2 ?
            this.passwordInput2.value : this.passwordInput.value,
          currencyId: currencyId,
          countryId: countryId,
          ofertaAgreement: ofertaAgreement,
          bonusType: this.bonusType,
        });
      }
      if (this.regType === "phone") {
        const currencyId =
          $(options.phoneCurrency).val() || this.currencies[this.currency];
        const phonePrefix =
          this.phonePrefixes[$(options.phonePrefixSelect).val()];
        this.register({
          phoneNumber: phonePrefix + this.phoneInput.value.replace(/[^\d]/g, ""),
          currencyId: currencyId || this.currency,
          countryId: countryId || this.country,
          ofertaAgreement: ofertaAgreement,
          bonusType: this.bonusType,
        });
      }
    },
    register: function (fields) {
      console.log("fields", fields);
      let _this = this;
      let redirectUrl = this.params.redirectUrl;
      let data = "";
      let url = "";

      if (this.regType === "email") {
        url =
          this.params.mbHost +
          "/api/v1/external-register-email.json?cid=" +
          this.params.cid;
        data =
          "email_registration_form[email]=" +
          encodeURIComponent(fields.email) +
          "&email_registration_form[plainPassword][first]=" +
          encodeURIComponent(fields.plainPasswordFirst) +
          "&email_registration_form[plainPassword][second]=" +
          encodeURIComponent(fields.plainPasswordSecond) +
          "&email_registration_form[currencyId]=" +
          encodeURIComponent(fields.currencyId) +
          "&email_registration_form[country]=" +
          encodeURIComponent(fields.countryId);
        if (fields.bonusType) {
          data += "&first_refill_bonus_type_choice=" + fields.bonusType;
        }
      }
      if (this.regType === "phone") {
        url =
          this.params.mbHost +
          "/api/v1/external-register-mobile.json?cid=" +
          this.params.cid;
        data =
          "mobile_registration_form[phoneNumber]=" +
          encodeURIComponent(fields.phoneNumber) +
          "&mobile_registration_form[country]=" +
          encodeURIComponent(fields.countryId) +
          "&mobile_registration_form[currencyId]=" +
          encodeURIComponent(fields.currencyId);
        if (fields.bonusType) {
          data += "&first_refill_bonus_type_choice=" + fields.bonusType;
        }
      }

      this.ajax({
        url: url,
        method: "POST",
        data: data,
        withCredentials: true,
        onDone: function onDone(data) {
          let response = JSON.parse(data);
          if (response.status === "error") {
            if (response.errors) {
              if (response.errors.form_errors.length) {
                _this.showError({
                  field: _this.regType,
                  message: response.errors.form_errors[0],
                });
              } else if (
                response.errors.phonePrefix &&
                response.errors.phonePrefix.length
              ) {
                _this.showError({
                  field: "phone",
                  message: response.errors.phonePrefix[0],
                });
              } else if (
                response.errors.phoneNumber &&
                response.errors.phoneNumber.length
              ) {
                _this.showError({
                  field: "phone",
                  message: response.errors.phoneNumber[0],
                });
              } else if (
                response.errors.email &&
                response.errors.email.length
              ) {
                _this.showError({
                  field: "email",
                  message: response.errors.email[0],
                });
              } else if (
                response.errors.plainPassword &&
                response.errors.plainPassword.length
              ) {
                _this.showError({
                  field: "password",
                  message: response.errors.plainPassword[0],
                });
              }
            }
          } else {
            window.location.href =
              redirectUrl + (response.sso ? "&sso=" + response.sso : "");
          }
        },
      });
    },
  };
  document.addEventListener("DOMContentLoaded", function () {
    window.Form = new App();
  });
})();