import http from '@/common/js/request.js'

export const login = ({ uid_or_email, password, gender }) => {
	return http.post('login/', { uid_or_email, password, gender })
}

export const getUser = () => {
	return http.get('get_user/')
}

export const qrLogin = ({ url }) => {
	return http.get(url)
}

export const mpLogin = ({ code, nickname, avatar_url, gender }) => {
	return http.post('mp_login/', { code, nickname, avatar_url, gender })
}

export const setPassword = ({ password }) => {
	return http.post('set_password/', { password })
}

export const listPointRecords = ({ page, per_page }) => {
	return http.get('list_point_records/', {
		params: { page, per_page }
	})
}

export const deletePointRecord = ({ id }) => {
	return http.get('delete_point_record/', {
		params: { id }
	})
}

export const requestEmailCode = ({ email }) => {
	return http.post('request_email_code/', { email })
}

export const updateEmail = ({ email, code }) => {
	return http.post('set_email_with_code/', { email, code })
}

export const requestResetPassword = ({ uid_or_email }) => {
	return http.post('request_reset_password/', { uid_or_email })
}
