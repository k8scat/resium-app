import http from '@/common/js/request.js'

export const listResources = ({ page, per_page, key }) => {
	return http.get('list_resources/', {
		params: { page, per_page, key }
	})
}

export const getResource = ({ id }) => {
	return http.get('get_resource/', {
		params: { id }
	})
}

export const parseResource = ({ url }) => {
	return http.post('parse_resource/', { url })
}

export const ossDownload = ({ id, t }) => {
	return http.get('oss_download/', {
		params: { id, t }
	})
}

export const download = ({ url, point, t }) => {
	return http.post('download/', { url, point, t })
}
