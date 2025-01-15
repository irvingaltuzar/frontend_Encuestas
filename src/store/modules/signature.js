import Api from "./Api" //Clase Api donde se declara Axios y la ruta al servidor

export default {
	namespaced: true,
	state: {
		isSigned: false,
		signature: ''
	},
	mutations: {
		SET_SIGNED (state, event) {
			state.isSigned = event
		},
		changeStatus(state, payload) {
			let [signed, url] = payload
			!!signed ? state.isSigned = !!!state.isSigned : false
			state.signature = url
		},
		getSignature (state) {
			Api.get('/api/signature/get').then(res => {
				if(res.data.signature) {
					state.isSigned = !!!state.isSigned
					state.signature = res.data.url
				} else {
					false
				}
			})
			.catch(error => {
				console.log(error)
			})
		}
	},
}
