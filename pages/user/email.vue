<template>
	<view>
		<view class="margin-lg radius">
			<form>
				<view class="cu-form-group">
					<view class="title">邮箱</view>
					<input class="margin-tb-sm" v-model="email" name="input" type="text" placeholder="请输入邮箱" />
				</view>
				<view class="cu-form-group">
					<view class="title">验证码</view>
					<input class="margin-tb-sm" v-model="code" name="input" type="text" placeholder="请输入验证码" />
					<button v-if="sendIntervalId === null" class="cu-btn shadow bg-green" @click="handleRequestEmailCode">发送验证码</button>
					<button v-else class="cu-btn shadow bg-gray">{{ sendInterval }} s</button>
				</view>
				<button class="cu-btn bg-blue block margin-tb-sm" @click="handleSetEmailWithCode">确认</button>
				<view class="text-gray margin-top-xs">
					<text class="iconfont cuIcon-warnfill icon margin-right-xs"></text>
					<text>如果长时间未收到邮件，请检查邮件是否被收入垃圾箱！</text>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	import { requestEmailCode, updateEmail } from '@/common/js/api/user.js'
	import { getEmailSendInterval, setEmailSendInterval } from '@/common/js/storage.js'
	
	export default {
		data() {
			return {
				currentEmail: this.$store.state.user.email,
				email: '',
				code: '',
				sendInterval: 0,
				sendIntervalId: null
			}
		},
		beforeMount() {
			this.sendInterval = getEmailSendInterval()
			console.log(`load send interval: ${this.sendInterval}`)
			if (this.sendInterval > 0) {
				this.sendIntervalId = setInterval(() => {
					if (--this.sendInterval === 0) {
						clearInterval(this.sendIntervalId)
						this.sendIntervalId = null
					}
				}, 1000)
			}
		},
		beforeDestroy() {
			if (this.sendInterval) {
				console.log(`set send interval: ${this.sendInterval}`)
				setEmailSendInterval(this.sendInterval)
			}
		},
		methods: {
			handleRequestEmailCode() {
				this.email = this.email.trim()
				uni.showLoading({
					title: '发送中'
				})
				if (!/^.+@.+\..+$/.test(this.email)) {
					uni.showToast({
						title: '邮箱格式不正确',
						icon: 'none'
					})
					return
				}
				
				if (this.email === this.currentEmail) {
					uni.showToast({
						title: '新邮箱不能和旧邮箱相同',
						icon: 'none'
					})
					return
				}
				requestEmailCode({ email: this.email }).then((data) => {
					uni.hideLoading()
					uni.showToast({
						title: data.msg
					})
					
					this.sendInterval = 60
					this.sendIntervalId = setInterval(() => {
						if (--this.sendInterval === 0) {
							clearInterval(this.sendIntervalId)
							this.sendIntervalId = null
						}
					}, 1000)
				})
			},
			handleSetEmailWithCode() {
				this.email = this.email.trim()
				this.code = this.code.trim()
				if (!/^.+@.+\..+$/.test(this.email)) {
					uni.showToast({
						title: '邮箱格式不正确',
						icon: 'none'
					})
					return
				}
				if (!/^\d{6}$/.test(this.code)) {
					uni.showToast({
						title: '验证码有误',
						icon: 'none'
					})
					return
				}
				
				uni.showLoading({
					title: '设置中'
				})
				updateEmail({
					email: this.email,
					code: this.code
				}).then((data) => {
					uni.hideLoading()
					const user = this.$store.state.user
					user.email = this.email
					this.$store.commit('setUser', user)
					uni.showModal({
						title: '提示',
						content: data.msg,
						showCancel: false,
						success: (res) => {
							if (res.confirm) {
								this.email = ''
								uni.navigateBack()
							}
						}
					})
				})
			}
		}
	}
</script>

<style>

</style>
