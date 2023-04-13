import Request from '@/js_sdk/luch-request/luch-request/index.js'
import store from '@/store/index.js'
import config from '@/common/js/config/index.js'

import {
	getToken
} from '@/common/js/storage.js'

const http = new Request({
	baseURL: config.baseApi,
	timeout: 3600000
});

http.interceptors.request.use((config) => { // 可使用async await 做异步操作
	const token = getToken()
	if (token) {
		config.header = {
			'Authorization': 'Bearer ' + token
		}
	}
	return config
}, config => { // 可使用async await 做异步操作
	return Promise.reject(config)
})

http.interceptors.response.use((response) => {
	/* 对响应成功做点什么 可使用async await 做异步操作*/
	const code = response.data.code
	if (code !== 200) {
		if (code === 401) {
			store.dispatch('handleLogout')
			uni.showModal({
				title: '提示',
				content: '请先登录',
				success: (res) => {
					if (res.confirm) {
						uni.navigateTo({
							url: '/pages/user/login'
						})
					}
				}
			})
		} else if (code === 5000) {
			uni.hideLoading()
			uni.showModal({
				title: '提示',
				content: '积分不足',
				confirmText: '捐赠支持',
				success: (res) => {
					if (res.confirm) {
						uni.navigateTo({
							url: '/pages/user/point'
						})
					}
				}
			})
		} else {
			uni.showToast({
				title: response.data.msg,
				icon: 'none'
			})
		}
		return Promise.reject(response)
	}
	return response.data
}, (response) => {
	/*  对响应错误做点什么 （statusCode !== 200）*/
	uni.showToast({
		title: '接口请求失败',
		icon: 'none'
	})
	return Promise.reject(response)
})

export default http