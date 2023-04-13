<template>
	<view>
		<view class="bg-white padding-sm">
			<view v-if="article">
				<view class="text-bold text-black text-lg flex align-center">
					<text :class="'line-' + (resource.is_original ? 'red' : 'cyan')" class="cu-tag radius margin-right-xs">{{ resource.is_original ? '原创' : '转载' }}</text>
					<text>{{ article.title }}</text>
				</view>
				
				<view class="flex justify-between align-center margin-top-sm">
					<view class="flex align-center">
						<view class="cu-avatar sm round" :style="'background-image:url(' + article.avatar_url + ')'"></view>
						<text class="nickname text-blue margin-left-xs">{{ article.nickname }}</text>
					</view>
					
					<view class="text-gray">
						<text>{{ article.create_time }}</text>
					</view>
				</view>
				
				<view v-if="article.tags && article.tags.length > 0">
					<view v-for="(tag, index) in article.tags" :key="index" class='cu-tag radius bg-blue margin-top-sm'>{{ tag }}</view>
				</view>
				
				<ad unit-id="adunit-becfede2e302f11d" ad-type="grid" grid-opacity="0.8" grid-count="5" ad-theme="white" class="margin-top-sm"></ad>
				
				<view class="margin-top-sm">
					<jyf-parser :html="article.content" ref="article" :selectable="true"></jyf-parser>
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
import jyfParser from '@/components/jyf-parser/jyf-parser.vue'
import { getArticle, parseCsdnArticle } from '@/common/js/api/article.js'
import { getArticleUrl } from '@/common/js/storage.js'
import { formatArticle } from '@/common/js/utils.js'

export default {
	components: {
		jyfParser
	},
	data() {
		return {
			article: null
		};
	},
	onLoad(option) {
		uni.showLoading({
			title: '加载中'
		});
		const id = option.id;
		if (id) {
			// 获取已有资源
			getArticle({ id }).then((data) => {
				this.article = formatArticle(data.article);
				uni.setNavigationBarTitle({
					title: this.article.title
				})
				uni.hideLoading()
			})
		} else {
			const url = getArticleUrl();
			parseCsdnArticle({ url }).then((data) => {
				this.article = formatArticle(data.article);
				uni.setNavigationBarTitle({
					title: this.article.title
				})
				uni.hideLoading()
			})
		}
		
	},
	methods: {
		onReadClick() {
			uni.setClipboardData({
				data: this.article.url,
				success: () => {
					uni.showToast({
						title: '链接已复制'
					})
				}
			})
		}
	}
};
</script>
<style lang="scss">

</style>
