<template>
	<v-card xs="12">
		<v-card-title class="primary white--text">
			<div class="subtitle-2">
				Estadisticas cuantitativas
			</div>
		</v-card-title>
		<v-card-text>
				<v-container>
					<v-row v-if="dataChart.length > 0">
							<v-col xs="12" md="6" lg="4" v-for="(chart,index) in dataChart" :key="index">
								<div class="text-h6 primary--text">{{ chart.title}}</div>
								<chart-radar :chartData="chart.chartData" v-if="chart.typeChart == 1"></chart-radar>
								<chart-bar :chartData="chart.chartData" v-else-if="chart.typeChart == 2"></chart-bar>
								<chart-pie :chartData="chart.chartData" v-else-if="chart.typeChart == 3"></chart-pie>
							</v-col>

					</v-row>
					<v-row v-else class="text-center">
							<v-col v-if="has_load == true" xs="12" md="12" lg="12">
								<v-progress-circular :size="60" :width="4" color="primary" indeterminate/>
							</v-col>
							<v-col v-else xs="12" md="12" lg="12">
								<v-col xs="12" md="12" lg="12">
									<UndrawCharts height="200" primary-color="#435363" class="my-4"/>
									<div class="subtitle-2 font-weight-regular text-xs-center grey--text">
										Sin datos disponibles para graficar.
									</div>
								</v-col>
							</v-col>
					</v-row>
				</v-container>
		</v-card-text>
	</v-card>
</template>

<!-- script -->

<script>
	import UndrawCharts from 'vue-undraw/UndrawCharts'
	import { mapState, mapMutations } from 'vuex'
	import ChartPie from "./ChartPie.vue";
	import ChartBar from "./ChartBar.vue";
	import ChartRadar from "./ChartRadar.vue";
	export default {
		name: 'HeaderComponent',
		components: { ChartPie, ChartBar, ChartRadar, UndrawCharts },
		data () {
			return {
				has_load: false,
			}
		},
		props:{
			dataChart:[],
		},
    watch: {
      'loader' (value) {
        this.has_load = value
      },
    },
		computed: {
			...mapState('chart',['loader']),
		},
		methods: {
		},
		mounted () {
		}
	}
</script>

<style lang="css" scoped>


</style>
