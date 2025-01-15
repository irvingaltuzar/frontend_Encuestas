import Api from "./Api" //Clase Api donde se declara Axios y la ruta al servidor

export default {
	namespaced: true,
	state: {
		advisors_by_division: [],
		general_advisors_by_division: [],
		polls: [],
		type_poll: [],
		suggestive_question: [],
		user_poll_type: [],
		loading: false,
		dataExcel: [],
		tmp_data: [],
		cat_poll_division: [],
		general_poll_division: [],
		cat_divisions: [],
		poll_by_advisor: null,
		bucket_polls: [],
		btn_status: true,
		cat_question_type: [],
		tmp_fields: [
			{
				'title': 'id',
				'name': 'advisor_id',
				'status': 0
			},
			{
				'title': 'ASESOR',
				'name': 'advisor',
				'status': 1
			},
			{
				'title': 'ENCUESTA',
				'name': 'title',
				'status': 2
			},
			{
				'title': 'FECHA',
				'name': 'created_at',
				'type': 'Date',
				'format': 'DD/MM/YYYY',
				'status': 3
			},
			{
				'title': 'tipo',
				'name': 'question_type',
				'status': 4
			},
			{
				'title': 'id_pregunta',
				'name': 'questions_id',
				'status': 5
			},
		],
		fields: [
			{
				'title': 'id',
				'name': 'advisor_id',
				'status': 0
			},
			{
				'title': 'ASESOR',
				'name': 'advisor',
				'status': 1
			},
			{
				'title': 'ENCUESTA',
				'name': 'title',
				'status': 2
			},
			{
				'title': 'FECHA',
				'name': 'created_at',
				'type': 'Date',
				'format': 'DD/MM/YYYY',
				'status': 3
			},
			{
				'title': 'tipo',
				'name': 'question_type',
				'status': 4
			},
			{
				'title': 'id_pregunta',
				'name': 'questions_id',
				'status': 5
			},
		],
	},
	mutations: {
		SET_FIELDS (state) {
			state.tmp_fields = []

			state.tmp_fields = state.fields
			state.dataExcel = []
		},
		SET_POLL_BY_ADVISOR (state) {
			state.poll_by_advisor = null
		},
		SET_BTN (state) {
			state.btn_status = false
		},
		getReportPoll (state) {
			Api.get('/api/poll/get-excel/' + bucket_id)
			.then(res => {
				state.tmp_data = res.data
			})
			.catch(error => {
				reject(error);// error
			})
		},
		pushAnswers (state, data) {
			let tmp_answer = []

			state.dataExcel.push(data)
		},
		getCatQuestionType (state) {
			Api.get('/api/poll/get-cat-question')
			.then(res => {
				state.cat_question_type = res.data
			})
			.catch(error => {
				console.log(error)
			})
		},
		getUserPollType (state) {
			Api.get('/api/poll/get-user-poll-type')
			.then(res => {
				state.user_poll_type = res.data
			})
			.catch(error => {
				console.log(error)
			})
		},
		getAdvisor (state) {
			Api.get('/api/poll/get-advisor')
			.then(res => {
				state.cat_poll_division.push(res.data)
			})
			.catch(error => {
				console.log(error)
			})
		},
		getPollType (state) {
			state.loading = true

			Api.get('/api/poll/type/get-poll-type')
			.then(res => {
				state.type_poll = res.data
			})
			.catch(error => {
				console.log(error)
			})
			.finally ( () => {
				state.loading = false
			})
		},
		pushTypePoll (state, value) {
			state.type_poll.push(value)
		},
		getGeneralDivision (state) {
			Api.get('/poll/get-advisor')
			.then(res => {

				res.data.map( value => {
					state.general_poll_division.push(value.division)
				})

				state.general_advisors_by_division = res.data
			})
			.catch(error => {
				console.log(error)
			})
		},
		getCatDivision (state) {
			Api.get('/poll/get-cat-division')
			.then(res => {
				state.cat_divisions = res.data
			})
			.catch(error => {
				console.log(error)
			})
		},
		getBucketPolls (state, id) {
			state.bucket_polls = null
			Api.get('/poll/get-bucket-poll/' + id)
			.then(res => {
				console.log(res.data)
				state.bucket_polls = res.data
			})
			.catch(error => {
				console.log(error)
			})
		},
		fetchData (state) {
			Api.get('/api/poll/fetch-data')
			.then(res => {
				state.polls = res.data
			})
			.catch(error => {
				console.log(error)
			})
		},
		pushPoll (state, poll) {
			state.polls.unshift(poll)
		},
		getSuggestiveQuestion (state, search) {
			state.suggestive_question = []
			Api.get('/api/poll/get-suggestive-question/' + search)
			.then(res => {
				console.log(res.data)
			})
			.catch(error => {
				console.log(error)
			})
		},
		getPollByAdvisor (state, payload) {
			let [id, cat_division_id] = payload
			Api.get('/poll/get-by-advisor/' + id + '/' + cat_division_id)
			.then(res => {

				state.poll_by_advisor = res.data

				state.btn_status = false
			})
			.catch(error => {
				console.log(error)
			})
		}
	},
}
