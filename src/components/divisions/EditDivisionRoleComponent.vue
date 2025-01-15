<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px" >
      <template v-slot:activator="{ on, attrs }">
				<v-btn class="mx-2" depressed fab dark small color="primary"  v-bind="attrs" v-on="on">
					<v-icon dark>
						mdi-office-building-cog-outline
					</v-icon>
				</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Desarrollos asignados</span>
        </v-card-title>
				<v-form @submit.prevent="update">
	        <v-card-text>
						<v-container>
							<v-row>
								<v-col cols="12" xs="12" md="12" lg="12">
									<v-autocomplete item-text="description" label="Desarrollo" item-value="id" small-chips v-model="cat_divisions_id" :error-messages="v.cat_divisions_id" color="primary" :items="cat_division" tabindex="5" multiple deletable-chips/>
								</v-col>
							</v-row>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="blue darken-1" text @click="dialog = false" >
							Cerrar
						</v-btn>
						<v-btn :disabled="disabled" type="submit" color="primary">
							Guardar
						</v-btn>
					</v-card-actions>
				</v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	import Api from "@/store/modules/Api"
  export default {
		name: 'EditDivisionRoleComponent',
		props: {
      divisions: {
        required: true
      },
		},
    data: () => ({
			dialog: false,
			cat_divisions_id: [],
			id: '',
			tmp_array: [],
			disabled: false,
			v: new Object()
    }),
		watch: {
			divisions: {
				immediate: true,
				handler (val, oldVal) {

					var tmp_array = []

					val.bucket.forEach( e => tmp_array.push(parseInt(this.cat_division.find( data => data.id = e.cat_division_id).id)))

					this.id = val.id

					this.cat_divisions_id = tmp_array.filter((v, i, a) => a.indexOf(v) == i)
				}
			},
		},
		computed: {
			...mapState('advisor', ['cat_division'])
		},
		methods: {
			...mapMutations('division', ['getDivisionRoles', 'loadingList']),
			update () {

				this.disabled = true

				Api.post('/api/division/role/update', {
					id: this.id,
					cat_divisions_id: this.cat_divisions_id
				})
				.then((res) => {
					Object.assign(this.$data, this.$options.data.call(this))
					this.getDivisionRoles([0, ''])
					this.showSnackbar('Desarrollos actualizados correctamente')
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
			}
		}
  }
</script>
