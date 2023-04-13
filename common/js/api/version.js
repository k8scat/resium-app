import http from '@/common/js/request.js'

export const getVersion = () => {
	return http.get('get_version/')
}