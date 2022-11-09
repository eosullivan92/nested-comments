import axios from 'axios'

const api = axios.create({
	// baseURL: import.meta.env.REACT_APP_SERVER_URL,
	baseURL: 'http://localhost:3001',
	withCredentials: true,
})

export function makeRequest(url, options) {
	return api(url, options)
		.then((res) => res.data)
		.catch((err) => Promise.reject(err?.response?.data?.message ?? 'Error'))
}
