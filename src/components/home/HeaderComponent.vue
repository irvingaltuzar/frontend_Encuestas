<template>
	<v-container>
		<v-card>
			<v-card-title class="primary white--text">
				<div class="subtitle-2">
					Selecciona una opción
				</div>
			</v-card-title>
			<v-card-text>
				<v-container>
					<v-row row wrap justify-end fill-heigh>
						<v-col  xs="12" md="12" lg="2">
							<v-select v-model="division_id" :items="developments" item-text="division.description" item-value="division.id" no-data-text="Sin datos disponibles"  label="Desarrollo" @change="getPoll()" />
						</v-col>
						<v-col  xs="12" md="12" lg="3">
							<v-select v-model="poll_id" :items="polls" item-text="title" item-value="poll_id" no-data-text="Sin datos disponibles" label="Encuestas" @change="getAdvisors()" />
						</v-col>
						<v-col  xs="12" md="12" lg="2">
							<v-select v-model="advisor" :items="advisors" item-text="full_name" item-value="advisor" no-data-text="Sin datos disponibles" label="Asesores" :disabled="flag_advisor" id="select_advisor" return-object @change="getDataChart()"/>
						</v-col>
						<v-col  xs="12" md="12" lg="2">
							<v-autocomplete v-model="date" :items="dates" item-text="text" item-value="value" no-data-text="Sin datos disponibles" label="Mes" @change="getDataChart()"/>
						</v-col>
						<v-col  xs="12" md="12" lg="2">
							<v-autocomplete v-model="year" :items="generatedYears" item-text="value" item-value="value" no-data-text="Sin datos disponibles" label="Año" @change="getDataChart()" />
						</v-col>
					</v-row>
				</v-container>
			</v-card-text>
		</v-card>
		<br>
		<dashboard-component :dataChart="dataChart" :loader="loader"></dashboard-component>
	</v-container>
</template>

<!-- script -->

