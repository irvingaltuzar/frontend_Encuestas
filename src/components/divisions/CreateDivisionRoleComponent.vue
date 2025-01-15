<template>
	<v-container>
		<v-row row wrap>
			<v-col xs="12">
				<v-card id="create-user-card">
					<v-card-title class="primary white--text">
						<div class="subtitle-2">Crear Rol</div>
					</v-card-title>
					<v-card-text>
						<v-form @submit.prevent="store">
							<v-container>
								<v-row row wrap>
									<v-col xs="12">
										<v-subheader class="mx-0 px-0">Información básica</v-subheader>
										<v-divider></v-divider>
									</v-col>
								</v-row>
								<v-row row wrap>
									<v-col xs="12" md="6">
										<v-text-field class="subtitle-2" type="text" label="Nombre del rol" v-model="f.description" :error-messages="v.description" tabindex="1" color="primary"/>
										<v-autocomplete item-text="description" label="Desarrollos" item-value="id" :error-messages="v.cat_division_id" v-model="f.cat_division_id" color="primary" :items="cat_division" tabindex="5" multiple></v-autocomplete>
									</v-col>
									<v-col hidden-sm-and-down md="4">
										<UndrawAddUser height="180" width="100%" primary-color="#435363" class="my-4"/>
									</v-col>
								</v-row>
								<v-row row wrap>
									<v-col xs="12">
										<v-btn depressed rounded block :disabled="disabled" type="submit" color="primary" tabindex="13">
											<span v-if="!disabled" class="white--text">Crear rol</span>
											<div v-else><v-icon>fas fa-circle-notch fa-spin</v-icon></div>
										</v-btn>
									</v-col>
								</v-row>
							</v-container>
						</v-form>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<!-- script -->

<script>
import imageCompression from 'browser-image-compression';
import UndrawAddUser from 'vue-undraw/UndrawAddUser'
import { mapMutations, mapState } from 'vuex'
import Api from "@/store/modules/Api"

export default {
	name: 'CreateDivisionRoleComponent',
  components: {
    UndrawAddUser
  },
	data () {
		return {
			f: {
				cat_division_id: [],
				description: '',
			},
			disabled: false,
			v: new Object()
		}
	},
	methods: {
		...mapMutations('advisor', ['getCatDivision']),
		...mapMutations('division', ['loadingList']),
		...mapMutations('snackbar', ['showSnackbar']),
		store () {

			this.disabled = true

			Api.post('/api/division/store-role', {
				description: this.f.description,
				cat_division_id: this.f.cat_division_id,
			})
			.then((res) => {
				Object.assign(this.$data, this.$options.data.call(this))
				this.loadingList()
				this.showSnackbar('Rol guardado correctamente.')
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
		...mapState('advisor', ['cat_division']),
	},
	mounted () {
		this.getCatDivision()
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

	.dropzone-container {
		cursor: pointer;
		min-height: 180px;
		border: 2px dashed rgba(0,0,0,.54);
	}
	.dropzone-content{
		text-align: center;
		margin-top: 4rem;
		color: #777;
	}

	.v-list__tile__title {
		text-align: center!important;
	}

</style>
