<template>
	<v-container>
		<v-row row wrap>
			<v-col xs="12">
				<v-card id="create-poll-card">
					<v-card-title class="primary white--text">
						<div>
							<div class="subtitle-2">Crear encuesta</div>
						</div>
					</v-card-title>
					<v-card-text>
						<v-form ref="form" @submit.prevent="store">
							<v-container>
								<v-row row wrap>
									<v-col xs="12" md="6">
										<v-text-field label="Nombre de la encuesta" v-model="title" :error-messages="v.title"></v-text-field>
									</v-col>
									<v-col xs="12" md="6">
										<v-autocomplete item-text="type_name" label="Tipo de encuesta"  :error-messages="v.poll_type_id" color="primary" :items="user_poll_type.user_polls" return-object @change="setAdvisor($event)"/>
									</v-col>
								</v-row>
								<v-expand-transition>
									<v-row row wrap v-if="status == 1">
										<v-col xs="12" md="6">
											<v-autocomplete item-text="division_name" label="Desarrollo" item-value="cat_division_id" :error-messages="v.division_id" v-model="division_id" color="primary" :items="cat_user_divisions" @change="autoCompleteUser($event)"></v-autocomplete>
										</v-col>
										<v-expand-transition>
											<v-col xs="12" md="6" v-if="advisors_by_division.length > 0">
													<v-autocomplete :items="advisors_by_division" item-text="advisor_name" multiple small-chips :error-messages="v.advisor_id" v-model="filterItems"  color="primary" return-object>
														<template v-slot:selection="{ item, index }">
															<v-chip v-if="index == 0">
																<span>{{ item.advisor_name }}</span>
															</v-chip>
															<span v-if="index == 1" class="grey--text text-caption">
																(+{{ filterItems.length - 1 }} otros)
															</span>
														</template>
													</v-autocomplete>
													<span style="cursor:pointer;" @click="selectAll()">Seleccionar todos</span><span> - </span> <span @click="clearAll()">Limpiar</span>
												<!-- <v-autocomplete item-text="advisor_name" label="Asesor" item-value="id" :error-messages="v.advisor_id" v-model="advisor_id" color="primary" :items="cat_advisors_by_division"></v-autocomplete> -->
											</v-col>
										</v-expand-transition>
									</v-row>
								</v-expand-transition>
								<v-row row wrap>
									<v-col xs="12" md="6">
										<v-menu ref="publish_at" v-model="pickers.publish_at.calendar" :close-on-content-click="false" offset-y min-width="290px">
											<template v-slot:activator="{ on }">
												<v-text-field label="Fecha en que se publica" readonly v-on="on" v-model="computedPublishAt" :error-messages="v.publish_at" />
											</template>
											<v-date-picker landscape scrollable locale="es-mx" :min="pickers.publish_at.min" v-model="pickers.publish_at.date" @change="setPublishAtDate" color="primary"/>
										</v-menu>
									</v-col>
									<!-- v-col -->
									<v-col xs="12" md="6">
										<v-menu ref="remove_at" v-model="pickers.remove_at.calendar" :close-on-content-click="false" offset-y min-width="290px">
											<template v-slot:activator="{ on }">
												<v-text-field label="Fecha en que se retira" readonly v-on="on" v-model="computedRemoveAt" :error-messages="v.remove_at" />
											</template>
											<v-date-picker landscape scrollable locale="es-mx" :min="pickers.remove_at.min" v-model="pickers.remove_at.date" @change="setRemoveAtDate" color="primary"/>
										</v-menu>
									</v-col>
								</v-row>
								<v-expand-transition>
									<v-row row wrap v-if="!!!status">
										<v-col xs="12" md="6">
											<v-menu ref="publish_time" v-model="pickers.publish_time.menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y max-width="290px" min-width="290px">
												<template v-slot:activator="{ on }">
													<v-text-field v-model="pickers.publish_time.time" label="Hora de inicio" prepend-inner-icon="access_time" :error-messages="v.time_start" readonly v-on="on" color="primary"></v-text-field>
												</template>
												<v-time-picker v-model="pickers.publish_time.time" @change="setPermitTime" color="primary"></v-time-picker>
											</v-menu>
										</v-col>
										<v-col xs="12" md="6">
											<v-menu ref="end_time" v-model="pickers.end_time.menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y max-width="290px" min-width="290px">
												<template v-slot:activator="{ on }">
													<v-text-field v-model="pickers.end_time.time" label="Hora de finalización" prepend-inner-icon="access_time" :error-messages="v.time_end" readonly v-on="on" color="primary"></v-text-field>
												</template>
												<v-time-picker v-model="pickers.end_time.time"  @change="setEndTime" color="primary"></v-time-picker>
											</v-menu>
										</v-col>
									</v-row>
								</v-expand-transition>
								<v-row row wrap>
									<v-col xs="12" md="6">
										<v-text-field :error-messages="v.description" counter label="Texto de bienvenida" v-model="description" color="primary"/>
									</v-col>
									<v-col xs="12" md="6">
										<v-text-field :error-messages="v.responsable_phone" counter maxlength="10" label="Télefono de responsable" v-model="responsable_phone" color="primary" min=0 max=10 />
									</v-col>
								</v-row>
								<v-row row wrap>
									<v-col xs="12" md="6">
										<v-textarea auto-grow label="Mensaje de despedida" rows="1" :error-messages="v.message" v-model="message" color="primary"></v-textarea>
									</v-col>
								</v-row>
								<v-row row wrap>
									<v-col xs="12">
										<v-row row wrap class="mb-4" @click="onPickFile">
											<v-col class="dropzone-container" xs="12">
												<div class="dropzone-content">
													<v-icon large class="mb-2">touch_app</v-icon>
													<h3 class="dropzone-title title">Haz clic para seleccionar archivos de su computadora y subir la imagen de fondo de encuesta.</h3>
												</div>
												<input type="file" style="display: none" ref="fileInput"  accept="image/*" @change="onFilePicked" />
											</v-col>
										</v-row>
									</v-col>
									<v-expand-transition>
										<v-col xs="12" md="12" v-if="files">
											<v-list dense>
												<v-list-item v-for="(file, index) in files" :key="index">
													<v-list-item-content>{{ file.name }}</v-list-item-content>
													<v-list-item-content class="align-end">
														<v-btn icon small @click="removeFile(index)">
															<v-icon small color="primary">mdi-close-outline</v-icon>
														</v-btn>
													</v-list-item-content>
												</v-list-item>
											</v-list>
										</v-col>
									</v-expand-transition>
								</v-row>
								<v-row row wrap>
									<!-- v-col -->
									<v-col xs="12">
										<v-subheader class="px-0">Crear encuesta</v-subheader>
										<!-- <div v-if="v.questions">
											<v-alert dense outlined type="error">
												I'm a dense alert with the <strong>outlined</strong> prop and a <strong>type</strong> of error
											</v-alert>
										</div> -->
										<v-divider></v-divider>
									</v-col>
									<!-- v-col -->
								</v-row>
									<!-- v-col -->
									<v-col xs="12" v-for="(question, i) in questions" :key="i">
										<v-chip close color="primary" text-color="white" class="my-2 mx-0 px-0" v-model="questions[i].chip"  @click:close="removeQuestion(i)">
											<v-avatar class="primary darken-4">{{ i + 1 }}</v-avatar>
											{{ `de ${questions.length} preguntas` }}
										</v-chip>
										<v-row row wrap>
											<v-col xs="12" md="6">
												<v-text-field counter maxlength="120" :ref="`q${i}`" label="Escribe tu pregunta" v-model="questions[i].question" @keydown.enter.prevent="focusOptionInput(i)" min=0 max=120></v-text-field>
											</v-col>
											<v-col xs="12" md="6">
												<v-autocomplete item-text="description" label="Tipo de pregunta" item-value="id" :error-messages="v.type" v-model="questions[i].type" color="primary" :items="cat_question_type"></v-autocomplete>
											</v-col>
										</v-row>
										<div v-if="questions[i].type == 1">
											<v-row v-for="(option, j) in questions[i].options" :key="j" row wrap>
												<v-col xs="12">
													<v-text-field counter maxlength="20" :ref="`q${i}a${j}`" label="Escribe las respuestas" v-model="questions[i].options[j].option" @keydown.enter.prevent="addOption(i)" min=0 max=20></v-text-field>
												</v-col>
												<v-col xs="1" class="pt-3 justify-right text-xs-right">
													<v-btn icon small text color="secondary" @click="removeOption(i, j)">
														<v-icon small>mdi-close-circle</v-icon>
													</v-btn>
												</v-col>
											</v-row>
											<v-btn block outlined rounded color="primary" @click="addOption(i)">Añadir respuesta</v-btn>
										</div>
									</v-col>
								<v-row row wrap>
									<!-- v-col -->
									<v-col xs="12">
										<v-btn block rounded depressed color="success" @click="addQuestion">Añadir pregunta</v-btn>
									</v-col>
									<!-- v-col -->
									<v-col xs="12">
										<v-btn block rounded depressed :disabled="disabled" color="primary" type="submit">
											<span v-if="!disabled">Publicar encuesta</span>
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
import { mapState , mapMutations } from 'vuex'
import moment from 'moment'
import Api from "@/store/modules/Api"

