<template>
	<view>
		<view class="nav fixed top" id="top">
			<view class="cu-bar search bg-white">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input @confirm="handleSearch" type="text" placeholder="搜索资源" confirm-type="search" v-model="searchContent" maxlength="-1"></input>
				</view>
				<view class="action">
					<view class="cuIcon-scan text-bold text-blue lg" @click="handleScan"></view>
				</view>
			</view>

			<swiper class="screen-swiper square-dot" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000"
			 duration="500" indicator-color="#8799a3" indicator-active-color="#0081ff">
				<swiper-item @click="handleClickAd(ad)" v-for="(ad, index) in ads" :key="index">
					<image :src="ad.image_url"></image>
				</swiper-item>
			</swiper>
		</view>

		<view :style="{height: height}"></view>

		<view class="margin-top-sm" v-if="notice">
			<card :isNotice="true" :title="notice.title" :desc="notice.content" :foot="false" :updateTime="notice.update_time">
			</card>
		</view>

		<ad class="margin-top-sm" unit-id="adunit-56118c57d6959f46" ad-intervals="30"></ad>

		<view class="margin-top-sm">
			<card @click="handleClickResourceCard(resource.id)" v-for="(resource, index) in resources" :key="index" :title="resource.title"
			 :desc="resource.desc" :nickname="resource.nickname" :create-time="resource.create_time" :avatar-url="resource.avatar_url"
			 :is-new="resource.is_new" :is-hot="resource.is_hot" icon="down">
			</card>
		</view>
	</view>
</template>

<script>
	import {
		formatResource,
		isResourceUrl,
		parseTime,
		ding
	} from '@/common/js/utils.js'
	import { setResourceUrl } from '@/common/js/storage.js'
	import { Card } from '@/components/card.vue'
	import { qrLogin } from '@/common/js/api/user.js'
	import { listResources } from '@/common/js/api/resource.js'
	import { getUser } from '@/common/js/api/user.js'
	import { listMpSwiperAds } from '@/common/js/api/ad.js'
	import { getNotice } from '@/common/js/api/notice.js'

	export default {
		components: {
			Card
		},
		data() {
			return {
				height: '0px',
				ads: [],
				resources: [],
				page: 1,
				searchContent: '',
				showCancel: true,
				notice: null,
				interstitialAd: null,
				interstitialAdShowInterval: 60,
				interstitialAdTimer: null
			}
		},
		onPullDownRefresh() {
			this.page = 1
			this.searchContent = ''
			this.getData(true)
		},
		onReachBottom() {
			this.page += 1
			this.getData()
		},
		onShow() {
			if (this.$store.state.token) {
				getUser().then((data) => {
					this.$store.commit('setUser', data.user)
				})
			}

			listMpSwiperAds().then((data) => {
				this.ads = data.mp_swiper_ads
			})

			getNotice().then((data) => {
				if (data.notice.title === 'disabled') {
					return
				}
				this.notice = data.notice
				this.notice.update_time = parseTime(this.notice.update_time)
			})
			this.interstitialAdTimer = this.showAd(this.interstitialAdShowInterval)
		},
		onLoad() {
			this.getData()
			// 计算节点高度
			// https://uniapp.dcloud.io/api/ui/nodes-info
			const query = uni.createSelectorQuery().in(this);
			query.select('#top').boundingClientRect((data) => {
				this.height = data.height + 'px'
			}).exec();

			// 在页面onLoad回调事件中创建插屏广告实例
			if (wx.createInterstitialAd) {
				this.interstitialAd = wx.createInterstitialAd({
					adUnitId: 'adunit-d12b3ee225bad382'
				})
				this.interstitialAd.onLoad(() => {})
				this.interstitialAd.onError((err) => {})
				this.interstitialAd.onClose(() => {
					this.interstitialAdTimer = this.showAd(this.interstitialAdShowInterval*2)
				})
			}
		},
		onHide() {
			console.log('on hide: ' + this.interstitialAdTimer)
			clearTimeout(this.interstitialAdTimer)
		},
		methods: {
			showAd(timeout) {
				return setTimeout(() => {
					// 在适合的场景显示插屏广告
					if (this.interstitialAd) {
						this.interstitialAd.show().catch((err) => {
							console.error(err)
						})
					}
				}, timeout * 1000)
			},
			handleScan() {
				uni.scanCode({
					scanType: 'qrCode',
					success: (res) => {
						const url = res.result
						uni.showModal({
							title: '提示',
							content: '确认登录网页？',
							success: (res) => {
								if (res.confirm) {
									qrLogin({
										url
									}).then((data) => {
										uni.showToast({
											title: data.msg,
										})
									})
								}
							}
						})
					}
				})
			},
			getData(isPullDownRefresh = false) {
				uni.showLoading({
					title: '加载中'
				});
				listResources({
					page: this.page,
					per_page: 10,
					key: this.searchContent
				}).then((data) => {
					if (data.resources.length === 0) {
						if (this.page === 1) {
							uni.showToast({
								title: '暂无相关资源',
								icon: 'none'
							})
						} else {
							uni.showToast({
								title: '没有更多了',
								icon: 'none'
							});
						}
					} else {
						uni.hideLoading()
						const resources = data.resources.map((resource) => {
							return formatResource(resource)
						})
						if (this.page === 1) {
							this.resources = resources
						} else {
							this.resources.push.apply(this.resources, resources)
						}
					}

					if (isPullDownRefresh) {
						uni.stopPullDownRefresh()
						uni.showToast({
							title: '刷新成功'
						})
					}
				})
			},
			handleClickResourceCard(id) {
				if (!this.$store.state.user) {
					uni.showModal({
						title: '提示',
						content: '前往登录',
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/user/login'
								})
							}
						}
					})
					return
				}
				uni.navigateTo({
					url: 'detail?id=' + id
				})
			},
			handleSearch() {
				if (!this.$store.state.user) {
					uni.showModal({
						title: '提示',
						content: '前往登录',
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/user/login'
								})
							}
						}
					})
					return
				}
				
				this.searchContent = this.searchContent.trim()
				ding(`user[${this.$store.state.user.uid}] search: ${this.searchContent}`)
				if (isResourceUrl(this.searchContent)) {
					if (!this.$store.state.user.can_download) {
						uni.showToast({
							title: '未授权',
							icon: 'none'
						})
						return
					}
					setResourceUrl(this.searchContent)
					uni.navigateTo({
						url: 'detail',
						success: () => {
							this.searchContent = ''
						}
					})
					return
				}
				
				this.page = 1
				this.getData()
			},
			handleClickAd(ad) {
				uni.showModal({
					title: ad.title,
					content: ad.content,
					showCancel: false,
					success: (res) => {
						if (res.confirm) {
							uni.setClipboardData({
								data: ad.clipboard_data,
								success: () => {
									uni.showToast({
										title: ad.msg,
									})
								}
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
