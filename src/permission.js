
// import { Message } from 'element-ui'
// // import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import { getTitle } from '@/utils/getPageTitle'
import router from '@/router'
import store from '@/store'

const whiteList = ['/auth/login', '/auth-redirect'] //No redirige a estos dos paths(whitelist)
const withoutToken = ['/clientes/encuestas']
const appWhiteList = ['/app/settings']

router.beforeEach(async(to, from, next) => {

	const hasToken = getToken()
	if (to.matched.some( record => record.meta.auth)) {
		if (hasToken) {

			if (to.meta.params) {
				next()
			} else {

				if (store.state.user.routes.indexOf(to.path) !== -1 || appWhiteList.indexOf(to.path) != -1) {

					getTitle(to, from, next)
					if (to.path === '/auth/login' || to.path === '/') {
						next({ path: '/home' })
					} else {
						next()
					}
				} else {

					if (from.path === '/auth/login') {
						next()
					} else {
						next({ path: '/home' })
					}
				}

			}

		} else {

			if (to.meta.params) {
				next()
			}

				next({ path: '/NotFound' })
			// if (whiteList.indexOf(to.path) !== -1) {
			// 	// in the free login whitelist, go directly
			// 	next()
			// } else {
			// 	next({ path: '/auth/login' })
			// }
		}
	} else {

			if (hasToken) {
				if (to.path === '/auth/login' || to.path === '/') {
					next({ path: '/home' })
				}
			}
			getTitle(to, from, next)
			if (to.meta.params) {
				next()
			} else {
					if (withoutToken.indexOf(to.path) !== -1) {
						next()
					}
					if (whiteList.indexOf(to.path) !== -1) {
						next()
					} else {
						next({ path: '/auth/login' })
					}
			}
	}
})

