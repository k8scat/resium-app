<template>
	<view>
		<view class="bg-white margin-sm padding-sm radius" @click="onClick">
			<view class="text-bold text-lg text-black">
				<text v-if="isNew" class="cuIcon-newshot text-yellow margin-right-xs"></text>
				<text v-if="isHot" class="cuIcon-hot text-red margin-right-xs"></text>
				<text v-if="isNotice" class="cuIcon-notificationfill text-blue margin-right-xs"></text>
				<text>{{ title }}</text>
			</view>
			<view v-if="desc" class="margin-top-sm text-cut">{{ desc }}</view>
			<view class="text-grey text-sm margin-top-sm flex align-center">
				<!-- <image :src="avatarUrl"></image> -->
				<view v-if="avatarUrl" class="cu-avatar sm round" :style="'background-image:url(' + avatarUrl + ')'"></view>
				<text v-if="nickname" class="margin-left-xs">{{ nickname }}</text>
				<text v-if="createTime" class="margin-left-sm">{{ createTime }}</text>
				<text v-if="updateTime">{{ updateTime }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'Card',
		props: {
			updateTime: {
				type: String,
				default: ''
			},
			isNew: {
				type: Boolean,
				default: false
			},
			isNotice: {
				type: Boolean,
				default: false
			},
			foot: {
				type: Boolean,
				default: true
			},
			isHot: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: ''
			},
			desc: {
				type: String,
				default: ''
			},
			avatarUrl: {
				type: String,
				default: ''
			}, // Tips
			createTime: {
				type: String,
				default: ''
			},
			icon: {
				type: String,
				default: 'down'
			},
			count: {
				type: Number,
				default: 0
			},
			nickname: {
				type: String,
				default: ''
			}
		},
		methods: {
			onClick() {
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss">

</style>
