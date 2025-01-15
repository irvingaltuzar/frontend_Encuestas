<template>
  <v-row >
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on, attrs }">
				<v-btn class="mx-2" depressed fab dark small color="primary"  v-bind="attrs" v-on="on">
					<v-icon dark>
						mdi-human-edit
					</v-icon>
				</v-btn>
      </template>
      <v-card class="text-subtitle-2">
        <v-toolbar dark color="primary" class="subtitle-1">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="subtitle-1">Configuración de usuario</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
				<v-form @submit.prevent="update">
					<v-container>
						<v-row row wrap>
							<v-col xs="12">
								<v-subheader class="mx-0 px-0">Información básica</v-subheader>
								<v-divider></v-divider>
							</v-col>
						</v-row>
						<v-row row wrap fill-height>
							<v-col xs="12" md="4">
								<v-text-field class="subtitle-2" type="text" label="Nombre" v-model="contact.first_name" :error-messages="v.nombre" tabindex="1" color="primary"/>
							</v-col>
							<v-col xs="12" md="4">
								<v-text-field type="text" label="Apellido Paterno" v-model="contact.last_name" :error-messages="v.apepa" tabindex="2" color="primary"/>
							</v-col>
							<v-col xs="12" md="4">
								<v-text-field type="text" label="Apellido Materno" v-model="contact.last_name2" :error-messages="v.apema" tabindex="3" color="primary"/>
							</v-col>
						</v-row>
						<v-row row wrap>
							<v-col xs="12">
								<v-subheader class="mx-0 px-0">Información de sesión</v-subheader>
								<v-divider></v-divider>
							</v-col>
						</v-row>
						<v-row row wrap>
							<v-col class="hidden-sm-and-down" md="4">
								<UndrawAuthentication height="180" width="100%" primary-color="#435363" class="my-4"/>
								<div class="caption font-weight-regular text-xs-center grey--text">
									Edita la información del usuario.
								</div>
							</v-col>
							<v-col md="8">
								<v-row row wrap>
									<v-col xs="12" md="3">
										<v-switch v-model="contact.is_admin" label="Administrador"></v-switch>
									</v-col>
								</v-row>
								<v-row row wrap>
									<v-col xs="12" md="6">
										<v-autocomplete item-text="description" label="Desarrollo" item-value="id" small-chips v-model="contact.divisions" :error-messages="v.divisions" color="primary" :items="cat_division" multiple deletable-chips></v-autocomplete>
									</v-col>
									<v-col xs="12" md="6">
										<div v-if="contact.is_director">
											<v-autocomplete item-text="description" label="Rol" item-value="bucket" v-model="contact.divisions_by_role" color="primary" :items="roles" :error-messages="v.divisions_by_role" @change="setDivisions()"></v-autocomplete>
										</div>
									</v-col>
								</v-row>
							</v-col>
						</v-row>
						<v-row row wrap>
							<v-col xs="12">
								<v-btn depressed rounded block :disabled="disabled" type="submit" color="primary" tabindex="13">
									<span v-if="!disabled" class="white--text">Actualizar datos</span>
									<div v-else><v-icon>fas fa-circle-notch fa-spin</v-icon></div>
								</v-btn>
							</v-col>
						</v-row>
					</v-container>
				</v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import UndrawAuthentication from 'vue-undraw/UndrawAuthentication'
import { mapState, mapMutations } from 'vuex'
import Api from "@/store/modules/Api"

  export default {
		name: 'EditUserComponent',
		components: { UndrawAuthentication },
		props: {
      user: {
        required: true
      },
		},
    data () {
      return {
				f: {
					permits: null
				},
				brand_name: '',
				position_name: '',
				type: '',
				contact: {
					id: '',
					first_name: '',
					last_name: '',
					last_name2: '',
					position: '',
					show_complaints: '',
					show_warnings: '',
					email: '',
					brand_id: '',
					is_admin: '',
					phone: '',
					divisions: [],
					emails: [],
					phones: []
				},
        dialog: false,
        notifications: false,
        sound: true,
        widgets: false,
				disabled: false,
				v: new Object()
      }
    },
		watch: {
			user: {
				immediate: true,
				handler (val, oldVal) {

					var tmp_array = []

					this.contact.first_name = val.nombre
					this.contact.last_name = val.apepa
					this.contact.last_name2 = val.apema
					this.contact.is_admin = val.isadm == 1 ? true : false
					this.contact.id = val.usuarioId

					val.user_divisions.forEach( e => tmp_array.push(parseInt(this.cat_division.find( data => data.id == e.cat_division_id).id)))

					this.contact.divisions = tmp_array.filter((v, i, a) => a.indexOf(v) == i)
					// this.contact.divisions.push(parseInt(this.cat_division.find( data => data.id = val.user_divisions.forEach( e => e.cat_division_id)).id))
				}
			},
		},
		methods: {
			...mapMutations('snackbar', ['showSnackbar']),
			...mapMutations('settings', ['storeAudit']),
			...mapMutations('userSec', ['getDatas']),
			update () {

				this.disabled = true

				Api.post('/api/user/update', {
					nombre: this.contact.first_name,
					apepa: this.contact.last_name,
					apema: this.contact.last_name2,
					is_admin: this.contact.is_admin,
					id: this.contact.id,
					divisions: this.contact.divisions
				})
				.then((res) => {
					Object.assign(this.$data, this.$options.data.call(this))
					this.getDatas( [1, '' ])
					this.showSnackbar('El usuario ha sido actualizado de alta.')
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
		},
		computed: {
			...mapState('userSec', ['cat_division']),
		},
		mounted () {
			// console.log(this.cat_division)
		}
  }
</script>
