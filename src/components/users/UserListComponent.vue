<template>
	<v-container>
		<v-row row wrap>
			<v-col xs="12">
				<v-card>
					<v-card-title class="primary white--text">
						<div class="subtitle-2">
							Usuarios
						</div>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-row row wrap justify-end fill-heigh>
								<v-col xs="12" md="6" lg="4">
									<v-text-field v-model="dt.search" single-line hide-details label="Buscar" append-icon="search"/>
								</v-col>
							</v-row>
						</v-container>
						<v-data-table :headers="dt.headers" :options.sync="dt.pagination" :page.sync="users.current_page" :items="users.data" :loading="loading" hide-default-footer mobile-breakpoint="0"  @page-count="users.total = $event">
							<template v-slot:body="{ items }">
								<tbody>
									<tr v-for="(item, index) in items" :key="index">
										<td>{{ item.nombre }}</td>
										<td>{{ item.apepa }}</td>
										<td>{{ item.apema }}</td>
										<td>{{ item.usuario }}</td>
										<td>
											<edit-user-component :user="item"/>
										</td>
									</tr>
								</tbody>
							</template>
							<template v-slot:no-data>
								<v-container fill-height>
									<v-row row wrap justify="center">
										<v-col xs="12" md="4" lg="3">
											<UndrawProblemSolving height="200" primary-color="#b5a08f" class="my-4"/>
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
						<paginate-user-list-component store="userSec" collection="users" :search="dt.search" />
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<!-- script -->

<script>
import UndrawProblemSolving from 'vue-undraw/UndrawProblemSolving'
import { mapState, mapMutations } from 'vuex'
import moment from 'moment'

export default {
	name: 'UserListComponent',
	components: { UndrawProblemSolving },
	data () {
		return {
			dt: {
				headers: [
					{ text: 'Nombre', sortable: false },
					{ text: 'Apellido paterno', sortable: false },
					{ text: 'Apellido materno', sortable: false },
					{ text: 'Usuario', sortable: false },
					{ text: 'Acciones', sortable: false },
				],
				search: '',
				pagination: {
					sortBy:"name",
					rowsPerPage: 5,
					rowsPerPageItems: [1, 2, 4, 8, 16],
					page: 1
				},
				quotes: [
					'Aún no hay usuarios registrados.'
				]
			},
			isComponentLoaded: false,
			dateParsers: [
				'YYYY-MM-DDHH:mm:ss',
				'YYYY-MM-DDHH:mm',
				'YYYY-MM-DD'
			]
		}
	},
	'hasChange'(value) {
		this.getDatas([0, this.dt.search])

	},
	computed: {
		...mapState('userSec', ['users', 'loading', 'hasChange'])
	},
	methods: {
		...mapMutations('userSec', ['getDatas', 'loadingList']),
    loadComponent() {
      setTimeout(() => {
        this.isComponentLoaded = true;
      }, 1000)
    }
	},
	mounted () {
		this.getDatas([0, this.dt.search])
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
