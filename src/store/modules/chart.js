import Api from "@/store/modules/Api"

export default {
	namespaced: true,
	state: {
		developments: [],
		polls: [],
		advisors: [],
		dates: [],
		answer_text: [],
		loader: false,
		has_text: false
	},
	mutations: {
		activateText (state, value) {
			// console.log()
			if (!!!value) {
				state.answer_text = []
				state.has_text = false
			} else {
				state.answer_text = []
				state.has_text = true;
			}
		},
		setAnswerText (state, value) {
			state.answer_text = value
		},
		setLoader (state, value) {
			!!value ? state.loader = true : state.loader = false
		},
		setEmptyPolls (state) {
			state.polls = []
		},
		getDivisions (state) {
			Api.get('/api/chart/get-division')
			.then(res => {
				if(res.data.success == 1){
						state.developments = res.data.data
					}else{
						state.developments = []
					}
			})
			.catch(error => {
				console.log(error)
			})
		},
		getPolls(state,division_id){
			Api.get('api/chart/get-polls/'+division_id)
			.then(res => {
					if(res.data.success == 1){
							state.polls = res.data.data
					}else{
							state.polls = []
					}
			})
			.catch(error =>{
					console.log('api/chart/get-poll => ',error);
			})
		},
		getAdvisor(state,poll_id){
				Api.get('api/chart/get-advisor/'+poll_id)
				.then(res =>{
						if(res.data.success == 1){
								state.advisors = res.data.data
						}else{
								state.advisors = []
						}
				})
				.catch(error =>{
						console.log('api/chart/get-advisor/ => '+error);
				})
		},
		getDates(state,_params){

				Api.get('api/chart/get-dates/',
				{
						params:{
								"division":_params.division_id,
								"poll":_params.poll_id,
								"advisor":_params.advisor_id,
						}
				})
				.then(res => {
						console.log(res.data);
						if(res.data.success == 1){
								state.dates = res.data.data;
						}else{
								state.dates = []
						}

				})
		}
	},
	actions: {

	}
}
