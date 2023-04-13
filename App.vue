<script>
	import Vue from 'vue'
	import {
		parseTime
	} from '@/common/js/utils.js'
	import {
		getLoginTime
	} from '@/common/js/storage.js'
	import store from '@/store/index.js'
	import {
		getVersion
	} from '@/common/js/api/version.js'
	import config from '@/common/js/config/index.js'

	export default {
		globalData: {
			paymentResult: null
		},
		onLaunch: function() {
			const lastLoginTime = getLoginTime()
			if (store.state.user) {
				getVersion().then(data => {
					const createTime = data.data.create_time * 1000
					if (!lastLoginTime || createTime > lastLoginTime) {
						const version = data.data.version
						uni.showModal({
							title: '提示',
							content: `源自下载 ${version} 已发布，请重新登录！`,
							showCancel: false,
							success: function(res) {
								store.dispatch('handleLogout')
							}
						})
					}
				})
			}
		},
		onShow: function(option) {
			// 从支付小程序跳转回来
			if (option.referrerInfo.appId === config.wxPayMpAppId) {
				this.$options.globalData.paymentResult = option.referrerInfo.extraData
			}
		},
		onHide: function() {}
	}
</script>

<style>
	/*每个页面公共css */
	@import "colorui/main.css";
	@import "colorui/icon.css";

	page {
		background: #f0f0f0;
		font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Liberation Sans", "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, SimSun, "WenQuanYi Zen Hei Sharp", sans-serif;
		;
	}
</style>