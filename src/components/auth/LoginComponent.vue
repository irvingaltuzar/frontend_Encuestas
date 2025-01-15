<template>
	<v-app>
		<div id="particles"></div>
		<v-container fluid class="card-container">
			<v-row justify="center">
				<v-col xs="12" md="3">
					<v-card>
						<v-card-text>
							<img src="@/assets/img/GrupoDMI_logo.svg" class="center-block">
							<v-form ref="form" @submit.prevent="login" autocomplete="off">
								<v-text-field :rules="rules.user" label="Usuario" prepend-icon="person" color="andaresBrand" v-model="f.user"></v-text-field>
								<v-text-field :rules="rules.password" type="password" label="Contraseña" prepend-icon="lock" color="andaresBrand" v-model="f.password"></v-text-field>
								<v-btn block depressed rounded color="#435363" class="white--text" type="submit">Ingresar</v-btn>
							</v-form>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-app>
</template>

<!-- script -->

<script>
import options from '@/assets/json/particles-config.json'
import { mapState, mapMutations } from 'vuex'
import 'particles.js'

export default {
	name: 'LoginComponent',
	data() {
		return {
			f: {
				user: '',
				password: ''
			},
			rules: {
				user: [
					v => !!v || 'Usuario es requerido'
				],
				password: [
					v => !!v || 'Contraseña es requerida'
				]
			}
		}
	},
	methods: {
		...mapMutations('snackbar', ['showSnackbar']),
		initParticles () {
			window.particlesJS('particles', options)
		},
		login() {
			if (this.validate()) {
				this.$store.dispatch('user/login', this.f).then((res) => {
					if (!!res.logged) {
						// this.$router.push({
						// 	path: this.redirect || '/home',
						// })
						setTimeout(() => {
							this.$router.push({
								path: this.redirect || '/home',
							})
							this.$store.dispatch('layout/getSidebar')
						}, 2000)
					} else {
						this.$store.dispatch('user/resetToken').then(() => {
							this.showSnackbar('Ocurrió un error, favor de intentar nuevamente.')
						})
					}
				})
				.catch( error => {
					this.$store.dispatch('user/resetToken').then(() => {
						this.showSnackbar('Estas credenciales no coinciden con nuestros registros.')
					})
				})
			} else {
				return false
			}
		},
		validate() {
			return this.$refs.form.validate()
		}
	},
	mounted () {
		this.initParticles()
	}
}
</script>

<!-- Style -->

<style lang="scss" scoped>

	#app {
		background: linear-gradient(to right, #435363, #435363);
	}
	.undecorated, .undecorated:link,
	.undecorated:visited, .undecorated:hover,
	.undecorated:active {
		text-decoration: none;
	}

	img.center-block {
		display: block;
		margin-left: auto;
		margin-right: auto;
		margin-top: 0em;
		width:60%;
		margin-bottom: 2em;
	}

	.card-container {
		top: 0 !important;
		position: fixed;
		margin-top: 15%;
	}
</style>
