<template>
	<v-container class="my-auto">
		<v-row row wrap>
			<v-col sm="12">
				<v-card class="mx-auto my-md-0 my-xs-0 radius-card" max-width="410" color="rgba(255, 255, 255, 0.0)">
					<div class="profile" align="center">
						<v-avatar size="90" class="mt-4">
							<v-img :src="poll_detail.environment.advisor.advisor_photo_url"></v-img>
						</v-avatar>
						<p class="subtitle-1 mb-title mt-2">
								{{ !!poll_detail.environment ? poll_detail.environment.advisor_name : false }}
						</p>
						<p class="subtitle-1 mb-title">
							{{ poll_detail.poll.description }}
						</p>
						<div v-if="poll_detail.poll.show_title == 1">
							<p class="mb-title2">
								{{ poll_detail.poll.title }}
							</p>
						</div>
						<div v-else>
							<p class="mb-title2">
								{{ !!poll_detail.environment ? poll_detail.environment.division_name : false }}
							</p>
						</div>
						<br>
					</div>

					<v-card-text>
						<v-row row wrap v-if="!!!isCompleted">
							<v-col xs="12">
								<v-form ref="form" @submit.prevent="store">
									<v-stepper v-model="curr" class="radius-questions bg-questions" style="height:100%">
										<v-stepper-items>
											<v-stepper-content v-for="(step,n) in poll_detail.poll.questions" :key="n" :step="n+1">
												<v-container class="mt-title">
													<v-row row wrap>
														<v-col xs="12" align="center">
															<p class="text-h5 title-line-height mt-8 mb-0">{{ step.title }}</p>
														</v-col>
													</v-row>
													<v-row row wrap class="person-mb mt-6">
														<v-col xs="12" align="center">
															<v-sheet rounded="xl" outlined color="transparent">
																<div v-if="!step.options.length && step.cat_questions_type_id == 2">
																	<v-item-group>
																		<v-item v-for="(scale, i) in scale_tags" :key="i" v-slot="{ active, toggle }">
																			<v-btn class="mx-2 mb-6 btn_scale" ref="next_scale" :input-value="active" active-class="secondary" rounded @click="toggle(), chose([scale.value, step])" @change="enableButton(this)" id="no-background-hover">
																				<span class="padding-scale">
																					<div v-if="selected !== scale.value">
																						<v-img :src="scale.src" max-width="55" height="100"></v-img>
																					</div>
																					<div v-else>
																						<v-img :src="scale.negative" max-width="55" height="100"></v-img>
																					</div>
																				</span>
																					<!-- <img :src="scale.src" max-width="55" height="100" > -->

																			</v-btn>
																		</v-item>
																	</v-item-group>
																</div>
																<div v-if="!step.options.length && step.cat_questions_type_id == 3">
																	<!-- <v-item-group>
																		<v-row row wrap>
																			<v-col class="mb-n2" xs="6" md="6" v-for="(binary, i) in binary_tags" :key="i">
																				<v-item v-slot:default="{ active, toggle }">
																					<v-btn class="mx-2 mb-0 btn-decoration-2 py-4" :input-value="active" active-class="secondary white--text" @click="toggle(), chose([binary.value, step])" >
																						<span class="text-caption">
																							{{ binary.description }}
																						</span>
																					</v-btn>
																				</v-item>
																			</v-col>
																		</v-row>
																	</v-item-group> -->
																	<v-item-group class="mb-n6 mt-n2">
																		<v-item v-for="(binary, i) in binary_tags" :key="i" v-slot="{ active, toggle }">
																			<v-btn class="mx-2 mb-6 btn-decoration" :input-value="active" active-class="secondary white--text" color="transparent" depressed rounded @click="toggle(), chose([binary.value, step])" id="no-background-hover">
																				<span class="padding-scale-2">
																					<v-img :src="binary.src" max-width="160" max-height="80"></v-img>
																				</span>
																			</v-btn>
																		</v-item>
																	</v-item-group>
																</div>
																<div v-else-if="step.cat_questions_type_id != 5">
																	<v-item-group multiple>
																		<v-row row wrap>
																			<v-col class="mb-n2" xs="6" md="6" v-for="(tag, i) in step.options" :key="i">
																				<v-item v-slot="{ active, toggle }">
																					<v-btn class="mx-2 mb-0 btn-decoration-2 py-4" :input-value="active" active-class="secondary white--text" depressed @click="toggle(), pushAnswer([tag, active])" >
																						<span class="text-caption">
																							{{ tag.description }}
																						</span>
																					</v-btn>
																				</v-item>
																			</v-col>
																		</v-row>
																	</v-item-group>
																</div>
																<div v-else>
																	<v-item-group multiple>
																		<v-row row wrap>
																			<v-col xs="12">
																				<v-text-field class="subtitle-2" type="text" label="Escribe tu respuesta" v-model="text_answer" :error-messages="v.text_answer" tabindex="1" color="primary" @keyup="saveText()"/>
																			</v-col>
																		</v-row>
																	</v-item-group>
																</div>
															</v-sheet>
														</v-col>
													</v-row>
													<v-row row wrap v-if="!step.options.length && step.cat_questions_type_id != 5">
														<v-col xs="12" align="center" class="mt-n12">
															<v-btn v-if="n+1 < lastStep" rounded block color="white" @click="pushScaleAnswer([step, n])" :disabled="disabled" style="text-transform: none !important;">
																Siguiente
															</v-btn>
															<v-btn v-else rounded block color="success" @click="doneScale(n)" :disabled="disabled" style="text-transform: none !important;">Finalizar</v-btn>
															<!-- <div v-if="curr > 1" class="mt-3">
																<v-btn rounded block color="white" @click="removeScaleAnswer(n)" style="text-transform: none !important;">Atrás</v-btn>
															</div> -->
															<br>
														</v-col>
													</v-row>
													<v-row row wrap class="mt-n12" v-else-if="step.options.length && step.cat_questions_type_id != 5">
														<v-col xs="12" align="center">
															<v-btn v-if="n+1 < lastStep" rounded block color="white" @click="nextStep(n)" :disabled="disabled" style="text-transform: none !important;">
																Siguiente
															</v-btn>
															<v-btn v-else rounded block color="success" @click="done()" :disabled="disabled" style="text-transform: none !important;">Finalizar</v-btn>
															<!-- <div v-if="curr > 1" class="mt-3">
																<v-btn rounded block color="white" @click="removeScaleAnswer(n)" style="text-transform: none !important;">Atrás</v-btn>
															</div> -->
														</v-col>
													</v-row>
													<v-row row wrap class="mt-n12" v-else-if="step.cat_questions_type_id == 5">
														<v-col xs="12" align="center">
															<v-btn v-if="n+1 < lastStep" rounded block color="white" @click="pushTextAnswer([step, n])" :disabled="disabled" style="text-transform: none !important;">
																Siguiente texto
															</v-btn>
															<v-btn v-else rounded block color="success" @click="doneTextAnswer(step)" :disabled="disabled" style="text-transform: none !important;">Finalizar</v-btn>
															<!-- <div v-if="curr > 1" class="mt-3">
																<v-btn rounded block color="white" @click="removeScaleAnswer(n)" style="text-transform: none !important;">Atrás</v-btn>
															</div> -->
														</v-col>
													</v-row>
													<v-row row wrap>
														<v-col xs="12" align="center">
															<span class="text-caption">
																{{ curr }} / {{ poll_detail.poll.questions.length }}
															</span>
														</v-col>
													</v-row>
												</v-container >
											</v-stepper-content>
										</v-stepper-items>
									</v-stepper>
								</v-form>
							</v-col>
						</v-row>
						<v-row v-else row wrap>
							<v-col xs="12" v-if="poll_detail.poll.type_poll_id != 4">
								<v-card class="mx-auto bg-questions">
									<v-card-text class="text-h5 font-weight-bold text-center">
										<v-row row wrap  class="mt-6">
											<v-col xs="12">
												<p class="text-center" style="white-space: break-spaces" v-html="poll_detail.poll.thanks_message"></p>
											</v-col>
										</v-row>
										<v-row row wrap justify="center mt-10 mb-8">
											<div class="text-center" v-if="poll_detail.poll.type_poll_id != 4">
												<v-icon x-large class="black--text"  @click.prevent="callNumber(poll_detail.poll.responsable_phone)">mdi-phone-in-talk</v-icon>
											</div>
										</v-row>
									</v-card-text>
								</v-card>
							</v-col>
							<!-- <v-col xs="12" v-else>
								<v-card class="mx-auto bg-questions">
									<v-card-text class="text-h5 font-weight-bold text-center">
										<v-row row wrap  class="mt-6">
											<v-col xs="12">
												<p class="text-center" style="white-space: break-spaces" v-html="poll_detail.poll.thanks_message"></p>
											</v-col>
											<v-col xs="12">
												<v-text-field class="subtitle-2" type="text" label="Nombre" v-model="first_name" :error-messages="v.first_name" tabindex="1" color="primary"/>
											</v-col>
										</v-row>
									</v-card-text>
								</v-card>
							</v-col> -->
						</v-row>
					</v-card-text>

					<v-card-actions class="footer">
						<v-row row wrap v-if="poll_detail.environment">
							<v-col xs="6" md="6" align="center" class="my-auto">
								<img :src="`${url}/storage/logos/${poll_detail.environment.division.logo_nai}`" class="mini-footer">
							</v-col>
							<v-col xs="6" md="6" align="center" class="my-auto">
								<img :src="`${url}/storage/logos/${poll_detail.environment.division.logo_dmi}`" class="mini-footer">
							</v-col>
							<!-- <v-col xs="4" md="4" align="center" class="my-auto">
								<img :src="poll_detail.environment.division.nai_logo_url" class="mini-footer">
							</v-col> -->
						</v-row>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	import Api from "@/store/modules/Api"

  export default {
		name: 'PollInterfaceComponent',
		props: {
			poll_detail: { type: Object, required: true},
		},
    data: () => ({
      loading: false,
			isHidden: true,
      selection: 1,
			selected: true,
			scale_answers: [],
			arr_text_answer: [],
			text_answer: null,
			binary_answers: [],
			v: new Object(),
			isCompleted: false,
			tmp_answer: {
				tmp_questions_id: null,
				tmp_value: null
			},
			tmp_text_answer: {
				tmp_questions_id: null,
				tmp_value: null
			},
			tmp_binary_answer: {
				tmp_questions_id: null,
				tmp_value: null
			},
			poll_answers: [],
			scale_tags: [
				{
					value: 100,
					src: require('@/assets/img/emoji/100.svg'),
					negative: require('@/assets/img/emoji/100_false.svg')
				},
				{
					value: 80,
					src: require('@/assets/img/emoji/80.svg'),
					negative: require('@/assets/img/emoji/80_false.svg')
				},
				{
					value: 60,
					src: require('@/assets/img/emoji/60.svg'),
					negative: require('@/assets/img/emoji/60_false.svg')
				},
				{
					value: 40,
					src: require('@/assets/img/emoji/40.svg'),
					negative: require('@/assets/img/emoji/40_false.svg')
				},
				{
					value: 20,
					src: require('@/assets/img/emoji/20.svg'),
					negative: require('@/assets/img/emoji/20_false.svg')
				},
			],
			binary_tags: [
				{
					id: 1,
					value: true,
					isActive: false,
					src: require('@/assets/img/emoji/like.svg'),
					description: 'Sí'
				},
				{
					id: 2,
					value: false,
					isActive: false,
					src: require('@/assets/img/emoji/dislike.svg'),
					description: 'No'
				},
			],
			curr: 1,
			url: process.env.VUE_APP_API_URL,
			disabled: true,
    }),
    watch: {
      'poll_answers' (value) {
        value.length > 0 ? this.disabled = false : this.disabled = true
      },
			'curr' (value) {
			}
    },
    methods: {
			...mapMutations('snackbar', ['showSnackbar']),
      reserve () {
        this.loading = true

        setTimeout(() => (this.loading = false), 2000)
      },
			stepComplete(step) {
					return this.curr > step
			},
			done() {
				this.store()
			},
			saveText() {
				if (this.text_answer != null && this.text_answer != "") {
					this.disabled = false
				} else {
					this.disabled = true
				}
			},
			nextStep (n) {
				this.curr = n+2
				this.disabled = true
			},
			doneScale(value) {
				console.log(value)
				var last_question = this.poll_detail.poll.questions[value]
				console.log(last_question)

				if(last_question.cat_questions_type_id == 2) {
					var last_scale_obj= {
						questions_id : this.tmp_answer.tmp_questions_id,
						id : this.tmp_answer.tmp_value
					}

					this.scale_answers.unshift(last_scale_obj)

				} else if(last_question.cat_questions_type_id == 3) {
					var last_binary_obj= {
						questions_id : this.tmp_binary_answer.tmp_questions_id,
						id : this.tmp_binary_answer.tmp_value
					}
					this.binary_answers.unshift(last_binary_obj)
				}

				this.store()

			},
			pushAnswer (payload) {
				var [tag, status] = payload
				var founded = null
				if(status == true) {

					founded = this.poll_answers.indexOf(tag);
					this.poll_answers.splice(founded, 1)
				} else {
					this.poll_answers.unshift(tag)
				}
			},
			pushTextAnswer (payload) {
				var [question, n] = payload

				console.log(question)

				var last_text_obj= {
						questions_id : question.id,
						id : this.text_answer
					}

				this.arr_text_answer.push(last_text_obj)
				this.text_answer = null
				this.curr = n+2
				this.disabled = true
			},
			doneTextAnswer (question) {

				var last_text_obj= {
						questions_id : question.id,
						id : this.text_answer
					}

				this.arr_text_answer.push(last_text_obj)

				this.store()

			},
			chose (payload) {

				var [value, question] = payload

				this.selected = value


				if(question.cat_questions_type_id == 2) {

					if (this.tmp_answer.tmp_value == value) {
						this.disabled = !this.disabled
					} else {
						this.disabled = false

						this.tmp_answer.tmp_questions_id = question.id
						this.tmp_answer.tmp_value = value
					}

				} else {
					if (this.tmp_binary_answer.tmp_value == value) {
						this.disabled = !this.disabled
					} else {
						this.disabled = false

						this.tmp_binary_answer.tmp_questions_id = question.id
						this.tmp_binary_answer.tmp_value = value
					}
				}
			},
			pushScaleAnswer (payload) {
				var [question, n] = payload

				if(question.cat_questions_type_id == 2) {

					var scale_obj= {
						questions_id : this.tmp_answer.tmp_questions_id,
						id : this.tmp_answer.tmp_value
					}
					this.scale_answers.push(scale_obj)
				} else {

					var binary_obj= {
						questions_id : this.tmp_binary_answer.tmp_questions_id,
						id : this.tmp_binary_answer.tmp_value
					}

					this.binary_answers.push(binary_obj)

				}

				this.tmp_binary_answer.tmp_value = null
				this.tmp_binary_answer.tmp_questions_id = null


				this.tmp_answer.tmp_value = null
				this.tmp_answer.tmp_questions_id = null

				this.curr = n+2
				this.disabled = true
				this.selected = true
			},
			enableButton (e) {
			},
			removeScaleAnswer (value) {

				let founded = null
				let index = null

				var question = this.poll_detail.poll.questions[value-1]

				if(question.cat_questions_type_id == 2) {

					founded = this.scale_answers.find( e => e.questions_id == question.id)

					index = this.scale_answers.indexOf(founded)

					let spliced = this.scale_answers.splice(index, 1)

					this.curr = value

				} else {
					founded = this.binary_answers.find( e => e.questions_id == question.id)

					index = this.binary_answers.indexOf(founded)

					this.binary_answers.splice(index, 1)

					this.curr = value
				}
				this.disabled = false
			},
			store () {

				this.disabled = true
				this.poll_answers.push(...this.scale_answers, ...this.binary_answers, ...this.arr_text_answer)

				Api.post('/answers/store', {
					multiple_answers: this.poll_answers,
					advisor_id: this.poll_detail.environment.advisor_id,
					bucket_id: this.poll_detail.id
				})
				.then(res => {
					this.showSnackbar(res.data.message)
					this.isCompleted = true
				})
				.catch(error => {
					this.showSnackbar(error.response.data.message)
				})
				.finally(() => {

				})
			},
			callNumber (payload) {
				window.location =`tel:${payload}`;
			}
    },
		computed: {
			...mapState('answers', ['lastStep'])
		},
		mounted () {

		}
	}
