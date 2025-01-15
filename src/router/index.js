import Vue from 'vue'
import VueRouter from 'vue-router'
import Sidebar from "../views/layout/Sidebar.vue";
import store from '@/store'

Vue.use(VueRouter)

const routes = [
	{
		path: "/clientes/encuestas/:id",
		name: "PollInterface",
		meta: {
			auth: false,
			title: 'Encuesta cliente',
			params: true
		},
		component: () => import("@/views/poll/PollInterface"),
	},
	{
		path: "/clientes/encuestas",
		name: "PollInterfacePreview",
		meta: {
			auth: false,
			title: 'Encuesta cliente',
			params: true
		},
		component: () => import("@/views/poll/PollInterfacePreview"),
	},
	{
		path: "/auth/login",
		name: "Login",
		meta: {
			auth: false
		},
		component: () => import("@/views/auth/Login"),
	},
	{
		path: "/app",
		component: Sidebar,
		name: "App",
		meta: { auth: true },
		children: [
			{
				path: "settings",
				meta: { title: "Configuración"},
				component: () => import("@/views/settings/Settings"),
			}
		],
	},
	{
		path: "/",
		component: Sidebar,
		name: "Home",
		meta: {
			auth: true
		},
		children: [
			{
				path: "home",
				component: () => import ('@/views/home/Home'),
				meta: { title: "Home", noCache: true },
			},
			{
				path: "poll",
				component: () => import("@/views/poll/CreatePoll"),
				meta: { title: "Encuesta", noCache: true },
			},
		],
	},
	{
		path: "/admin",
		name: "Admin",
		component: Sidebar,
		meta: { auth: true },
		children: [
			{
				path: "advisors",
				meta: { title: "Asesores"},
				component: () => import("@/views/advisors/CreateAdvisor"),
			},
			{
				path: "roles",
				meta:{ title: "Roles"},
				component: () => import("@/views/divisions/DivisionRoles"),
			},
			{
				path: "users",
				meta:{ title: "Usuarios"},
				component: () => import("@/views/users/CreateUser"),
			}
		],
	},
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
