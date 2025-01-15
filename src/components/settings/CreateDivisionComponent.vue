<template>
	<v-form @submit.prevent="store">
		<v-stepper v-model="step" vertical>
			<v-stepper-step :complete="step > 1" step="1">
				Nombre del desarrollo
				<!-- <small>Configura el nombredel desarrollo</small> -->
			</v-stepper-step>

			<v-stepper-content step="1">
				<v-form lazy-validation ref="form" autocomplete="off" @submit.prevent="store">
					<v-container>
						<v-row row wrap>
							<v-flex xs12 md6>
								<v-text-field :rules="rules.description" v-model="division.description" label="Nombre del desarrollo" color="primary"></v-text-field>
							</v-flex>
						</v-row>
						<!-- v-layout -->
						<v-row row wrap>
							<v-col xs="12">
								<v-btn depressed rounded block :disabled="disabled" type="submit" color="primary">
									<span v-if="!disabled" class="white--text">Crear desarrollo</span>
									<div v-else><v-icon class="white--text">mdi-sync</v-icon></div>
								</v-btn>
							</v-col>
						</v-row>
					</v-container>
				</v-form>
			</v-stepper-content>
		</v-stepper>
	</v-form>
</template>

<!-- Script --->

<script>
	import { mapMutations, mapState } from 'vuex'
	import Api from "@/store/modules/Api"

  export default {
		name: 'CreateDivisionComponent',
    data () {
      return {
				division: {
					files:[],
					dmi_files:[],
					general_files: [],
					description: ''
				},
				rules: {
					description: [
						v => !!v || 'Nombre del desarrollo es requerido'
					]
				},
				disabled: false
      }
    },
		methods: {
			...mapMutations('division', ['nextStep', 'pushDivision', 'resetStep']),
			...mapMutations('snackbar', ['showSnackbar']),

			onPickFile() {
				this.$refs.fileInput.click()
			},
			onPickDmiFile() {
				this.$refs.fileDmiInput.click()
			},
			onPickGeneralFile() {
				this.$refs.fileGeneralInput.click()
			},
			onFilePicked(event) {
				this.disabled = false

				// this.division.files.push(Object.values(event.target.files))
				this.division.files = Object.values(event.target.files)
			},
			onFileDmiPicked(event) {
				this.disabled = false

				// this.division.files.push(Object.values(event.target.files))
				this.division.dmi_files = Object.values(event.target.files)
			},
			onFileGeneralPicked(event) {
				this.disabled = false

				// this.division.files.push(Object.values(event.target.files))
				this.division.general_files = Object.values(event.target.files)
			},
			removeFile(index) {
				this.division.files.splice(index, 1)

				this.division.files.lenght == 0 ? this.$refs.fileInput.value=null : false
				this.disabled = true
			},
			removeDmiFile(index) {
				this.division.dmi_files.splice(index, 1)

				this.division.dmi_files.lenght == 0 ? this.$refs.fileDmiInput.value=null : false
				this.disabled = true
			},
			removeGeneralFile(index) {
				this.division.general_files.splice(index, 1)

				this.division.general_files.lenght == 0 ? this.$refs.fileGeneralInput.value=null : false
				this.disabled = true
			},
			validate () {
				if (this.$refs.form.validate()) {
					// this.setBasicInformation(this.employee)
					this.nextStep()
				} else {
					return false
				}
			},
			next () {
				this.nextStep()
				this.disabled = true
			},
			store () {
				this.disabled = true

				Api.post('/api/division/store', {
					description: this.division.description
				})
				.then(res => {
					this.pushDivision(res.data)
					this.showSnackbar('Desarrollo registrado correctamente.')
					Object.assign(this.$data, this.$options.data.call(this))
					this.resetStep()
				})
				.catch(error => {
					console.log(error)
				})
				.finally(() => {
					this.disabled = false
				})
			}
		},
		computed: {
			...mapState('division', ['step']),
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
