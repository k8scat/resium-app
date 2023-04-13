<template>
	<view>
		<view class="margin-lg radius">
			<form>
				<view class="cu-form-group">
					<view class="title">{{ hasPassword ? '新密码' : '密码' }}</view>
					<input class="margin-tb-sm" v-model="form.password" name="input" :placeholder="'请输入' + (hasPassword ? '新密码' : '密码')" type="password" />
				</view>
				<view class="cu-form-group">
					<view class="title">重复{{ hasPassword ? '新' : '' }}密码</view>
					<input class="margin-tb-sm" v-model="form.rePassword" name="input" :placeholder="'请重复输入' + (hasPassword ? '新密码' : '密码')" type="password" />
				</view>
				<button class="cu-btn bg-blue block margin-tb-sm" @click="handleSetPassword">{{ hasPassword ? '确认修改' : '确认' }}</button>
			</form>
		</view>
	</view>
</template>

<script>
	import { setPassword } from '@/common/js/api/user.js'
	
	export default {
		data() {
			return {
				form: {
					password: '',
					rePassword: '',
				},
				hasPassword: !!this.$store.state.user.password
			}
		},
		onLoad() {
			if (this.hasPassword) {
				uni.setNavigationBarTitle({
					title: '修改密码'
				})
			} else {
				uni.setNavigationBarTitle({
					title: '设置密码'
				})
			}
		},
		methods: {
			handleSetPassword() {
				if (!/^[a-zA-Z0-9]{6,24}$/.test(this.form.password)) {
					uni.showToast({
						title: '密码必须是6到24位字母或数字',
						icon: 'none'
					})
					return
				}
				if (this.form.password !== this.form.rePassword) {
					uni.showToast({
						title: '两次密码输入不相同',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '设置中'
				})
				setPassword({
					password: this.form.password
				}).then((data) => {
					const user = this.$store.state.user
					user.password = this.form.password
					this.$store.commit('setUser', user)
					uni.showModal({
						title: '提示',
						content: data.msg,
						showCancel: false,
						success: (res) => {
							if (res.confirm) {
								uni.navigateBack()
							}
						}
					})
				}).finally(() => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style>
	
</style>
