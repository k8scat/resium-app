<template>
	<view>
		<view class="margin-lg radius">
			<form>
				<view class="cu-form-group">
					<view class="title">账号</view>
					<input v-model="loginForm.uid_or_email" name="input" placeholder="请输入用户ID或邮箱" />
				</view>
				<view class="cu-form-group">
					<view class="title">密码</view>
					<input v-model="loginForm.password" name="input" placeholder="请输入密码" type="password" />
					<button class="cu-btn shadow line-blue" @click="resetPassword">找回密码</button>
				</view>
				
				<button class="cu-btn bg-blue block margin-tb-sm" @click="handlePasswordLogin">登录</button>
				<button v-if="canUseGetUserProfile" class="cu-btn bg-green block margin-tb-sm shadow" @click="getUserProfile">微信授权登录</button>
				<button v-else class="cu-btn bg-green block margin-tb-sm shadow" open-type="getUserInfo" @getuserinfo="getUserInfo">微信授权登录</button>
			</form>
		</view>
		
		<view class="cu-modal" :class="authModalShown ? 'show' : ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">提示</view>
				</view>
				<view class="bg-white text-center padding-bottom-lg">
					登录需要授权获取用户信息
				</view>
				<view class="cu-bar bg-white flex">
					<button class="cu-btn line-gray text-gray flex-sub margin-lr-sm" @click="authModalShown = false">取消</button>
					<button class="cu-btn bg-green flex-sub margin-lr-sm" open-type="getUserInfo" @getuserinfo="getUserInfo" @click="authModalShown = false">确定</button>
				</view>
			</view>
		</view>
		
		<copyright></copyright>
	</view>
</template>

<script>
	import { setToken } from '@/common/js/storage.js'
	import { login, mpLogin, requestResetPassword } from '@/common/js/api/user.js'
	import { ProviderWeixin } from '@/common/js/constant.js'
	
	export default {
		data() {
			return {
				loginForm: {
					uid_or_email: '',
					password: ''
				},
				authModalShown: false,
				isPasswordLogin: false,
				canUseGetUserProfile: false
			}
		},
		onLoad() {
			this.canUseGetUserProfile = !!uni.getUserProfile
		},
		methods: {
			resetPassword() {
				requestResetPassword({
					uid_or_email: this.loginForm.uid_or_email
				}).then((data) => {
					uni.showModal({
						title: '提示',
						content: data.msg,
						showCancel: false
					})
				})
			},
			getUserProfile() {
				uni.getUserProfile({
					desc: '用于登录',
					success: (res) => {
						this.login(res.userInfo)
					},
					fail: (err) => {
						console.error(err)
					}
				})
			},
			getUserInfo(res) {
				if (res.detail.errMsg === 'getUserInfo:ok') {  // 用户同意授权
					this.login(res.detail.userInfo)
				}
			},
			login(userInfo) {
				if (this.isPasswordLogin) {
					this.passwordLogin(userInfo.gender)
					return
				}
				
				uni.login({
					provider: 'weixin',
					success: res => {
						uni.showLoading({
							title: '登录中'
						});
						mpLogin({
								code: res.code,
								nickname: userInfo.nickName,
								avatar_url: userInfo.avatarUrl,
								gender: userInfo.gender
							}).then((data) => {
								this.$store.dispatch('handleLogin', {
									user: data.user,
									token: data.token
								})
								uni.hideLoading()
								uni.reLaunch({
									url: '/pages/resource/resource'
								})
							})
					}
				});
			},
			passwordLogin(gender) {
				uni.showLoading({
					title: '登录中'
				})
				this.loginForm.gender = gender
				login(this.loginForm).then((data) => {
					this.$store.dispatch('handleLogin', {
						user: data.user,
						token: data.token
					})
					uni.hideLoading()
					uni.navigateBack()
				})
			},
			handlePasswordLogin() {
				if (this.loginForm.uid_or_email === '') {
					uni.showToast({
						title: '用户ID或邮箱不能为空',
						icon: 'none'
					})
					return
				}
				if (this.loginForm.password === '') {
					uni.showToast({
						title: '密码不能为空',
						icon: 'none'
					})
					return
				}
				
				this.isPasswordLogin = true
				uni.getSetting({
					success: (res) => {
						if (res.authSetting['scope.userInfo'] === undefined) {
							uni.authorize({
								scope: 'scope.userInfo',
								success: () => {
									uni.getUserInfo({
										provider: 'weixin',
										success: (res) => {
											this.passwordLogin(res.userInfo.gender)
										}
									})
								},
								fail: (err) => {
									this.authModalShown = true
								}
							})
							return
						}
						if (res.authSetting['scope.userInfo'] === false) {
							this.authModalShown = true
							return
						}
						if (this.canUseGetUserProfile) {
							this.getUserProfile()
							return
						}
						uni.getUserInfo({
							provider: ProviderWeixin,
							success: (res) => {
								this.passwordLogin(res.userInfo.gender)
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
</style>
