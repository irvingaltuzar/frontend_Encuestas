import Api from "@/store/modules/Api"

export default {
	namespaced: true,
	state: {
		divisions: {},
		user_divisions: {},
		cat_user_divisions: [],
		advisors_by_division: [],
		step: 1,
		current_page: 0,
		division_roles: {},
		loading: false,
		hasChange: false,
		division: new Object(),
	},
	mutations: {
		getDivisions (state) {
			Api.get('/api/division/fetch-data')
			.then(res => {
				state.divisions = res.data
			})
			.catch(error => {
				console.log(error)
			})
		},
		getUserDivision (state) {
			state.cat_user_divisions = []
			Api.get('/api/advisor/get-division')
			.then(res => {
				state.cat_user_divisions = res.data
			})
			.catch(error => {
				console.log(error)
			})
		},
		setCurrentPage (state, data) {
			state.division_roles.current_page = data
		},
		loadingList (state) {
			state.hasChange = !!!state.hasChange
		},
		getUserDivisions (state, payload) {
			var [_page, _search] = payload

			state.loading = true

			Api.get('/api/division/fetch-user-data?page=' + _page + '&search=' + _search)
			.then(res => {
				state.user_divisions = res.data
			})
			.catch(error => {
				console.log(error)
			})
			.finally ( () => {
				state.loading = false
			})
		},
		getAdvisorByDivision (state, id) {
			state.advisors_by_division = []
			Api.get('/api/division/get-advisor-division/' + id)
			.then(res => {
				state.advisors_by_division = res.data
			})
			.catch(error => {
				console.log(error)
			})
		},
		getDivisionRoles (state, payload) {
			var [_page, _search] = payload

			state.loading = true

			Api.get('/api/division/fetch-division-roles?page=' + _page + '&search=' + _search)
			.then(res => {
				state.division_roles = res.data
			})
			.catch(error => {
				console.log(error)
			})
			.finally ( () => {
				state.loading = false
			})
		},
		setBasicInformation (state, division) {
			state.division = division
			state.step++
		},
		resetStep(state) {
			state.step = 1
		},
		nextStep(state) {
			state.step++
		},
		pushDivision(state, division) {
			// state.divisions.unshift(division)
		}
	},
	actions: {

	}
}
