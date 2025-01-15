<template>
	<v-container>
		<v-row row wrap>
			<v-col xs="12">
				<v-card>
					<v-card-title class="primary white--text">
						<div class="subtitle-2">
							Tipos de encuestas
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
						<v-data-table :headers="dt.headers" :items="type_poll" :search="dt.search" :loading="loading">
							<template v-slot:item.description="props">
								<v-edit-dialog :return-value.sync="props.item.description" @save="() => save(props.item.id)" @cancel="cancel" @open="open" @close="close">
									{{ props.item.description }}
									<template v-slot:input>
										<v-text-field v-model="description" label="Descripción" single-line counter/>
									</template>
								</v-edit-dialog>
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
	import Api from "@/store/modules/Api"

	export default {
		name: 'AdvisorListComponent',
		components: { UndrawProblemSolving },
		data () {
			return {
				dt: {
					headers: [
						{ text: 'Descripción', sortable: false, align: 'center', value: "description"},
					],
					search: '',
					quotes: [
						'Aún no hay tipos de encuesta registrados.'
					]
				},
				description: ''
			}
		},
		computed: {
			...mapState('poll', ['type_poll', 'loading'])
		},
		methods: {
			...mapMutations('poll', ['getPollType']),
			...mapMutations('snackbar', ['showSnackbar']),
      save (id) {
				Api.post('/api/poll/type/update', {
					description: this.description,
					id: id
				})
				.then((res) => {
					Object.assign(this.$data, this.$options.data.call(this))
					this.getPollType()
					this.showSnackbar('Tipo de encuesta actualizado correctamente')
				})
				.catch(error => {
					this.v = new Object()
					setTimeout(() => {
						this.v = error.response.data.errors
					}, 50)
				})
				.finally(() => {
					this.disabled = false
				})
      },
      cancel () {
				this.showSnackbar('El usuario ha sido actualizado de alta.')
      },
      open () {
				this.showSnackbar('Se ha abierto')
      },
      close () {
        console.log('Dialog closed')
      },
		},
		mounted () {
			this.getPollType()
		}
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
