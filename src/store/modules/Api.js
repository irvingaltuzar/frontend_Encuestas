import axios from "axios"

const Api = axios.create({
	baseURL: `${process.env.VUE_APP_API_URL}`
})

Api.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

Api.defaults.withCredentials = true

export default Api
