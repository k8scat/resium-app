export const EMAIL_SEND_INTERVAL_KEY = 'emailSendInterval'
export const LOGIN_TIME_KEY = 'loginTime'
export const TOKEN_KEY = 'token'
export const RESOURCE_URL_KEY = 'resourceUrl'
export const ARTICLE_URL_KEY = 'articleUrl'
export const DOWNLOAD_URL_KEY = 'downloadUrl'
export const USER_KEY = 'user'

export const getEmailSendInterval = () => {
	const now = new Date()
	const endTime = uni.getStorageSync(EMAIL_SEND_INTERVAL_KEY)
	return Math.floor((endTime - now.getTime()) / 1000)
}
export const setEmailSendInterval = value => {
	const now = new Date()
	const endTime = now.getTime() + value * 1000
	uni.setStorageSync(EMAIL_SEND_INTERVAL_KEY, endTime)
}

export const setLoginTime = value => {
	uni.setStorageSync(LOGIN_TIME_KEY, value)
}
export const getLoginTime = () => {
	return uni.getStorageSync(LOGIN_TIME_KEY)
}

export const setToken = (token) => {
	uni.setStorageSync(TOKEN_KEY, token)
}
export const getToken = () => {
	return uni.getStorageSync(TOKEN_KEY)
}

export const setUser = (user) => {
	uni.setStorageSync(USER_KEY, user)
}
export const getUser = () => {
	return uni.getStorageSync(USER_KEY)
}

export const setResourceUrl = url => {
	uni.setStorageSync(RESOURCE_URL_KEY, url)
}
export const getResourceUrl = () => {
	return uni.getStorageSync(RESOURCE_URL_KEY)
}

export const setDownloadUrl = url => {
	uni.setStorageSync(DOWNLOAD_URL_KEY, url)
}
export const getDownloadUrl = () => {
	return uni.getStorageSync(DOWNLOAD_URL_KEY)
}

export const setArticleUrl = url => {
	uni.setStorageSync(ARTICLE_URL_KEY, url)
}
export const getArticleUrl = () => {
	return uni.getStorageSync(ARTICLE_URL_KEY)
}
