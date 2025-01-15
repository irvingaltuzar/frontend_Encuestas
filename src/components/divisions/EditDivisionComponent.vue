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
          <v-toolbar-title class="subtitle-1">Configuración de desarrollo
					</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
				<v-form @submit.prevent="update">
					<v-container>
						<v-row row wrap>
							<v-col xs="12">
								<v-subheader class="mx-0 px-0">Información básica</v-subheader>
								<advisor-list-component />
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
			advisors: {
				required: true
			},
		},
    data () {
      return {
				division: {
					id: '',
					description: ''
				},
        widgets: false,
				dialog: false,
				disabled: false,
				v: new Object()
      }
    },
		watch: {
			advisors: {
				immediate: true,
				handler (val, oldVal) {

					var tmp_array = []

					this.division.id = val.id
					// this.contact.divisions.push(parseInt(this.cat_division.find( data => data.id = val.user_divisions.forEach( e => e.cat_division_id)).id))
				}
			},
		},
		methods: {
			...mapMutations('snackbar', ['showSnackbar']),
			...mapMutations('settings', ['storeAudit']),
			...mapMutations('userSec', ['getDatas']),
			update () {

				// this.disabled = true

				// Api.post('/api/user/update', {
				// 	id: this.contact.id,
				// })
				// .then((res) => {
				// 	Object.assign(this.$data, this.$options.data.call(this))
				// 	this.getDatas( [1, '' ])
				// 	this.showSnackbar('El usuario ha sido actualizado de alta.')
				// })
				// .catch(error => {
				// 	this.v = new Object()
				// 	setTimeout(() => {
				// 		this.v = error.response.data.errors
				// 	}, 50)
				// })
				// .finally(() => {
				// 	this.disabled = false
				// })
			}
		},
		computed: {
			...mapState('advisor', ['cat_division']),
		}
  }
</script>
