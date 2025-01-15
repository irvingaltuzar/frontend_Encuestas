import Api from "./Api" //Clase Api donde se declara Axios y la ruta al servidor

export default {
	namespaced: true,
	state: {
		roles: [],
	},
	mutations: {
		getRoles (state) {
			Api.get('/api/environment/get-roles')
			.then(res => {
				console.log (res.data)
				state.roles = res.data
			})
			.catch(error => {
				console.log(error)
			})
		},
	},
}
