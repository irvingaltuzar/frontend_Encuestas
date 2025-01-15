<template>
	<v-container>
		<v-row row wrap>
			<v-col xs="12">
				<v-card id="create-user-card">
					<v-card-title class="primary white--text">
						<div class="subtitle-2">Crear usuario</div>
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
											Las contraseñas se generan automaticamente.
										</div>
									</v-col>
									<v-col md="8">
										<v-row row wrap>
											<v-col xs="12" md="3">
												<v-switch v-model="contact.is_director" label="Director / Jefe"></v-switch>
											</v-col>
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
										<v-row row wrap>
											<v-col xs="12" md="6">
												<v-text-field :error-messages="v.emails" counter="255" label="Correo" v-model="contact.email" @keydown.tab.prevent="addEmail" @keydown.enter.prevent="addEmail" color="primary"></v-text-field>
											</v-col>
										</v-row>
									</v-col>
								</v-row>
								<v-row row wrap>
									<v-col xs="12">
										<v-btn depressed rounded block :disabled="disabled" type="submit" color="primary" tabindex="13">
											<span v-if="!disabled" class="white--text">Crear cuenta usuario</span>
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
import UndrawQuestions from 'vue-undraw/UndrawQuestions'
import UndrawAuthentication from 'vue-undraw/UndrawAuthentication'
import { mapMutations, mapState } from 'vuex'
import Api from "@/store/modules/Api"

export default {
	name: 'CreateUserComponent.vue',
	components: {
		UndrawAuthentication,
		UndrawQuestions
	},
	data () {
		return {
			contact: {
				first_name: '',
				last_name: '',
				last_name2: '',
				is_director: false,
				is_admin: '',
				divisions_by_role: [],
				divisions: [],
				phones: [],
				emails: [],
				email: '',
			},
			dob: {
				activePicker: null,
				date: new Date().toISOString().substring(0, 10),
				max: new Date().toISOString().substring(0, 10),
				min: '1950-01-01',
				calendar: false
			},
			user: {
				nickname: '',
				new_password: '',
				brand_id: 1,
				cat_user_type_id: '',
				user_type_id: '',
				icons: {
					old_password: false,
					new_password: false,
					confirm_password: false
				}
			},
			address: {
				line1: '',
				line2: '',
			},
			rules: {
				email: [
					v => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v) || 'Dirección de correo inválida.'
				],
				phone: [
					v => /^(1?\d{10})$/.test(v) || 'Número de telefono inválido',
				]
			},
			disabled: false,
			v: new Object()
		}
	},
	methods: {
		...mapMutations('snackbar', ['showSnackbar']),
		...mapMutations('userSec', ['getCatDivision']),
		...mapMutations('tools', ['getRoles']),
		setDivisions () {
			this.contact.divisions = []
			this.contact.divisions_by_role.forEach( e => this.contact.divisions.push(parseInt(e.cat_division_id)))
		},
		addEmail () {
			this.contact.emails = []
			if (this.validateEmail(this.contact.email)) {
				const trimmedText = this.contact.email.trim()
				if (trimmedText) {
					this.contact.emails.push(this.contact.email)
					this.v.emails = null
				}
			} else {
				this.v.emails = "Introduce un email correcto."
			}
		},
		validateEmail (value) {
			var regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i

			return regex.test(value) ? true : false
		},
		setUser () {
			let first_name = this.contact.first_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
			let without_space = first_name.split(" ")

			let new_name = without_space[0].toLowerCase() + '.' + this.contact.last_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

		},
		store () {
			this.addEmail()
			let first_name = this.contact.first_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
			let without_space = first_name.split(" ")
			let new_name = without_space[0].toLowerCase() + '.' + this.contact.last_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

			this.disabled = true

			Api.post('/api/user/store', {
				nombre: this.contact.first_name,
				apepa: this.contact.last_name,
				apema: this.contact.last_name2,
				username: new_name,
				emails: this.contact.emails,
				divisions_by_role: this.contact.divisions_by_role,
				is_director: this.contact.is_director,
				is_admin: this.contact.is_admin,
				divisions: this.contact.divisions
			})
			.then((res) => {
				Object.assign(this.$data, this.$options.data.call(this))
				this.pushUser(res.data)
				this.showSnackbar('El usuario ha sido dado de alta.')
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
	},
	computed: {
		...mapState('tools', ['roles']),
		...mapState('userSec', ['cat_division']),
		computedDate () {
			return this.formatDate(this.dob.date)
		}
	},
	mounted () {
		this.getRoles()
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

</style>