export default {
	name: 'CreatePollComponent',
	data () {
		return {
			title: null,
			advisor_id: null,
			division_id: null,
			isLoading: false,
			description: null,
			files: [],
			search: null,
			poll_type_id: null,
			status: true,
			responsable_phone: null,
			cat_advisors_by_division: [],
			filterItems: [],
			message: null,
			index: 1,
			serie: 1,
			questions: [
				{
					question: '',
					type: '',
					index: 0,
					chip: true,
					options: [{ option: '', serie: 0 }]
				}
			],
			pickers: {
				publish_at: {
					date: moment().format('YYYY-MM-DD'),
					min: moment().format('YYYY-MM-DD'),
					calendar: false
				},
				remove_at: {
					date: moment().add('days', 1).format('YYYY-MM-DD'),
					min: moment().add('days', 1).format('YYYY-MM-DD'),
					calendar: false
				},
				publish_time: {
						time: null,
						menu: false
					},
				end_time: {
					time: '',
					menu: false
				},
			},
			disabled: false,
			v: {}
		}
	},
	computed: {
		...mapState('poll', ['cat_question_type', 'advisors_by_division', 'cat_poll_division', 'user_poll_type', 'suggestive_question']),
		...mapState('division', ['cat_user_divisions', 'advisors_by_division']),
		computedRemoveAt () {
			return this.formatDate(this.pickers.remove_at.date)
		},
		computedPublishAt () {
			return this.formatDate(this.pickers.publish_at.date)
		}
	},
	watch: {
		search (val) {

			// Items have already been requested
			if (this.isLoading) return

			this.isLoading = true

			this.getSuggestiveQuestion(val)

			// Lazily load input items

			// fetch('https://api.publicapis.org/entries')
			// 	.then(res => res.json())
			// 	.then(res => {
			// 		const { count, entries } = res
			// 		this.count = count
			// 		this.entries = entries
			// 	})
			// 	.catch(err => {
			// 		console.log(err)
			// 	})
			// 	.finally(() => (this.isLoading = false))
		},
	},
	methods: {
		...mapMutations('snackbar', ['showSnackbar']),
		...mapMutations('poll', ['pushPoll', 'getCatQuestionType', 'getUserPollType', 'getSuggestiveQuestion']),
		...mapMutations('division', ['getUserDivision', 'getAdvisorByDivision']),
		formatDate (date) {
			if (!date) return null

			const [year, month, day] = date.split('-')

			return `${day}/${month}/${year}`
		},
		selectAll() {
			this.filterItems = this.advisors_by_division;
		},

		clearAll() {
			this.filterItems = [];
		},
		setRemoveAtDate (date) {
			this.$refs.remove_at.save(date)
		},
		setPublishAtDate (date) {
			this.$refs.publish_at.save(date)
		},
		setPermitTime(time) {
			this.$refs.publish_time.save(time)
		},
		setEndTime(time) {
			this.$refs.end_time.save(time)
		},
		addQuestion () {
			this.questions.push({
				question: '',
				index: this.index,
				chip: true,
				options: [{ option: '', serie: this.serie }]
			})
			this.index++
			this.serie++
		},
		removeQuestion (index) {
			this.questions.splice(index, 1)
		},
		focusOptionInput (index) {
			this.$refs[`q${index}a0`][0].focus()
		},
		addOption(index) {
			let input = this.questions[index].options.length

			if (input <= 5) {
				this.questions[index].options.push({ option: '', serie: this.serie })
				setTimeout(() => { this.$refs[`q${index}a${input}`][0].focus() }, 50)
				this.serie++
			} else {
				this.showSnackbar('Has excedido el límite de respuestas permitido.')
			}
		},
		removeOption (question, option) {
			this.questions[question].options.splice(option, 1)
		},
		autoCompleteUser (event) {
			this.getAdvisorByDivision(event)
		},
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
						this.files.push({
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
		setAdvisor(value) {

			var founded = null

			this.poll_type_id = value.type.id

			this.status = (parseInt(value.type.type_poll_id) != 6 || parseInt(value.type.type_poll_id) != 4) ? true : false

			var advisor = this.getAdvisorByDivision(value.id)

		},
		removeFile(index) {
			this.files.splice(index, 1)

			this.files.lenght == 0 ? this.$refs.fileupload.value=null : false
		},
		store () {

			if (this.questions[0].question == '') {
				this.showSnackbar('Agrega una pregunta antes de enviar la encuesta.')
			} else {
				this.disabled = true

				Api.post('api/poll/store', {
					title: this.title,
					start: this.pickers.publish_at.date,
					end: this.pickers.remove_at.date,
					time_start: this.pickers.publish_time.time,
					time_end: this.pickers.end_time.time,
					description: this.description,
					message: this.message,
					status: this.status,
					questions: this.questions,
					poll_type_id: this.poll_type_id,
					files: this.files,
					responsable_phone: this.responsable_phone,
					array_advisor: this.filterItems
				})
				.then(res => {
					this.showSnackbar('La encuesta ha sido registrada.')
					Object.assign(this.$data, this.$options.data.call(this))
					this.pushPoll(res.data)
				})
				.catch(error => {
					this.showSnackbar('Ha ocurrido un error, verifique sus datos e intente nuevamente.')
					this.v = new Object()
					setTimeout(() => {
						this.v = error.response.data.errors
					}, 50)
				})
				.finally (() => {
					this.disabled = false
				})
			}
		}
	},
	mounted () {
		this.getUserPollType()
		this.getCatQuestionType()
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
</style>
