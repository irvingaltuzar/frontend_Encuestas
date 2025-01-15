<template>
	<v-navigation-drawer app v-model="status" disable-resize-watcher mobile-breakpoint>
		<v-img src="@/assets/img/sidebar/back_pattern-01.jpg">
			<v-row align="end" class="lightbox white--text pa-2 fill-height">
				<v-col>
					<div class="caption">Bienvenido</div>
					<div class="subtitle-2">{{ name }}</div>
				</v-col>
				<v-menu bottom right offset-y>
					<template v-slot:activator="{ on, attrs }">
						<v-btn dark icon v-bind="attrs" v-on="on">
							<v-icon>mdi-dots-vertical</v-icon>
						</v-btn>
					</template>
					<v-list dense>
						<v-list-item v-for="(item, i) in menu" :key="i" link @click="menuAction(item.action)">
							<v-list-item-icon>
								<v-icon v-text="item.icon" small></v-icon>
							</v-list-item-icon>
							<v-list-item-title class="caption align-end" v-text="item.text"></v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
			</v-row>
		</v-img>
		<v-divider></v-divider>
		<v-list>
			<div v-for="(route, index) in sidebar" :key="index">
				<!-- <v-list-item v-if="!route.links" :to="route.path">
					<v-list-item-action>
						<v-icon slot="prependIcon">{{ route.icon }}</v-icon>
					</v-list-item-action>
					<v-list-item-title v-text="route.text" class="subtitle-2" />
				</v-list-item> -->
				<v-list-group :value="isActive(route[0].children)" no-action color="andaresBrand">
					<v-icon slot="prependIcon">{{ index | icon }}</v-icon>
					<template v-slot:activator>
						<v-list-item>
							<v-list-item-content>
								<v-list-item-title class="subtitle-2">{{ index }}</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</template>
					<v-list-item v-for="(link, index) in route[0].children" :to="link.subsecUrl" :key="index">
						<v-list-item-action>
							<v-icon slot="prependIcon">{{ link.subsecDesc | icon }}</v-icon>
						</v-list-item-action>
						<v-list-item-title class="subtitle-2">{{ link.subsecDesc }}</v-list-item-title>
					</v-list-item>
				</v-list-group>
			</div>
		</v-list>
	</v-navigation-drawer>
</template>

<!-- script -->

<script>
	import { mapState, mapMutations } from 'vuex'

	export default {
		name: 'LeftSidebarComponent',
		props: {
			status: { type: Boolean, required: true},
		},
		data() {
			return {
				pathname: window.location.pathname,
				menu: [
					{ icon: 'mdi-tools', text: 'Configuración', path: '/app/settings'},
					{ icon: 'mdi-logout', text: 'Logout', path: 'logout', action: 'logout' }
				],
			}
		},
		methods: {
			menuAction (event) {
				return event == "logout" ? this.logout() : this.$router.push({ path: '/app/settings'})
			},
			isActive (links) {
				let isActive = false

				if (!isActive) {
					links.map(link => {
						if (!isActive) {
							isActive = link.subsecUrl == this.pathname ? true : false
						}
					})
				}

				return isActive
			},
			logout () {
				this.$store.dispatch('user/logout').then(() => {
					this.$router.push({
						path: 'auth/login'
					})
				})
				.catch(error => {
					console.log(error)
				})
			}
		},
		filters: {
			icon (value) {
				let routes = [
					{ key: 'Administración', icon: 'mdi-account' },
					{ key: 'Generales', icon: 'mdi-office-building' },
					{ key: 'Asesores', icon: 'mdi-human-greeting' },
					{ key: 'Usuarios', icon: 'mdi-account-group' },
					{ key: 'Roles', icon: 'mdi-text-account' },
					{ key: 'Roles y permisos', icon: 'mdi-shield-account' },
					{ key: 'Home', icon: 'mdi-home' },
					{ key: 'Encuesta', icon: 'mdi-human-male-board-poll' },
				]
				let founded = routes.find( element => element.key == value)

				return founded.icon
			}
		},
		computed: {
			...mapState('layout', ['sidebar']),
			...mapState('user', ['user', 'name'])
		},
	}
</script>
