import http from '@/common/js/request.js'

export const getNotice = () => {
	return http.get('get_notice/')
}

export const updateNotice = ({ title, content }) => {
	return http.post('update_notice/', { title, content })
}