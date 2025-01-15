import Api from "./Api" //Clase Api donde se declara Axios y la ruta al servidor

export default {
	namespaced: true,
	state: {
		users: {},
		users_by_brand: [],
		sub_section: [],
		fetch_response: false,
		loading: true,
		dialog: false,
		hasChange: false,
		user_type: [],
		cat_division: [],
	},
	mutations: {
		getDatas (state, payload) {
			var [_page, _search] = payload
			state.loading = true

			Api.get('/api/user/get-list?page=' + _page + '&search=' + _search)
			.then(response => {
				state.users = response.data
			})
			.catch(error => {
				console.log(error.response.data)
			})
			.finally ( () => {
				state.loading = false
			})
		},
		setCurrentPage (state, data) {
			state.users.current_page = data
		},
		loadingList (state) {
			state.hasChange = !!!state.hasChange
		},
		getUserComplaint (state) {
			Api.get('/user/get-user-complaint')
			.then(res => {
				console.log(res.data)
				state.complaint_users = res.data
			})
			.catch(error => {
				console.log(error)
			})
			.finally ( () => {
				state.loading = false
			})
		},
		getUserType (state) {
			Api.get('/api/user/get-user-type')
			.then(response => {
				state.user_type = response.data
			})
			.catch(error => {
				console.log(error.response.data)
			})
		},
		getCatDivision (state) {
			state.cat_division = []
			Api.get('/api/advisor/get-all-divisions')
			.then(res => {
				console.log(res)
				state.cat_division = res.data
			})
			.catch(error => {
				console.log(error)
			})
		},
		getUserByBrand (state, id) {
			Api.get('/api/user/get-user-by-brand/' + id)
			.then(res => {
				if(res.data.response_user) {
					console.log(res.data)
					state.fetch_response = !state.fetch_response
					state.users_by_brand = res.data.user
				} else {
					state.fetch_response = false
				}
			})
			.catch(error => {
				console.log(error)
			})
		},
		getSubSec(state) {
			Api.get('/api/sidebar/get-subsec')
			.then(res=> {
				state.sub_section = res.data
			})
			.catch(error => {
				console.log(error)
			})
		},
		pushUser (state, user) {
			state.users.data.unshift(user)
		}
	},
}
