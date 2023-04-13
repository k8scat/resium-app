<template>
	<view>
		<view class="nav bg-white padding-sm fixed top shadow">
			<view class="flex">
				<text class="flex-sub">当前积分：{{ user.point }}</text>
				<text class="flex-sub">已用积分：{{ user.used_point }}</text>
			</view>
			<view class="shadow margin-top-sm">
				<button class="cu-btn bg-green" @click="handleShowDonateModal">捐赠支持</button>
			</view>
		</view>
		
		<view style="height: 180upx;"></view>
		
		<ad unit-id="adunit-becfede2e302f11d" ad-type="grid" grid-opacity="0.8" grid-count="5" ad-theme="white"></ad>
		
		<view class="cu-list menu margin-top-sm">
			<view class="cu-item" :class="modalName === 'move-box-' + index ? 'move-cur' : ''" v-for="(pointRecord, index) in pointRecords" :key="index"
			 @touchstart="handleListTouchStart" @touchmove="handleListTouchMove" @touchend="handleListTouchEnd" :data-target="'move-box-' + index">
				<view>
					<view class="text-grey">{{ pointRecord.comment }}</view>
					<view class="text-gray text-sm">{{ pointRecord.used_point ? '-' + pointRecord.used_point : '+' + pointRecord.add_point }}积分</view>
				</view>
				<view class="action">
					<view class="text-grey text-xs">{{ pointRecord.create_time }}</view>
				</view>
				<view class="move">
					<view class="bg-red" @click="handleDeletePointRecord(index)">删除</view>
				</view>
			</view>
		</view>
		
		<view class="cu-modal bottom-modal" :class="donateModalShown ? 'show' : ''">
			<view class="cu-dialog" @tap.stop="">
				<view class="cu-bar bg-white">
					<view class="action text-blue" @click="handleHideDonateModal">取消</view>
					<view class="action text-green" @click="handleDonate">确定</view>
				</view>
				<view class="grid col-2 padding-sm">
					<view v-for="(service, index) in services" class="padding-xs" :key="index">
						<button class="cu-btn orange lg block"
							:class="chosedServiceIndex === index ? 'bg-orange' : 'line-orange'"
							@click="handleChooseService(index)"> {{ service.point }}积分/{{ service.total_amount }}元
							<view class="cu-tag sm round" :class="chosedServiceIndex === index ? 'bg-white text-orange' : 'bg-orange'" v-if="service.is_hot">HOT</view>
						</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { listPointRecords, deletePointRecord } from '@/common/js/api/user.js'
	import { parseTime, ding, debounce } from '@/common/js/utils.js'
	import { listServices } from '@/common/js/api/service.js'
	
	export default {
		data() {
			return {
				user: this.$store.state.user,
				modalName: null,
				pointRecords: [],
				listTouchStart: 0,
				listTouchDirection: null,
				page: 1,
				donateModalShown: false,
				services: [],
				chosedServiceIndex: 0,
				waiting: false,
				isIOS: false
			}
		},
		onReachBottom() {
			this.page += 1
			this.getData()
		},
		onPullDownRefresh() {
			this.page = 1
			this.getData(true)
		},
		onLoad() {
			this.getData()
		},
		onShow() {
			uni.getSystemInfo({
				success: (res) => {
					if (res.platform === 'ios') {
						ding('iOS用户: ' + this.user.uid)
						this.isIOS = true
					} else {
						this.isIOS = false
					}
				}
			})
			if (this.waiting) {
				const paymentResult = getApp().globalData.paymentResult
				if (paymentResult) {
					uni.showModal({
						title: '提示',
						content: paymentResult.msg,
						showCancel: false
					})
					if (paymentResult.error) {
						ding(paymentResult.error)
					}
					if (paymentResult.hasPaid) {
						this.user.point += paymentResult.point
						this.$store.commit('setUser', this.user)
						this.pointRecords.splice(0, 0, {
							add_point: paymentResult.point,
							comment: '捐赠支持',
							create_time: parseTime(Date.now())
						})
					}
				}
				
				this.waiting = false
			}
			
			listServices().then((data) => {
				this.services = data.services
			})
		},
		methods: {
			handleChooseService(index) {
				this.chosedServiceIndex = index
			},
			handleShowDonateModal() {
				if (this.isIOS && !this.user.can_download) {
					uni.showModal({
						title: '暂不支持',
						content: '十分抱歉，由于相关规范，iOS客户端暂时无法进行捐赠支持。',
						showCancel: false,
						confirmText: '好的'
					})
					return
				}
				
				this.donateModalShown = true
			},
			handleHideDonateModal() {
				this.donateModalShown = false
				this.chosedServiceIndex = 0
			},
			handleDonate() {
				debounce(() => {
					uni.navigateToMiniProgram({
						appId: 'wx909d8ff5894ec49b',
						path: '/pages/pay/pay',
						extraData: {
							token: this.$store.state.token,
							order: {
								subject: '捐赠支持',
								...this.services[this.chosedServiceIndex]
							}
						},
						envVersion: 'develop',
						success: () => {
							this.waiting = true
							this.donateModalShown = false
						}
					})
				}, 500)
				
			},
			getData(isPullDownRefresh=false) {
				uni.showLoading({
				    title: '加载中'
				});
				listPointRecords({
					page: this.page,
					per_page: 20
				}).then((data) => {
					if (data.point_records.length === 0) {
						if (this.page === 1) {
							uni.showToast({
								title: '暂无积分记录',
								icon: 'none'
							})
						} else {
							uni.showToast({
								title: '没有更多了',
								icon: 'none'
							})
						}
					} else {
						uni.hideLoading()
						const pointRecords = data.point_records.map((pointRecord) => {
							pointRecord.create_time = parseTime(pointRecord.create_time)
							return pointRecord
						})
						if (this.page === 1) {
							this.pointRecords = pointRecords
						} else {
							this.pointRecords.push.apply(this.pointRecords, pointRecords)
						}
					}
					
					if (isPullDownRefresh) {
						uni.stopPullDownRefresh()
						if (this.pointRecords.length !== 0) {
							uni.showToast({
								title: '刷新成功'
							})
						}
					}
				})
			},
			handleDeletePointRecord(index) {
				uni.showModal({
					title: '提示',
					content: '确认删除积分记录？',
					success: (res) => {
						if (res.confirm) {
							deletePointRecord({
								id: this.pointRecords[index].id
							}).then((data) => {
								this.pointRecords.splice(index, 1)
								uni.showToast({
									title: data.msg
								})
							})
						}
					}
				})
			},
			// ListTouch触摸开始
			handleListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},
			// ListTouch计算方向
			handleListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},
			// ListTouch计算滚动
			handleListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			}
		}
	}
</script>

<style>
</style>
