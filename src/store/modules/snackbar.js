export default {
	namespaced: true,
	state: {
		message: "",
		show: false
	},
	mutations: {
		showSnackbar(state, message) {
			state.message = message
			state.show = true
			setTimeout(() => {
				state.show = false;
			}, 3500)
		}
	},
	actions: {}
}
