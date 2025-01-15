import moment from 'moment'
import Api from "./Api"

export default {
	namespaced: true,
	state: {
		poll_by_advisor: {},
		lastStep: null,
		isLoading: true,
		data_response: false,
		isEnabled: true
	},
	mutations: {
		getPollAdvisor (state, id) {
			Api.get('/poll/get-poll-advisor/' + id)
			.then(res => {
				console.log(res.data.poll.start)
				console.log(res.data.poll.id)
				console.log(res.data.poll.end)
				console.log(moment().format('YYYY-MM-DD'))
				console.log(moment(res.data.poll.end).format('YYYY-MM-DD'))
				if ((moment().format('YYYY-MM-DD') >= moment(res.data.poll.start).format('YYYY-MM-DD')) && (moment().format('YYYY-MM-DD') <= moment(res.data.poll.end).format('YYYY-MM-DD')) && res.data.poll.enabled == 1) {
					state.isEnabled = true
				} else {
					state.isEnabled = false
				}

				setTimeout(() => {
					state.poll_by_advisor = res.data
					state.lastStep = res.data.poll.questions.length
					state.data_response = true
				}, 2000)
			})
			.catch(error => {
				console.log(error)
			})
		},
	},
}
