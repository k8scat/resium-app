import http from '@/common/js/request.js'

export const getArticle = ({ id }) => {
	return http.get('get_article/', {
		params: { id }
	})
}

export const listArticles = ({ page, per_page, key }) => {
	return http.get('list_articles/', {
		params: { page, per_page, key }
	})
}

export const parseCsdnArticle = ({ url }) => {
	return http.post('parse_csdn_article/', { url })
}
