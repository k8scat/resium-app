<template>
	<view>
		<view class="margin-lg radius">
			<form>
				<view class="cu-form-group">
					<view class="title">密码</view>
					<input disabled class="margin-tb-sm" v-model="user.password" name="input" type="password" @click="navToPassword" />
					<button class="cu-btn shadow" :class="user.password ? 'bg-green' : 'bg-blue'" @click="navToPassword">{{ user.password ? '修改' : '设置' }}</button>
				</view>
				<view class="cu-form-group">
					<view class="title">邮箱</view>
					<input disabled class="margin-tb-sm" v-model="user.email" name="input" type="text" @click="navToEmail" />
					<button class="cu-btn shadow" :class="user.email ? 'bg-green' : 'bg-blue'" @click="navToEmail">{{ user.email ? '修改' : '设置' }}</button>
				</view>
				<button class="cu-btn line-gray block margin-tb-sm" @click="handleLogout">退出登录</button>
			</form>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: this.$store.state.user
			}
		},
		methods: {
			handleLogout() {
				uni.showModal({
					title: '提示',
					content: '确认退出登录？',
					success: (res) => {
						if (res.confirm) {
							this.$store.dispatch('handleLogout')
						}
					}
				})
			},
			navToPassword() {
				uni.navigateTo({
					url: 'password'
				})
			},
			navToEmail() {
				uni.navigateTo({
					url: 'email'
				})
			}
		}
	}
</script>

<style>
</style>
