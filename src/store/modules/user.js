// import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth.js'
// import router, { resetRouter } from '@/router'
// import { MessageBox, Message } from 'element-ui'
import Api from "./Api" //Clase Api donde se declara Axios y la ruta al servidor
import Csrf from "./Csrf" //Clase donde se obtiene crsf-cookie para la autenticacion
import store from '@/store'

const state = {
  token: getToken(),
  user:null,
  name: '',
  auth: false,
	isLoading: true,
	hasData: false
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USER: (state, user) => {
    state.user = user,
		state.name = user.nombre + ' ' + user.apepa
    state.auth = Boolean(user)
  },
	SET_IS_LOADING: (state, isLoading) => {
    state.isLoading = isLoading
  },
	SET_LOGINCRUD: (state, loginCrud) => {
    state.loginCrud = loginCrud
  },

  SET_ROLES: (state, roles) => {
    state.roles = roles
  },

	SET_ROUTES: (state, routes) => {
    state.routes = routes
  },

	SET_IS_SIGNED: (state, isSigned) => {
    state.isSigned = isSigned
  },

}

const actions = {

  // Action que ejecuta la peticion de Auth al backend
 async login({ commit, dispatch }, credenciales) {
   //Se hace la peticion de cookie a sanctum de forma async
  await Csrf.getCookie();
  return new Promise((resolve, reject) => {

   //Hacemos la peticion a la ruta /login de laravel para autenticar y crear sesion
    Api.post('/login', credenciales).then(res=>{
      //Obtenemos la respuesta y declaramos constante data de res
      const { data,config } =  res
      //hacemos commit a la mutation token y le mandamos el valor del token de Auth
      commit('SET_TOKEN', config.headers["X-XSRF-TOKEN"])
      setToken(config.headers["X-XSRF-TOKEN"])

      dispatch('getUser')
      // dispatch('getUser')
			setTimeout(() => {
				dispatch('getInfo_Permisos')

				store.dispatch('layout/getSidebar')

				resolve(data)
			}, 1000)
    })
		.catch(error => {
			reject(error);// error
    })
	})
},


  // user logout
  async logout({ commit, state, dispatch }) {
    // await Api.get("/sanctum/csrf-cookie");
    await Csrf.getCookie();
    return new Promise((resolve, reject) => {
      Api.post('/logout').then(res => {
           //Evento Store para auditoria

        commit('SET_TOKEN', '')
        store.dispatch('layout/resetSidebar')

        dispatch('resetUser')

        localStorage.removeItem('vuex')

        removeToken()

				state.hasData = false

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // Remover Token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },

  getUser({ commit }) {
    Api.get('/api/user')
      .then ( res =>{
        commit('SET_USER', res.data)
      })
      .catch(() => {
        commit('SET_USER', null)
      })
  },

  getList({ commit }) {
    Api.get('/api/user/get-list')
      .then ( res =>{
        console.log(res)
      })
      .catch((error) => {
        console.log(error)
      })
  },

	getDivisions ({ commit, state }) {
		Api.get('/api/division/fetch-data')
		.then(res => {
			state.hasData = res.data
		})
		.catch(error => {
			console.log(error)
		})
	},

	getInfo_Permisos({ commit, state }) {
    return new Promise((resolve, reject) => {

      Api.get('/api/user/get-permissions').then(res=>{
				console.log(res.data)

				var array = [];
				var routes = [];

				res.data.permissions.map( e => {
					array.push({
						"permisos": e.loginCrud,
						"ruta": e.link.subsecUrl,
						'sec_id': e.link.secId,
						'sub_sec_id': e.link.subsecId
					})
					routes.push(e.link.subsecUrl)
				})

				commit('SET_LOGINCRUD',array)

				commit('SET_ROUTES',routes)

				commit('SET_ROLES', res.data.isadm)

        resolve(array)
      }).catch(error => {
        console.log(error);
        reject(error)
      })
    })
  },

  resetUser({ commit }) {
    return new Promise(resolve => {
      commit('SET_USER', '')

			commit('SET_LOGINCRUD', null)

			commit('SET_ROUTES', null)

			commit('SET_ROLES', null)
    })
	},
  getFirstSignature ({ commit }) {
		Api.get('/api/signature/get').then(res => {
			if(res.data.signature) {
				commit('SET_IS_SIGNED', true)
			} else {
				commit('SET_IS_SIGNED', false)
			}
		})
		.catch(error => {
			console.log(error)
		})
	},

}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
