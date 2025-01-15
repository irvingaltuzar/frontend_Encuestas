import Api from "./Api"
import store from '@/store'

const state = {
	sidebar: [],
	tmp_sidebar: [],
	data: {}
}

const mutations = {
	SET_SIDEBAR (state, sidebar) {
		state.sidebar = sidebar
	},
	setCurrentPage (state, data) {
		state.data.current_page = data
	},
}

const actions = {
	getSidebar({ commit, state }) {
		Api.get('/sidebar/get-data')
		.then(res => {
			res.data.forEach(element => {

				let section = element
				section.children=[]

				store.state.user.loginCrud.map(e =>{
					if (e.sec_id == element.secId) {
						element.subsection.map( i => {
							if (i.subsecId == e.sub_sec_id) {
								section.children.push(i)
							}
						})
					}
				})
				delete section.subsection;
				state.tmp_sidebar.push(section);
			})

			state.tmp_sidebar.map((value, i) => {
				if (value.children.length <= 0) {
					state.tmp_sidebar.splice(i, 1)
				} else {
				}
			})

			let group = state.tmp_sidebar.reduce((r, a) => {
				r[a.secDesc] = [...r[a.secDesc] || [], a];
				return r;
			}, {});

			commit('SET_SIDEBAR', group)
		})
		.catch(error => {
			console.info(error)
		})
	},
	resetSidebar({ commit, state }) {
		commit('SET_SIDEBAR', null)
		state.tmp_sidebar = []
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
