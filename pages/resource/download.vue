<template>
	<view class="margin-sm bg-white padding-sm text-blue" style="text-align: justify; word-break: break-all;">
		<view class="text-lg">
			<text selectable="true">{{ url }}</text>
		</view>
		<view class="margin-top-sm flex">
			<button class="cu-btn bg-green shadow flex-sub" @click="copyUrl">复制下载链接</button>
		</view>
		
		<view class="text-gray margin-top-xs">
			<text class="iconfont cuIcon-warnfill icon margin-right-xs"></text>
			<text>下载链接仅出现在当前页面，且在1小时内有效，请及时复制粘贴到浏览器进行下载！</text>
		</view>
		
		<ad unit-id="adunit-e475db224c7a0cd8" ad-type="grid" grid-opacity="0.8" grid-count="5" ad-theme="white" class="margin-top-xs"></ad>
	</view>
</template>

<script>
	import { getDownloadUrl, setDownloadUrl } from '@/common/js/storage.js'
	
	export default {
		data() {
			return {
				url: ''
			}
		},
		onShow() {
			this.url = getDownloadUrl()
		},
		methods: {
			copyUrl() {
				uni.setClipboardData({
					data: this.url,
					success: () => {
						uni.showToast({
							title: '下载链接已复制'
						})
					}
				})
			}
		}
	}
</script>

<style>
</style>
