<template>
	<v-row row wrap>
		<v-col hidden-sm-and-down md="4">
			<UndrawAuthentication height="180" width="100%" primary-color="#FF3D00" class="my-4"/>
			<div class="caption font-weight-regular text-xs-center grey--text">
				Asegúrate que tenga 8 caracteres o más.
			</div>
		</v-col>
		<v-col xs="12" md="8">
			<ValidationObserver v-slot="{ handleSubmit }">
				<v-form  @submit.prevent="handleSubmit(store)">
					<v-text-field :type="icons.old_password ? 'text' : 'password'" :error-messages="v.message" v-model="old_password" label="Contraseña actual">
						<template #append-outer>
							<v-btn small icon @click="switchVisibility('old_password')">
								<v-icon color="grey darken-1">{{ icons.old_password ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
							</v-btn>
						</template>
					</v-text-field>

					<ValidationProvider rules="required|min:8" name="Password" vid="password" v-slot="{ errors }">
						<v-text-field :type="icons.new_password ? 'text' : 'password'" :error-messages="errors[0]" v-model="new_password" label="Nueva contraseña">
							<template #append-outer>
								<v-btn small icon @click="switchVisibility('new_password')">
									<v-icon color="grey darken-1">{{ icons.new_password ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
								</v-btn>
							</template>
						</v-text-field>
					</ValidationProvider>

					<ValidationProvider rules="required|confirmed:password" name="pwd_confirm" v-slot="{ errors }">
						<v-text-field :type="icons.confirm_password ? 'text' : 'password'" :error-messages="errors[0]" v-model="confirm_password" label="Confirmar nueva contraseña" @change="checkText($event)">
							<template #append-outer>
								<v-btn small icon @click="switchVisibility('confirm_password')">
									<v-icon color="grey darken-1">{{ icons.confirm_password ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
								</v-btn>
							</template>
						</v-text-field>
					</ValidationProvider>
					<v-row row wrap>
						<v-col xs="12">
							<v-btn depressed rounded block :disabled="disabled" type="submit" color="primary">
								<span v-if="!disabled" class="white--text">Actualizar contraseña</span>
								<div v-else><v-icon class="white--text spin">mdi-sync</v-icon></div>
							</v-btn>
						</v-col>
					</v-row>
				</v-form>
			</ValidationObserver>
		</v-col>
	</v-row>
</template>

<!-- script -->

<script>
import { mapState , mapMutations } from 'vuex'
import UndrawAuthentication from 'vue-undraw/UndrawAuthentication'
import Api from "@/store/modules/Api"

export default {
  name: "ChangePasswordComponent",
  components: {
    UndrawAuthentication
  },
	data () {
		return {
			old_password: '',
			new_password: '',
			confirm_password: '',
			icons: {
				old_password: false,
				new_password: false,
				confirm_password: false
			},
			disabled: false,
			v: new Object()
		}
	},
	methods: {
		...mapMutations('snackbar', ['showSnackbar']),
		switchVisibility (type) {
			this.icons[type] = !!!this.icons[type]
		},
		checkText (event) {
			console.log(event)
		},
		store () {
			this.disabled = true

			Api.post('/api/user/change-pwd', {
				old_password: this.old_password,
				new_password: this.new_password
			})
			.then(res => {
				this.showSnackbar(res.data.message)
				Object.assign(this.$data, this.$options.data.call(this))
			})
			.catch(error => {
				this.v = new Object()
				setTimeout(() => {
					this.v = error.response.data
				}, 50)
				this.icons.old_password = true
				this.showSnackbar(error.response.data.message)
			})
			.finally(() => {
				this.disabled = false
			})
		}
	},
	mounted () {
	this.locale = this.locale == "es" ? "es" : "es";
	}
};
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
