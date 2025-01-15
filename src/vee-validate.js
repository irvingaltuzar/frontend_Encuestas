import Vue from "vue";
import { extend, localize } from "vee-validate";
import { required, email, confirmed, min } from "vee-validate/dist/rules";
import ar from "vee-validate/dist/locale/ar.json";
import en from "vee-validate/dist/locale/en.json";
import es from "vee-validate/dist/locale/es.json";

// Install required rule.
extend("required", required);

// Install email rule.
extend("email", email);

// Install min rule.
extend("confirmed", confirmed);

extend("min", min);

// Install English and Arabic localizations.
localize({
  es: {
    messages: es.messages,
    names: {
      Password: "contraseña",
      pwd_confirm: "confirmar contraseña"
    },
    fields: {
			Password: {
				min: "{_field_} es muy corto, lo mínimo son 8 carácteres"
			}
    }
  }
});

let LOCALE = "es";

// A simple get/set interface to manage our locale in components.
// This is not reactive, so don't create any computed properties/watchers off it.
Object.defineProperty(Vue.prototype, "locale", {
  get() {
    return LOCALE;
  },
  set(val) {
    LOCALE = val;
    localize(val);
  }
});
