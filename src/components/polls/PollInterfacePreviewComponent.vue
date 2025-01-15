<template>
	<v-container class="my-auto">
		<v-row row wrap>
			<v-col xs="12">
				<v-card class="mx-auto my-auto radius-card" max-width="550" color="rgba(255, 255, 255)">
					<div class="profile" align="center">
					</div>
					<v-card-text>
							<v-col xs="12">
								<v-container class="my-auto">
									<v-row row wrap>
										<v-col xs="12">
											<v-autocomplete item-text="title" label="Desarrollo" item-value="id" :error-messages="v.division_id" v-model="division_id" color="#54616e" :items="cat_divisions" @change="autoCompleteUser($event)"></v-autocomplete>
										</v-col>
									</v-row>
									<v-row row wrap>
										<v-col xs="12">
											<v-autocomplete :items="bucket_polls" label="Asesor" item-text="advisor.advisor_name" :error-messages="v.advisor_id" v-model="advisor_id"  color="#54616e" @change="getPoll($event)" return-object></v-autocomplete>
										</v-col>
									</v-row>
									<v-row row wrap>
										<v-col xs="12">
											<v-btn block rounded depressed :disabled="btn_status" color="#54616e" @click="goTo()">
												<span v-if="!btn_status" class="white--text">Ir a encuesta</span>
												<div v-else><v-icon>fas fa-circle-notch fa-spin</v-icon></div>
											</v-btn>
										</v-col>
									</v-row>
								</v-container>
							</v-col>
					</v-card-text>
					<v-card-actions class="footer">
						<v-row row wrap>
							<v-col xs="6" md="6" align="center" class="my-auto">
								<img :src="`${url}/storage/logos/DMI_logo.svg`" class="mini-footer">
							</v-col>
							<v-col xs="6" md="6" align="center" class="my-auto">
								<img :src="`${url}/storage/logos/NAI_logo.svg`" class="mini-footer">
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
		name: 'PollInterfacePreviewComponent',
    data: () => ({
			title: null,
			advisor_id: null,
			division_id: null,
			responsable_phone: null,
			cat_advisors_by_division: [],
			qr_code: null,
			url: process.env.VUE_APP_API_URL,
			v: {}
    }),
		computed: {
			...mapState('poll', ['cat_divisions', 'general_advisors_by_division', 'poll_by_advisor', 'btn_status', 'bucket_polls']),
		},
    methods: {
			...mapMutations('snackbar', ['showSnackbar']),
			...mapMutations('poll', ['getCatDivision', 'getPollByAdvisor', 'SET_POLL_BY_ADVISOR', 'getBucketPolls', 'SET_BTN']),
			autoCompleteUser (event) {
				this.getBucketPolls(event)

				this.cat_advisors_by_division = this.bucket_polls
			},
			getPoll (event) {
				this.SET_BTN()
				this.qr_code = event.qr_code
			},
			goTo () {
				this.$router.push({
					path: `/clientes/encuestas/${this.qr_code}`
				})
				this.SET_POLL_BY_ADVISOR()
			}
    },
		mounted () {
			this.getCatDivision()
		}
  }
</script>

<!-- style --->

<style lang="css" scoped>
	.profile {
		background-color: rgba(206, 194, 192);
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
		background-color: rgba(206, 194, 192) !important;
	}

	.radius-card {
		border-radius: 2.5rem;
	}

	.bg-questions {
		background-color: rgba(255, 255, 255) !important;
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
