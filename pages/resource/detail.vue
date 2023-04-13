<template>
	<view>
		<view class="padding-sm cu-card bg-white" v-if="resource">
			<view class="text-bold text-black text-lg flex align-center">
				<text v-if="resource.file_type" class="cu-tag radius line-olive margin-right-xs">{{ resource.file_type }}</text>
				<text>{{ resource.title }}</text>
			</view>

			<view v-if="resource.id" class="flex justify-between align-center margin-top-sm">
				<view class="flex align-center">
					<view class="cu-avatar sm round" :style="'background-image:url(' + resource.avatar_url + ')'"></view>
					<text class="text-blue margin-left-xs">{{ resource.nickname }}</text>
				</view>

				<view class="text-gray">
					<text>{{ resource.create_time }}</text>
				</view>
			</view>

			<view v-if="resource.desc" style="text-align: justify;" class="cu-card bg-gray text-gray padding-sm margin-top-sm radius">
				<text>{{ resource.desc }}</text>
			</view>

			<view v-if="resource.preview_images && resource.preview_images.length > 0" class="margin-top-sm">
				<image @click="handleClickImage(index)" style="width: 100%;" v-for="(preview_image, index) in resource.preview_images"
				 :key="index" :src="preview_image.url"></image>
			</view>

			<view class="text-gray margin-top-sm">
				<text v-if="resource.point">{{ resource.point }}积分</text>
				<block v-if="resource.size">
					<text class="margin-lr-xs" v-if="resource.point">|</text>
					<text>{{ resource.size }}</text>
				</block>
			</view>

			<view v-if="resource.tags && resource.tags.length > 0">
				<view v-for="(tag, index) in resource.tags" :key="index" class='cu-tag radius bg-blue margin-top-sm'>{{ tag }}</view>
			</view>

			<view class="margin-top-sm">
				<view class="flex">
					<button v-if="resource.need_pay" class="cu-btn line-gray flex-sub">
						<text class="cuIcon-warn margin-right-xs"></text>
						<text>付费资源无法下载</text>
					</button>
					<button v-else-if="resource.copyright_limited" class="cu-btn line-gray flex-sub">
						<text class="cuIcon-warn margin-right-xs"></text>
						<text>版权受限，无法下载</text>
					</button>
					<button v-else class="cu-btn line-blue flex-sub" @click="handleDownload">
						<text class="cuIcon-down margin-right-xs"></text>
						<text>下载</text>
					</button>
				</view>
			</view>

			<ad unit-id="adunit-b749abf1db5435da" ad-intervals="30" class="margin-top-sm"></ad>

			<view v-if="resource && !resource.id" class="text-gray margin-top-xs">
				<text class="iconfont cuIcon-warnfill icon margin-right-xs"></text>
				<text>下载时请勿退出当前页面，否则将导致下载失败，当资源较大时，请耐心等待！</text>
			</view>

			<view v-if="resource && !resource.id" class="text-gray margin-top-xs">
				<text class="iconfont cuIcon-warnfill icon margin-right-xs"></text>
				<text>如果遇到下载失败的情况，请勿重复尝试下载，应及时向客服反馈问题，避免重复扣除积分！</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		formatResource,
		getAuthHeader,
		debounce,
		parseTime,
		ding
	} from '@/common/js/utils.js';
	import { setDownloadUrl, getResourceUrl } from '@/common/js/storage.js'
	import {
		getResource,
		parseResource,
		download,
		ossDownload
	} from '@/common/js/api/resource.js'

	export default {
		data() {
			return {
				resource: null,
				imageUrls: [],
				user: this.$store.state.user
			};
		},
		onLoad(option) {
			uni.showLoading({
				title: '加载中'
			});
			const id = option.id;
			if (id) {
				// 获取已有资源
				getResource({
					id
				}).then((data) => {
					this.resource = formatResource(data.resource);
					uni.setNavigationBarTitle({
						title: this.resource.title
					});
					if (this.resource.preview_images && this.resource.preview_images.length > 0) {
						this.imageUrls = this.resource.preview_images.map((image) => {
							return image.url
						})
					}
					uni.hideLoading();
				})
			} else {
				const url = getResourceUrl();
				parseResource({
					url
				}).then((data) => {
					this.resource = formatResource(data.resource, true);
					uni.setNavigationBarTitle({
						title: this.resource.title
					});
					if (this.resource.preview_images && this.resource.preview_images.length > 0) {
						this.imageUrls = this.resource.preview_images.map((image) => {
							return image.url
						})
					}
					uni.hideLoading();
				})
			}
		},
		methods: {
			handleClickImage(index) {
				// 预览图片
				uni.previewImage({
					urls: this.imageUrls,
					current: index,
					indicator: 'default'
				})
			},
			handleDownload() {
				if (!this.user.email) {
					uni.navigateTo({
						url: '/pages/user/email'
					})
					return
				}
				
				uni.showModal({
					title: '提示',
					content: '如果遇到下载失败的情况，请勿重复尝试下载，应及时向客服反馈问题，避免重复扣除积分！',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '下载中'
							});
							if (this.resource.id) {
								ossDownload({
									id: this.resource.id
								}).then((data) => {
									uni.hideLoading()
									setDownloadUrl(data.url)
									uni.navigateTo({
										url: 'download'
									})
								})
							} else {
								download({
									url: getResourceUrl(),
									point: this.resource.point,
									t: 'url'
								}).then((data) => {
									uni.hideLoading()
									// 保存下载链接
									setDownloadUrl(data.url)
									uni.navigateTo({
										url: 'download'
									})
								})
							}
						}
					}
				})
			}
		}
	};
</script>

<style lang="scss">

</style>