</script>

<!-- style --->

<style lang="css" scoped>
	.profile {
		background-color: rgba(206, 194, 192, 0.6);
	}

	.mb-title {
		margin-bottom: -0.4rem !important;
	}

	.mt-title {
		margin-top: -16px !important;
	}

	.mb-title2 {
		margin-bottom: -14px !important;
	}

	.footer {
		background-color: rgba(206, 194, 192, 0.6);
	}

	.color-next {
		background-color: rgba(206, 194, 192, 0.6) !important;
	}

	.radius-card {
		border-radius: 2.5rem;
	}

	.bg-questions {
		background-color: rgba(255, 255, 255, 0.3) !important;
	}

	#no-background-hover {
		background-color: transparent !important;
		min-width: 0px !important;
		padding: 0px !important;
	}

	.padding-scale {
		padding-top: 6px !important;
		padding-left: 2px !important;
	}

	.padding-scale-2 {
		padding-top: 0px !important;
		padding-left: 0px !important;
	}

	.radius-questions {
		border-radius: 1.5rem !important;
	}

	.mini {
		width:3rem;
	}

	.mini-dmi {
		width: 6rem;
	}

	.mini-footer {
		width: 4.4rem;
	}

	.title-line-height {
		line-height: 1.6rem !important
	}

	.v-slide-group__content {
		justify-content: center;
	}

	.btn-decoration {
		white-space: unset !important;
		width: inherit !important;
		display: inline !important;
		height: unset !important;
	}

	.person-mb {
		margin-bottom: 70px !important;
	}

	.btn-decoration-2 {
		white-space: unset !important;
		width: inherit !important;
		display: inline !important;
		height: unset !important;
		padding: 10px 0px !important;
		text-transform: capitalize;
	}
</style>