<script>
	/* import UndrawProblemSolving from 'vue-undraw/UndrawProblemSolving'; */
	import { mapState, mapMutations } from 'vuex'
	import DashboardComponent from "./DashboardComponent.vue"
	import Api from "@/store/modules/Api"

	export default {
		name: 'HeaderComponent',
		components: { DashboardComponent },
		data () {
			return {
				ids:'doce',
				division_id:0,
				poll_id:0,
				advisor:{},
				dataChart:[],
				questions_text: [],
				flag_advisor:false,
				temp_chart_data:[],
				date:0,
				year: 2024,
				minYear: 2021,
     		    maxYear: 2030,
				dates:
				[
					{value:1,
						text:'Enero'
					},
					{value:2,
						text:'Febrero'
					},
					{value:3,
						text:'Marzo'
					},
					{value:4,
						text:'Abril'
					},
					{value:5,
						text:'Mayo'
					},
					{value:6,
						text:'Junio'
					},
					{value:7,
						text:'Julio'
					},
					{value:8,
						text:'Agosto'
					},
					{value:9,
						text:'Septiembre'
					},
					{value:10,
						text:'Octubre'
					},
					,
					{value:11,
						text:'Noviembre'
					},
					{value:12,
						text:'Diciembre'
					}
				],
				// years:
				// [
				// 	{
				// 		value:2021
				// 	},
				// 	{
				// 		value:2022
				// 	},
				// 	{
				// 		value:2023
				// 	},

				// 	{
				// 		value:2024
				// 	},
				// ],
			}
		},
		computed: {
			...mapState('chart',['developments']),
			...mapState('chart',['polls', 'has_text', 'answer_text', 'loader']),
			...mapState('chart',['advisors']),
			...mapState('chart',['chartData']),
			  generatedYears() {
				let years = [];
				for (let i = this.minYear; i <= this.maxYear; i++) {
					years.push({ value: i });
				}
				return years;
    }
		},
		methods: {
			...mapMutations('chart',['getDivisions', 'activateText', 'setAnswerText', 'setEmptyPolls', 'setLoader']),
			...mapMutations('chart',['getPolls']),
			...mapMutations('snackbar', ['showSnackbar']),
			...mapMutations('chart',['getAdvisor']),
			getPoll(){
				this.poll_id = 0;
				this.advisor={};
				this.dataChart=[];
				this.date = "";
				this.getPolls(this.division_id)
			},

			getAdvisors(){
				this.advisor={};
				this.dataChart=[];
				this.date = "";
				this.activateText(0)
				this.getAdvisor(this.poll_id)
			},

			/* getDate(){
				console.log('division_id',this.division_id,' poll_id',this.poll_id,' advisor_id',this.advisor.advisor_id);
				let data = {
						'division_id':this.division_id,
						'poll_id':this.poll_id,
						'advisor_id':this.advisor.advisor_id,
					}
				this.getDates(data);
			}, */

			getDataChart(){
				this.dataChart=[]
				this.advisor.bucket_polls_id = null

				let params = {
						'division_id':this.division_id,
						'poll_id':this.poll_id,
						'year' : this.year,
						'advisor_id':this.advisor.advisor_id,
						'bucket_polls_id':this.advisor.bucket_polls_id,
						'date':this.date,
					}

				this.setLoader(1)

				Api.get('api/chart/get-chart/',{
					params:params
				})
				.then(response =>{
					if(response.data.success == 1){
						this.generateStructuresChart([response.data.data, 1])
						this.setLoader(0)
					}else{
						this.showSnackbar(response.data.message)
						this.generateStructuresChart([response.data.data, 0])
						this.activateText(1)
						this.setLoader(0)
					}
				})
				.catch(error =>{
					console.log('api/chart/get-chart => ',error)
					this.setLoader(0)
				})

				this.temp_chart_data = this.chartData
			},

			generateStructuresChart(payload){

				var [poll, status] = payload
				let type_question = ""
				let first_answer = {}, chartData = {}
				let arrayCharts = []
				this.questions_text = []

				if (status != 0) {
					Object.entries(poll).forEach(([key, question]) => {
						if(question[0].cat_questions_type_id == 1){
							chartData = this.generateChartsRadar(question[0])
							arrayCharts.push({
								"title": question[0].title,
								"chartData": chartData,
								"typeChart": 1,
							})
						}
						else if(question[0].cat_questions_type_id == 2){
							chartData = this.generateChartsBar(question[0].answers)
							arrayCharts.push({
								"title": question[0].title,
								"chartData": chartData,
								"typeChart": 2,
							})
						}
						else if(question[0].cat_questions_type_id == 3){
							chartData = this.generateChartsPie(question[0].answers)
							arrayCharts.push({
								"title": question[0].title,
								"chartData": chartData,
								"typeChart": 3,
							})
						}
						else {
							this.questions_text.push(question[0])
						}
					})

					this.activateText(1)
					this.setAnswerText(this.questions_text)
					this.dataChart = arrayCharts
				} else {
					chartData = {}
					arrayCharts = []
					this.questions_text = []
				}

			},

			generateChartsRadar(question){
				let arrayData = []
				let description_options = []
				let options_id = []
				let position = 0

				question.options.forEach(item =>{
					description_options.push(item.description)
					options_id.push(item.id)
					arrayData.push(0)
				})

				question.answers.forEach( e => {
					position = options_id.indexOf(parseInt(e.value))
					arrayData[position] += 1
				})

				let chartRadar = {
					labels: description_options,
					datasets: [
						{
							label: question.title,
							backgroundColor: 'rgba(255,99,132,0.2)',
							borderColor: 'rgba(255,99,132,1)',
							pointBackgroundColor: 'rgba(255,99,132,1)',
							pointBorderColor: '#fff',
							pointHoverBackgroundColor: '#fff',
							pointHoverBorderColor: 'rgba(255,99,132,1)',
							data: arrayData
						}
					]
				}

				return chartRadar

			},
			generateChartsBar(_answers){
				let arrayData = [0,0,0,0,0];
				_answers.forEach( answer => {
					if(parseInt(answer.value) == 100 ){
						arrayData[0] += 1;
					}else if(parseInt(answer.value) == 80 ){
						arrayData[1] += 1;
					}else if(parseInt(answer.value) == 60 ){
						arrayData[2] += 1;
					}else if(parseInt(answer.value) == 40 ){
						arrayData[3] += 1;
					}else if(parseInt(answer.value) == 20 ){
						arrayData[4] += 1;
					}

				})

				let chartBar = {
					labels: [
						'Excelente',
						'Bueno',
						'Regular',
						'Malo',
						'Pésimo',
					],
					datasets: [
						{
							label:'Respuestas',
							backgroundColor: ['#35b747','#77d730','#ffe516','#ffe516','#f4121e'],
							data: arrayData
						}
					]
				}

				return chartBar;
			},

			generateChartsPie(_answers){
				let arrayData = [0,0];
				_answers.forEach( answer => {

					if(answer.value == 1 ){
						arrayData[0] += 1;
					}else if(answer.value == 0 ){
						arrayData[1] += 1;
					}

				})

				let chartPie = {
					labels: [
						'Si',
						'No',
					],
					datasets: [
						{
							label:'Respuestas',
							backgroundColor: ['#35b747','#f4121e'],
							data: arrayData
						}
					]
				}

				return chartPie;

			}


		},
		mounted () {
			this.getDivisions();
		},
		watch:{
			polls(){
				if(this.polls.length > 0){
					this.flag_advisor = false
				}else{
					this.flag_advisor = true
				}
			},

		}
	}
</script>

<style lang="css" scoped>


</style>
