<template>
	<view class="margin-top-lg text-black text-center margin-bottom-lg">
		<text>Copyright &copy; 2019-{{ currentYear }} 源自下载</text><br>
		<text @click="showVersionInfo">{{ version.version }}</text>
	</view>
</template>

<script>
	import { getVersion } from '@/common/js/api/version.js'
	import { parseTime } from '@/common/js/utils.js'
	
	export default {
		name: 'Copyright',
		data() {
			return {
				version: {
					version: 'v6.2.2',
					create_time: 1634971884 // seconds
				},
			}
		},
		beforeMount() {
			getVersion().then(data => {
				this.version = data.data
				this.version.createDate = parseTime(this.version.create_time, '{y}-{m}-{d}')
			})
		},
		computed: {
			currentYear() {
				return new Date().getFullYear();
			}
		},
		methods: {
			showVersionInfo() {
				uni.showModal({
					showCancel: false,
					title: '版本信息',
					content: `${this.version.version} 发布于 ${this.version.createDate}`
				})
			}
		}
	}
</script>

<style>
	
</style>
