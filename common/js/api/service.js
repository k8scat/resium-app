import http from '@/common/js/request.js'

export const listServices = () => {
	return http.get('list_services/')
}