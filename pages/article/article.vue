<template>
	<view>
		<view class="cu-bar search bg-white fixed top" id="top">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input @confirm="handleSearch" type="text" placeholder="搜索文章" confirm-type="search" v-model="searchContent" maxlength="-1"></input>
			</view>
		</view>
		
		<view :style="{height: height}"></view>
		
		<ad unit-id="adunit-4a9b5a6be464a818" ad-intervals="30" class="margin-top-sm"></ad>
		
		<card class="marigin-top-sm" @click="handleClickArticleCard(article.id)" v-for="(article, index) in articles" :key="index"
			:title="article.title"
			:desc="article.desc"
			:nickname="article.nickname"
			:create-time="article.create_time"
			:avatar-url="article.avatar_url"
			:is-new="article.is_new"
			:is-hot="article.is_hot"
			icon="attention"></card>
	</view>
</template>

<script>
	import { formatArticle, getAuthHeader, debounce, isArticleUrl } from '@/common/js/utils.js'
	import Card from '@/components/card.vue'
	import { listArticles } from '@/common/js/api/article.js'
	import { getUser } from '@/common/js/api/user.js'
	import { setArticleUrl } from '@/common/js/storage.js'
	
	export default {
		components: {
			Card
		},
		data() {
			return {
				articles: [],
				page: 1,
				key: '',
				searchContent: '',
				height: ''
			}
		},
		onPullDownRefresh() {
			this.page = 1
			this.searchContent = ''
			this.getData(true)
		},
		onReachBottom() {
			this.page += 1
			this.getData(false)
		},
		onShow() {
			if (this.$store.state.token) {
				getUser().then((data) => {
					this.$store.commit('setUser', data.user)
				})
			}
		},
		onLoad() {
			this.getData()
			
			// 计算节点高度
			// https://uniapp.dcloud.io/api/ui/nodes-info
			const query = uni.createSelectorQuery().in(this);
			query.select('#top').boundingClientRect((data) => {
				this.height = data.height + 'px'
			}).exec();
		},
		methods: {
			getData(isPullDownRefresh=false) {
				uni.showLoading({
				    title: '加载中'
				});
				listArticles({
					page: this.page,
					per_page: 10,
					key: this.searchContent
				}).then((data) => {
					if (data.articles.length === 0) {
						if (this.page === 1) {
							uni.showToast({
								title: '暂无相关资源',
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
						const articles = data.articles.map((article) => {
							return formatArticle(article)
						})
						if (this.page === 1) {
							this.articles = articles
						} else {
							this.articles.push.apply(this.articles, articles)
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
			handleClickArticleCard(id) {
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
				if (isArticleUrl(this.searchContent)) {
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
					if (!this.$store.state.user.can_download) {
						uni.showToast({
							title: '暂无相关文章',
							icon: 'none'
						})
						return
					}
					setArticleUrl(this.searchContent)
					uni.navigateTo({
						url: 'detail',
						success: () => {
							this.searchContent = ''
						}
					})
				} else {
					this.page = 1
					this.getData()
				}
			}
		}
	}
</script>

<style lang="scss">

</style>
