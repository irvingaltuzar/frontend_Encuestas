<template>
	<v-container>
		<v-row row wrap>
			<v-col xs="12">
				<v-card>
					<v-card-title class="primary white--text">
						<div>
							<div class="subtitle-2">Ajustes</div>
						</div>
					</v-card-title>
					<div>
						<v-expansion-panels>
							<v-expansion-panel v-if="roles != 0">
								<v-expansion-panel-header class="primary">
									<div class="subtitle-2 white--text">
										<v-icon left color="white">
											mdi-office-building-cog
										</v-icon>
										Desarrollos
									</div>
								</v-expansion-panel-header>
								<v-expansion-panel-content ripple class="white--text">
									<template v-slot:actions>
										<v-icon small class="white--text">fas fa-chevron-down</v-icon>
									</template>
									<create-division-component/>
									<division-list-component/>
									<!-- <user-signature-component/> -->
								</v-expansion-panel-content>
								<!-- v-expansion-panel-content -->
							</v-expansion-panel>
							<v-expansion-panel>
								<v-expansion-panel-header class="primary">
									<div class="subtitle-2 white--text">
										<v-icon left color="white">
											mdi-lock
										</v-icon>
										Cambio de contraseña
									</div>
								</v-expansion-panel-header>
								<v-expansion-panel-content ripple class="white--text">
									<template v-slot:actions>
										<v-icon small class="white--text">fas fa-chevron-down</v-icon>
									</template>
									<change-password-component/>
								</v-expansion-panel-content>
								<!-- v-expansion-panel-content -->
							</v-expansion-panel>
							<v-expansion-panel v-if="roles != 0">
								<v-expansion-panel-header class="primary">
									<div class="subtitle-2 white--text">
										<v-icon left color="white">
											mdi-list-status
										</v-icon>
										Tipos de encuestas
									</div>
								</v-expansion-panel-header>
								<v-expansion-panel-content ripple class="white--text">
									<template v-slot:actions>
										<v-icon small class="white--text">fas fa-chevron-down</v-icon>
									</template>
									<create-poll-type-component/>
									<poll-type-list-component class="mt-6"/>
								</v-expansion-panel-content>
								<!-- v-expansion-panel-content -->
							</v-expansion-panel>
						</v-expansion-panels>
					</div>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<!-- Script -->

<script>

import { mapMutations, mapState } from 'vuex'


	export default {
		name: 'SettingsComponent',
		computed: {
			...mapState('user', ['roles']),
		}
	}

</script>
