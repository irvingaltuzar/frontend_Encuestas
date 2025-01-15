<template>
	<v-container>
		<v-row row wrap>
			<!-- v-col -->
			<v-col xs="12">
				<v-container>
					<v-row row wrap>
						<v-col xs="12" pt-4 mb-4>
							<v-subheader class="mx-0 px-0">Desarrollos</v-subheader>
							<v-divider></v-divider>
						</v-col>
					</v-row>
					<v-row row wrap justify-end fill-height>
						<v-col xs="12" md="6" lg="4">
							<v-text-field single-line hide-details label="Buscar" append-icon="search" v-model="dt.search"/>
						</v-col>
					</v-row>
				</v-container>
				<v-data-table :headers="dt.headers" :options.sync="dt.pagination" :page.sync="user_divisions.current_page" :items="user_divisions.data[0].user_divisions" :loading="loading" hide-default-footer mobile-breakpoint="0"  @page-count="user_divisions.total = $event">
					<template v-slot:body="{ items }">
						<tbody>
							<tr v-for="(item, index) in items" :key="index">
								<td class="text-center">
									{{ item.division_name }}
								</td>
								<!-- <td>
									<img :src="item.division_logo_url" class="center-block">
								</td> -->
								<td class="text-center">
									<img :src="`${url}/storage/logos/${item.division.logo_dmi}`" class="center-block">
								</td>
								<td class="text-center">
									<img :src="`${url}/storage/logos/${item.division.logo_nai}`" class="center-block">
								</td>
								<td class="text-center">
									<edit-division-component :advisors="item.division.get_advisor_by_division" :division="item.division"/>
								</td>
							</tr>
						</tbody>
					</template>
					<template v-slot:no-data>
						<v-container fill-height>
							<v-row row wrap justify="center">
								<v-col xs="12" md="6" lg="6">
									<UndrawBrowserStats height="200" primary-color="#FF3D00" class="my-4"/>
									<div class="subtitle-2 font-weight-regular text-xs-center grey--text">
										{{ dt.quotes[~~(Math.random() * dt.quotes.length)] }}
									</div>
								</v-col>
							</v-row>
						</v-container>
					</template>
				</v-data-table>
				<paginate-component store="division" collection="user_divisions" :search="dt.search" />
			</v-col>
		</v-row>
	</v-container>
</template>

<!-- Script -->

<script>
	import { mapState, mapMutations } from 'vuex'
	import UndrawBrowserStats from 'vue-undraw/UndrawBrowserStats'

	export default {
		name: 'DivisionListComponent',
		components: { UndrawBrowserStats },
		data () {
			return {
				dt: {
					headers: [
						{ text: 'Nombre', sortable: false, align: 'center',},
						{ text: 'Logo DMI', sortable: false, align: 'center',},
						{ text: 'Logo NAI', sortable: false, align: 'center',},
						{ text: 'Asesores', sortable: false, align: 'center',},
					],
					search: '',
					pagination: {
						sortBy:"name",
						rowsPerPage: 5,
						rowsPerPageItems: [1, 2, 4, 8, 16],
						page: 1
					},
					disabled: false,
					quotes: [
						'Registra un desarrollo para poder gestionarlo.'
					]
				},
				url: process.env.VUE_APP_API_URL
			}
		},
		methods: {
			...mapMutations('division', ['getUserDivisions'])
		},
		computed: {
			...mapState('division', ['user_divisions', 'loading'])
		},
		mounted () {
			this.getUserDivisions([0, this.dt.search])
		}
	}

</script>

<!-- Style -->

<style lang="scss" scoped>
	img.center-block {
		display: block;
		margin-left: auto;
		margin-right: auto;
		margin-top: 1em;
		width:5rem;
		margin-bottom: 2em;
	}
</style>

