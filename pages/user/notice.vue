<template>
	<view>
		<view class="margin-lg radius">
			<form>
				<view class="cu-form-group">
					<view class="title">标题</view>
					<input class="margin-tb-sm" v-model="notice.title" name="input" type="text" />
				</view>
				<view class="cu-form-group align-start">
					<view class="title">内容</view>
					<textarea maxlength="-1" v-model="notice.content"></textarea>
				</view>
				<button class="cu-btn bg-blue block margin-tb-sm" @click="handleUpdateNotice">发布</button>
			</form>
		</view>
	</view>
</template>

<script>
	import { getNotice, updateNotice } from '@/common/js/api/notice.js'
	
	export default {
		data() {
			return {
				notice: {
					title: '',
					content: ''
				}
			}
		},
		onShow() {
			getNotice().then((data) => {
				this.notice = data.notice
			})
		},
		methods: {
			handleUpdateNotice() {
				updateNotice(this.notice).then((data) => {
					uni.showToast({
						title: data.msg
					})
				})
			}
		}
	}
</script>

<style>
</style>
