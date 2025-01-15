<template>
	<v-container>
		<v-row row wrap>
			<v-col xs="12">
				<v-card>
					<v-card-title class="primary white--text">
						<div class="subtitle-2">
							Encuestas
						</div>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-row row wrap justify-end fill-heigh>
								<v-col xs="12" md="6" lg="4">
									<v-text-field single-line hide-details label="Buscar" append-icon="search"/>
								</v-col>
							</v-row>
						</v-container>
						<v-data-table :headers="dt.headers" :items="polls" :search="dt.search">
							<template v-slot:body="{ items }">
								<tbody v-if="items.length > 0">
									<tr v-for="(item, index) in items" :key="index">
										<td class="text-center">
											{{ item.title }}
										</td>
										<td class="text-center">
											{{ item.start | moment('ddd Do MMM YYYY') }}
										</td>
										<td class="text-center">
											{{ item.end | moment('ddd Do MMM YYYY') }}
										</td>
										<td class="text-center">
											<div v-if="roles != 0">
												<div v-if="item.enabled == 1">
													<v-btn depressed small rounded color="andaresBrand" @click="disabled(item.id)">
														<v-icon small class="green--text">mdi-clock-check-outline</v-icon>
														<span class="green--text">Disponible</span>
													</v-btn>
												</div>
												<div v-else>
													<v-btn depressed small rounded color="andaresBrand" @click="disabled(item.id)">
														<v-icon small class="red--text">mdi-clock-remove-outline</v-icon>
														<span class="red--text">No disponible</span>
													</v-btn>
												</div>
											</div>
										</td>
										<td class="text-center">
											<div v-if="roles != 0">
												<v-btn @click="download_excel(item.id)" depressed small rounded color="andaresBrand">
													<v-icon small class="green--text">mdi-file-excel-outline</v-icon>
												</v-btn>
											</div>
										</td>
										<td class="text-center">
											<poll-access-code-component :bucket="item.bucket"></poll-access-code-component>
										</td>
									</tr>
								</tbody>
								<tbody v-else>
									<td colspan="6">
											<!-- <template v-slot:no-data> -->
										<v-container fill-height>
											<v-row row wrap justify="center">
												<v-col xs="12" md="4" lg="3">
													<UndrawQuestions height="200" primary-color="#FF3D00" class="my-4"/>
													<div class="subtitle-2 font-weight-regular text-xs-center grey--text" align="center">
														{{ dt.quotes[~~(Math.random() * dt.quotes.length)] }}
													</div>
												</v-col>
											</v-row>
											<v-row justify="center">
												<v-col xs="12" md="4" lg="3">
													<v-btn depressed rounded block color="primary" href="#create-user-card">
														<span class="subtitle-2 white--text">Crear una encuesta</span>
													</v-btn>
												</v-col>
											</v-row>
										</v-container>
									</td>
									<!-- </template>	 -->
								</tbody>
							</template>
						</v-data-table>
						<export-json-excel :data="dataExcel" :fields="tmp_fields" worksheet="Encuesta" name="encuesta" id="json-excel" class="d-none"></export-json-excel>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>

	</v-container>
</template>

<!-- script -->

