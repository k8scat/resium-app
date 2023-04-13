<template>
	<view>
		<view class="shadow flex align-center justify-center" :class="'bg-gradual-' + bgColor" style="height: 50vw;">
			<view>
				<view
					@click="navToLogin"
					class="cu-avatar xl round"
					:style="'background-image:url(' + (user ? user.avatar_url : 'http://cdn.qiniu.ncucoder.com/default-avatar.jpg') + ')'"
				>
					<view v-if="user && user.gender !== null" class="cu-tag badge" :class="user.gender === 0 ? 'cuIcon-female bg-pink' : 'cuIcon-male bg-blue'"></view>
				</view>
				<view v-if="user" class="text-center margin-top-xs">
					<text>{{ user.nickname }}</text>
					<text v-if="user.can_download" class="cuIcon-vip text-yellow margin-left-xs"></text>
				</view>
				<view v-else class="text-center margin-top-xs" @click="navToLogin">点击登录</view>
			</view>
		</view>

		<view class="cu-list menu card-menu margin-top sm-border">
			<view class="cu-item" v-if="user" @click="copyUid">
				<view class="content">
					<text class="cuIcon-profile text-blue"></text>
					<text class="text-grey">用户ID</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{ user.uid }}</text>
				</view>
			</view>
			<view class="cu-item arrow" @click="navToPoint">
				<view class="content">
					<text class="cuIcon-ticket text-cyan"></text>
					<text class="text-grey">我的积分</text>
				</view>
			</view>
			<view v-if="user.is_admin" class="cu-item arrow" @click="navToNotice">
				<button class="cu-btn content">
					<text class="cuIcon-notification text-olive"></text>
					<text class="text-grey">公告</text>
				</button>
			</view>
			<view class="cu-item arrow" @click="navToSettings">
				<view class="content">
					<text class="cuIcon-settings text-brown"></text>
					<text class="text-grey">设置</text>
				</view>
			</view>
		</view>

		<view class="cu-list menu card-menu margin-top sm-border">
			<view class="cu-item arrow">
				<button class="cu-btn content" open-type="contact">
					<text class="cuIcon-service text-pink"></text>
					<text class="text-grey">联系我们</text>
				</button>
			</view>
			<view class="cu-item arrow" @click="showWxModal">
				<view class="content">
					<text class="cuIcon-weixin text-green"></text>
					<text class="text-grey">微信公众号</text>
				</view>
			</view>
		</view>

		<view class="cu-modal" :class="wxModalShown ? 'show' : ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">源自开发者</view>
					<view class="action" @click="handleHideWxModal"><text class="cuIcon-close text-red"></text></view>
				</view>
				<view class="padding-sm"><image @longpress="wxTip" :src="wxImageUrl" mode="aspectFit"></image></view>
				<view class="cu-bar bg-white flex">
					<view class="flex-sub"><button class="cu-btn bg-green" @click="saveImage">保存到相册</button></view>
				</view>
			</view>
		</view>
		<copyright></copyright>
		
		<ad unit-id="adunit-853401b9d97b9561" ad-intervals="30"></ad>
	</view>
</template>

<script>
import { debounce, getRandomInt } from '@/common/js/utils.js';
import { getUser } from '@/common/js/api/user.js';

export default {
	data() {
		return {
			user: null,
			wxModalShown: false,
			colors: ['blue', 'red', 'orange', 'green', 'pink'],
			bgColor: 'blue',
			wxImageUrl: 'https://cdn.qiniu.ncucoder.com/qrcode_for_gh_921c91750f4c_258_20201226.jpg',
		};
	},
	onLoad() {
		this.bgColor = this.colors[getRandomInt(this.colors.length)];
	},
	onShow() {
		if (this.$store.state.token) {
			getUser().then(data => {
				this.$store.commit('setUser', data.user);
				this.user = data.user;
			});
		} else {
			this.user = null;
		}
	},
	methods: {
		navToNotice() {
			uni.navigateTo({
				url: 'notice'
			});
		},
		copyUid() {
			uni.setClipboardData({
				data: this.user.uid,
				success: () => {
					uni.showToast({
						title: '用户ID已复制'
					});
				}
			});
		},
		wxTip() {
			uni.showModal({
				title: '提示',
				content: '保存到相册',
				success: res => {
					if (res.confirm) {
						this.saveImage();
					}
				}
			});
		},
		navToPoint() {
			if (!this.user) {
				uni.showModal({
					title: '提示',
					content: '前往登录',
					success: res => {
						if (res.confirm) {
							uni.navigateTo({
								url: 'login'
							});
						}
					}
				});
				return;
			}

			uni.navigateTo({
				url: 'point'
			});
		},
		saveImage() {
			uni.downloadFile({
				url: this.wxImageUrl, //仅为示例，并非真实的资源
				success: res => {
					if (res.statusCode === 200) {
						const tempFilePath = res.tempFilePath;
						uni.getSetting({
							success: res => {
								if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
									uni.authorize({
										scope: 'scope.writePhotosAlbum',
										success: () => {
											uni.saveImageToPhotosAlbum({
												filePath: tempFilePath,
												success: () => {
													uni.showToast({
														title: '保存成功'
													});
												}
											});
										}
									});
								} else if (res.authSetting['scope.writePhotosAlbum'] === false) {
									uni.showModal({
										title: '提示',
										content: '需要授权保存到相册',
										success: res => {
											if (res.confirm) {
												uni.openSetting({
													success(res) {
														if (res.authSetting['scope.writePhotosAlbum']) {
															uni.saveImageToPhotosAlbum({
																filePath: tempFilePath,
																success: () => {
																	uni.showToast({
																		title: '保存成功'
																	});
																}
															});
														} else {
															uni.showToast({
																title: '已取消保存',
																icon: 'none'
															});
														}
													}
												});
											} else if (res.cancel) {
												uni.showToast({
													title: '已取消保存',
													icon: 'none'
												});
											}
										}
									});
								} else {
									uni.saveImageToPhotosAlbum({
										filePath: tempFilePath,
										success: () => {
											uni.showToast({
												title: '保存成功'
											});
										}
									});
								}
							}
						});
					}
				}
			});
		},
		showWxModal() {
			this.wxModalShown = true;
		},
		handleHideWxModal() {
			this.wxModalShown = false;
		},
		navToSettings() {
			if (!this.user) {
				uni.showModal({
					title: '提示',
					content: '前往登录',
					success: res => {
						if (res.confirm) {
							uni.navigateTo({
								url: 'login'
							});
						}
					}
				});
				return;
			}

			uni.navigateTo({
				url: 'settings'
			});
		},
		navToLogin() {
			if (!this.user) {
				uni.navigateTo({
					url: 'login'
				});
			}
		}
	}
};
</script>

<style lang="scss">
.check-in {
	position: fixed;
	top: 20px;
	right: 0;
	border-bottom-left-radius: 5px;
	border-top-left-radius: 5px;
}
</style>
