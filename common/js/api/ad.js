import http from '@/common/js/request.js'

export const listMpSwiperAds = () => {
	return http.get('list_mp_swiper_ads/')
}