<script>
	import UndrawQuestions from 'vue-undraw/UndrawQuestions';
	import { mapState, mapMutations } from 'vuex'
	import moment from 'moment'
	import Api from "@/store/modules/Api"

	export default {
		name: 'PollListComponent',
		components: { UndrawQuestions },
		data () {
			return {
				dt: {
					headers: [
						{ text: 'Título', sortable: false, align: 'center',},
						{ text: 'Fecha inicio', sortable: false, align: 'center',},
						{ text: 'Fecha final', sortable: false, align: 'center',},
						{ text: 'Estatus', sortable: false, align: 'center',},
						{ text: 'Reporte', sortable: false, align: 'center',},
						{ text: 'Código acceso', sortable: false, align: 'center',},
					],
					search: '',
					quotes: [
						'Aún no hay encuestas registradas.'
					]
				},
				is_download: false,
				modalReport:{
					sheet:false,
					title:'',
					advisors:[],
				},
				notify:{
					isActive:false,
					message:"",
					timeout: 2000,
				},
				fields: [
					{
						'title': 'ASESOR',
						'name': 'full_name',
					},
					{
						'title': 'ENCUESTA',
						'name': 'title_poll',
					},
					{
						'title': 'DESARROLLO',
						'name': 'division',
					},
					{
						'title': 'FECHA',
						'name': 'date_answered',
						'type': 'Date',
						'format': 'YYYY/MM/DD h:m:s'
					}
				],
				header: [],
			}
		},
		computed: {
			...mapState('poll', ['polls', 'tmp_fields', 'dataExcel']),
			...mapState('report_poll',['report_excel']),
			...mapState('user', ['roles']),
		},
		methods: {
			...mapMutations('poll', ['fetchData','SET_FIELDS', 'pushAnswers']),
			...mapMutations('snackbar', ['showSnackbar']),
			...mapMutations('report_poll',['getReportPoll']),
			download_excel(_poll_id){

				// this.header = []
				// this.dataExcel=[]
				this.$store.dispatch('report_poll/getReportPoll', _poll_id).then((res) => {

					// this.header = this.tmp_fields
					this.general_excel(res);
				})
			},
			general_excel(_report_poll){
				console.log(_report_poll)
				this.addTitlesExcel(_report_poll.questions)

				let grouped_answers = []
				let tmp_grouped_answers = []
				_report_poll.questions.forEach(item =>{
					item.answers.forEach( e => {
						if(typeof(grouped_answers[e.advisor_id]) == 'undefined')
						{
							grouped_answers[e.advisor_id] = []
							grouped_answers[e.advisor_id].push(e)
						} else {
							grouped_answers[e.advisor_id].push(e)
						}
					})
				})
				// Se recorren los items agrupados por asesor para crear encuesta contestada en base a fecha.

				Object.entries(grouped_answers).forEach(([key,group]) => {
					let aux_tmp = []
					group.forEach(e => {
						if(typeof(aux_tmp[moment(e.created_at).format('YYYY-MM-DD H:m:s')]) == 'undefined')
						{
							aux_tmp[moment(e.created_at).format('YYYY-MM-DD H:m:s')] = []
							aux_tmp[moment(e.created_at).format('YYYY-MM-DD H:m:s')].push(e)
						} else {
							aux_tmp[moment(e.created_at).format('YYYY-MM-DD H:m:s')].push(e)
						}
					})
					tmp_grouped_answers[key] = aux_tmp
				})
				console.log(tmp_grouped_answers)
				Object.entries(tmp_grouped_answers).forEach(([key,group]) => {

					let polls = Object.values(group);
						let row= []
						let final_answer= null

					polls.forEach(answer =>{
						let row={}
						let tmp_answer = []
						let final_answer=""

						answer.forEach( value => {
							this.tmp_fields.forEach( (colum, index) =>{
								if(colum.name.indexOf('question_id') >= 0){
									let name_question = colum.name.split('_')
									if(value.questions_id == parseInt(name_question[2]))
									{
										if(value.question_type == 1) {
											final_answer = (typeof(row[colum.name]) == 'undefined' ? '' : row[colum.name]) + `${value.options.description},`
										}
										else if(value.question_type == 3){
											value.value == "1" ? final_answer = 'Like' : final_answer = 'Dislike'
										} else {
											final_answer = value.value
										}
										row[colum.name] = final_answer
									}
								}
								else{
									if (colum.status == 0) {
										row[colum.name] = value[colum.name].advisor_id
									}
									if (colum.status == 1) {
										row[colum.name] = value[colum.name].full_name
									} else if (colum.status == 2) {
										row[colum.name] = _report_poll.data.title
									} else if (colum.status == 3){
										row[colum.name] = value[colum.name]
									} else if (colum.status == 4){
										row[colum.name] = value[colum.name]
									} else {
										row[colum.name] = value[colum.name]
									}
								}
							})
						})
						this.pushAnswers(row)
					})

				})

				document.querySelector('#json-excel').click()
				this.resetExcel()
			},
			addTitlesExcel(_titles){
				_titles.forEach(question => {
					this.tmp_fields.push({
						'title': question.title,
						'name': 'question_id_'+question.id,
					});
				})
			},
			resetExcel () {
				this.SET_FIELDS()
			},
			disabled (id) {
				Api.post('/api/poll/change', { id })
				.then(response => {
					this.showSnackbar('Estatus cambiado correctamente.')
					this.toggleStatus(response.data.poll)
				})
				.catch( error => {
					console.log(error)
				})
			},
			toggleStatus (poll) {
				const found = this.polls.find(element => element.id == poll.id)

				found.enabled = poll.enabled
			}
		},
		mounted () {
			this.fetchData()
		}
	}
</script>

<style lang="css" scoped>

	.v-text-field >>> input {
			font-size: 0.875rem;
			font-weight: 100;
			text-transform: capitalize;
	}
	.v-text-field >>> label {
			font-size: 0.875rem;
	}
	.v-text-field >>> button {
			font-size: 0.875rem;
	}


</style>
