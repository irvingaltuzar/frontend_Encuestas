<template>
	<v-container>
		<v-row row wrap>
			<v-col xs="12">
				<v-card>
					<v-card-title class="primary white--text">
						<div class="subtitle-2">
							Estadisticas cualitativas
						</div>
					</v-card-title>
					<v-card-text>
						<!--<v-container>
							<v-row row wrap justify-end fill-heigh>
								<v-col xs="12" md="6" lg="4">
									<v-text-field single-line hide-details label="Buscar" v-model="dt.search" append-icon="search"/>
								</v-col>
							</v-row>
						</v-container>-->
						<v-data-table :headers="dt.headers" :items="answer_text" :search="dt.search">
							<template v-slot:body="{ items }">
								<tbody v-if="items.length > 0">
									<tr v-for="(item, index) in items" :key="index">
										<td class="text-center">
											{{	item.title	}}
										</td>
										<td class="text-center">
											<answer-text-description-component :answers="item.answers" />
										</td>
									</tr>
								</tbody>
								<tbody v-else>
									<td colspan="6">
									<!-- <template v-slot:no-data> -->
										<v-container fill-height>
											<v-row row wrap justify="center">
												<v-col xs="12" md="4" lg="3">
													<UndrawProblemSolving height="200" primary-color="#435363" class="my-4"/>
													<div class="subtitle-2 font-weight-regular text-xs-center grey--text">
														{{ dt.quotes[~~(Math.random() * dt.quotes.length)] }}
													</div>
												</v-col>
											</v-row>
										</v-container>
									</td>
									<!-- </template>	 -->
								</tbody>
							</template>
							<template v-slot:no-data>
								<v-container fill-height>
									<v-row row wrap justify="center">
										<v-col xs="12" md="4" lg="3">
											<UndrawProblemSolving height="200" primary-color="#FF3D00" class="my-4"/>
											<div class="subtitle-2 font-weight-regular text-xs-center grey--text">
												Sin datos disponibles.
											</div>
										</v-col>
									</v-row>

								</v-container>
							</template>
						</v-data-table>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<!-- script -->

<script>
	import UndrawProblemSolving from 'vue-undraw/UndrawProblemSolving';
	import { mapState, mapMutations } from 'vuex'
	export default {
		name: 'AnswersTextListComponent',
		components: { UndrawProblemSolving },
		data () {
			return {
				dt: {
					headers: [
						{ text: 'Pregunta', sortable: false, align: 'center'},
						{ text: 'Respuesta', sortable: false, align: 'center',},
					],
					search: '',
					quotes: [
						'Sin datos disponibles.'
					]
				}
			}
		},
		computed: {
			...mapState('chart', ['answer_text'])
		},
		methods: {
			...mapMutations('advisor', ['fetchData']),
		},
	}
</script>

<style lang="css" scoped>

	.v-text-field >>> input {
			font-size: 0.875rem;
			font-weight: 100;
	}
	.v-text-field >>> label {
			font-size: 0.875rem;
	}
	.v-text-field >>> button {
			font-size: 0.875rem;
	}

</style>
