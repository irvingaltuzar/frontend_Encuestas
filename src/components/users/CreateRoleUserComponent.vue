<template>
	<v-container>
		<v-row row wrap>
			<v-col xs="12">
				<v-card id="create-role-user-card">
					<v-card-title class="primary white--text">
						<div class="subtitle-2">Generar permisos</div>
					</v-card-title>
					<v-card-text>
						<v-form @submit.prevent="store">
							<v-container>
								<v-row row wrap>
									<v-col xs="12" md="6">
										<v-autocomplete item-text="subsecDesc" label="Subsección" item-value="subsecId" :error-messages="v.sub_section_id" color="primary" :items="sub_section" v-model="f.sub_section_id"></v-autocomplete>
									</v-col>
									<v-col xs="12" md="6">
										<v-autocomplete item-text="user.user_name" label="Usuario" return-object item-value="usuarioId" :error-messages="v.usuarioId" color="primary" :items="users" v-model="f.user"></v-autocomplete>
									</v-col>
								</v-row>
								<v-row row wrap>
									<v-col xs="12" md="6">
										<v-autocomplete chips multiple label="Permisos" item-value="value" :error-messages="v.permissions" color="primary" :items="this.permission" v-model="f.permissions"></v-autocomplete>
									</v-col>
								</v-row>
								<v-row row wrap>
									<v-col xs="12">
										<v-btn depressed rounded block :disabled="disabled" type="submit" color="primary" tabindex="13">
											<span v-if="!disabled" class="white--text">Guardar permiso</span>
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
import { mapMutations, mapState } from 'vuex'
import Api from "@/store/modules/Api"

export default {
	name: 'CreateRoleUserComponent.vue',
	data () {
		return {
			f: {
				sub_section_id: '',
				user: '',
				permissions: []
			},
			permission: [
				{
					text: 'Lectura',
					value: 'R'
				},
				{
					text: 'Crear',
					value: 'C'
				},
				{
					text: 'Actualizar',
					value: 'U'
				},
				{
					text: 'Eliminar',
					value: 'D'
				},
				{
					text: 'Imprimir',
					value: 'I'
				},
				{
					text: 'Exportar',
					value: 'E'
				},
				{
					text: 'Procesar',
					value: 'P'
				}
			],
			disabled: false,
			v: new Object()
		}
	},
	methods: {
		...mapMutations('userSec', ['getDatas', 'getSubSec']),
		...mapMutations('snackbar', ['showSnackbar']),
		store () {
			this.disabled = true

			Api.post('/api/permission/store', {
				user: this.f.user,
				sub_section_id: this.f.sub_section_id,
				permissions: this.f.permissions
			})
			.then(res => {
				this.showSnackbar('Permiso registrado correctamente')
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
		...mapState('userSec', ['users', 'sub_section']),
		...mapState('layout', ['sidebar']),
	},
	mounted () {
		this.getDatas()
		this.getSubSec()
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
