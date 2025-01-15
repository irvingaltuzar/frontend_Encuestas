<template>
	<v-container>
		<v-row row wrap>
			<v-col xs="12">
				<v-card id="create-user-card">
					<v-card-title class="primary white--text">
						<div class="subtitle-2">Crear asesor</div>
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
										<v-text-field class="subtitle-2" type="text" label="Nombre" v-model="contact.first_name" :error-messages="v.first_name" tabindex="1" color="primary"/>
										<v-text-field type="text" label="Apellido Paterno" v-model="contact.last_name" :error-messages="v.last_name2" tabindex="2" color="primary"/>
										<v-text-field type="text" label="Apellido Materno" v-model="contact.last_name2" :error-messages="v.last_name" tabindex="3" color="primary"/>
										<v-text-field :error-messages="v.contact_phone" counter maxlength="10" label="Télefono" v-model="contact.phone" color="primary" tabindex="4" min=0 max=10 />
										<v-autocomplete item-text="division_name" label="Desarrollo" item-value="division.id" :error-messages="v.cat_division_id" v-model="user.cat_division_id" color="primary" :items="cat_division" tabindex="5" multiple></v-autocomplete>
									</v-col>
									<v-col hidden-sm-and-down md="4">
										<UndrawAddUser height="180" width="100%" primary-color="#435363" class="my-4"/>
									</v-col>
								</v-row>
								<v-row row wrap>
									<v-col xs="12">
										<v-row row wrap class="mb-4" @click="onPickFile">
											<v-col class="dropzone-container" xs="12">
												<div class="dropzone-content">
													<v-icon large class="mb-2">touch_app</v-icon>
													<h3 class="dropzone-title title">Haz clic para seleccionar archivos de su computadora.</h3>
												</div>
												<input type="file" style="display: none" ref="fileInput" multiple  accept="image/*" @change="onFilePicked" />
											</v-col>
										</v-row>
									</v-col>
									<v-expand-transition>
										<v-col xs="12" md="4" v-if="contact.files">
											<v-list dense>
												<v-list-item v-for="(file, index) in contact.files" :key="index">
													<v-list-item-content>{{ file.name }}</v-list-item-content>
													<v-list-item-content class="align-end">
														<v-btn icon small @click="removeFile(index)">
															<v-icon small color="andaresBrand">mdi-close-outline</v-icon>
														</v-btn>
													</v-list-item-content>
												</v-list-item>
											</v-list>
										</v-col>
									</v-expand-transition>
								</v-row>
								<v-row row wrap>
									<v-col xs="12">
										<v-btn depressed rounded block :disabled="disabled" type="submit" color="primary" tabindex="13">
											<span v-if="!disabled" class="white--text">Crear asesor</span>
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
	name: 'CreateAdvisorComponent.vue',
  components: {
    UndrawAddUser
  },
	data () {
		return {
			contact: {
				first_name: '',
				last_name: '',
				last_name2: '',
				phone: '',
				files: []
			},
			user: {
				cat_division_id: [],
				nickname: '',
				new_password: '',
			},
			rules: {
				phone: [
					v => /^(1?\d{10})$/.test(v) || 'Número de telefono inválido',
				]
			},
			disabled: false,
			v: new Object()
		}
	},
	methods: {
		...mapMutations('advisor', ['getUserDivision', 'pushAdvisor']),
		...mapMutations('snackbar', ['showSnackbar']),
		onPickFile() {
			this.$refs.fileInput.click()
		},
		async onFilePicked(event) {

			const options = {
				maxSizeMB: 1,
				maxWidthOrHeight: 1920,
				useWebWorker: true
			}

			this.disabled = false

			const imageFile = event.target.files[0];

			this.disabled = false

			let extensions = ['jpg', 'jpeg', 'png']
			let files = Array.from(event.target.files).map(async file => {

				try {
					const compressedFile = await imageCompression(file, options);

					console.log(compressedFile); // smaller than maxSizeMB

					let reader = new FileReader()
					reader.readAsDataURL(compressedFile)

					let ext = file.name.split('.').pop()

					reader.onload = () => {
						this.contact.files.push({
							data: reader.result,
							name: file.name,
							ext: ext
						})
					}
				} catch (error) {
					console.log(error);
				}

			})
		},
		removeFile(index) {
			this.contact.files.splice(index, 1)

			this.contact.files.lenght == 	 0 ? this.$refs.fileupload.value=null : false
		},
		store () {

			this.disabled = true

			Api.post('/api/advisor/store', {
				first_name: this.contact.first_name,
				last_name: this.contact.last_name,
				last_name2: this.contact.last_name2,
				contact_phone: this.contact.phone,
				cat_division_id: this.user.cat_division_id,
				files: this.contact.files
			})
			.then((res) => {
				Object.assign(this.$data, this.$options.data.call(this))
				this.pushAdvisor(res.data)
				this.showSnackbar('El asesor ha sido dado de alta.')
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
		this.getUserDivision()
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
