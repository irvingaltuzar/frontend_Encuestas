import Api from "./Api" //Clase Api donde se declara Axios y la ruta al servidor

export default {
	namespaced: true,
	state: {
		advisors: [],
		cat_division: [],
		user_cat_division: [],
	},
	mutations: {
		getCatDivision (state) {
			state.cat_division = []
			Api.get('/api/advisor/get-all-divisions')
			.then(res => {
				console.log(res)
				state.cat_division = res.data
				state.user_cat_division = res.data
			})
			.catch(error => {
				console.log(error)
			})
		},
		getUserDivision (state) {
			state.cat_division = []
			Api.get('/api/advisor/get-division')
			.then(res => {
				state.cat_division = res.data
			})
			.catch(error => {
				console.log(error)
			})
		},
		fetchData (state) {
			Api.get('/api/advisor/fetch-data')
			.then(res => {
				state.advisors = res.data
			})
			.catch(error => {
				console.log(error)
			})
		},
		pushAdvisor (state, advisor) {
			state.advisors.unshift(advisor)
		}
	},
}
