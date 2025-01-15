import Api from "./Api" //Clase Api donde se declara Axios y la ruta al servidor

export default {
	namespaced: true,
	state: {
		report_excel: [],
	},
	mutations: {
		SET_REPORT (state, params) {
			state.report_excel
		},
	},
	actions: {
		async getReportPoll({ commit, dispatch }, bucket_id) {
			return new Promise((resolve, reject) => {

				Api.get('/api/poll/get-excel/' + bucket_id)
				.then(res => {
					commit('SET_REPORT', res.data)

					resolve(res.data)
				})
				.catch(error => {
					reject(error)
				})
			})
		},
	}
}
