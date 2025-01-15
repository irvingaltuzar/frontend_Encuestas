import Api from "./Api";
import Cookie from "js-cookie";

export default {
  getCookie() {
    let token = Cookie.get("XSRF-TOKEN");

    if (token) {
      return new Promise(resolve => {
        resolve(token);
      });
    }

    return Api.get("/sanctum/csrf-cookie");
  }
};





// import Api from "../../assets/js/api"
// import Cookie from "js-cookie"

// export default {
// 	namespaced: true,
// 	state: {
// 		token: '',
// 		request: ''
// 	},
// 	mutations: {
// 		getCookie (state) {
// 			state.token = Cookie.get("XSRF-TOKEN")

// 			state.token ? new Promise ( resolve => { resolve(state.token) }) : false

// 			state.request = Api.get('/sanctum/csrf-cookie')
// 		},
// 	},
// 	actions: {

// 	}
// }
