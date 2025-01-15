<template>
	<v-container>
		<v-row row wrap>
			<v-col xs="12">
				<v-card>
					<v-card-title class="primary white--text">
						<div class="subtitle-2">
							Asesores
						</div>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-row row wrap justify-end fill-heigh>
								<v-col xs="12" md="6" lg="4">
									<v-text-field single-line hide-details label="Buscar" v-model="dt.search" append-icon="search"/>
								</v-col>
							</v-row>
						</v-container>
						<v-data-table :headers="dt.headers" :items="advisors" :search="dt.search">
							<template v-slot:body="{ items }">
								<tbody v-if="items.length > 0">
									<tr v-for="(item, index) in items" :key="index">
										<td class="text-center">
											{{ item.full_name }}
										</td>
										<td class="text-center">
											{{ item.contact_phone }}
										</td>
										<td class="text-center">
											<template v-for="division in item.by_division">
												{{ division.division_name }},
											</template>
										</td>
										<td class="text-center">
											<v-icon medium class="primary--text">mdi-badge-account</v-icon>
										</td>
									</tr>
								</tbody>
								<tbody v-else>
									<td colspan="6">
									<!-- <template v-slot:no-data> -->
										<v-container fill-height>
											<v-row row wrap justify="center">
												<v-col xs="12" md="4" lg="3">
													<UndrawProblemSolving height="200" primary-color="#FF3D00" class="my-4"/>
													<div class="subtitle-2 font-weight-regular text-xs-center grey--text">
														{{ dt.quotes[~~(Math.random() * dt.quotes.length)] }}
													</div>
												</v-col>
											</v-row>
											<v-row justify="center">
												<v-col xs="12" md="4" lg="3">
													<v-btn depressed rounded block color="primary" href="#create-user-card">
														<span class="subtitle-2 white--text">Crear un usuario</span>
													</v-btn>
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
												{{ dt.quotes[~~(Math.random() * dt.quotes.length)] }}
											</div>
										</v-col>
									</v-row>
									<v-row justify="center">
										<v-col xs="12" md="4" lg="3">
											<v-btn depressed rounded block color="primary" href="#create-user-card">
												<span class="subtitle-2 white--text">Crear un usuario</span>
											</v-btn>
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
		name: 'AdvisorListComponent',
		components: { UndrawProblemSolving },
		data () {
			return {
				dt: {
					headers: [
						{ text: 'Nombre', sortable: false, align: 'center', value: "full_name"},
						{ text: 'Teléfono', sortable: false, align: 'center',},
						{ text: 'Desarrollo', sortable: false, align: 'center', value: "by_division[0].division_name"},
						{ text: 'Acciones', sortable: false, align: 'center',},
					],
					search: '',
					quotes: [
						'Aún no hay asesores registrados.'
					]
				}
			}
		},
		computed: {
			...mapState('advisor', ['advisors'])
		},
		methods: {
			...mapMutations('advisor', ['fetchData']),
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
