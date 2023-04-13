import config from '@/common/js/config/index.js'

export const getAuthHeader = () => {
	return {
		'Authorization': 'Bearer ' + getToken()
	}
}

export function parseTime(time, cFormat) {
	if (arguments.length === 0) {
		return null
	}
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
			time = parseInt(time)
		}
		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	return format.replace(/{([ymdhisa])+}/g, (result, key) => {
		let value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') {
			return ['日', '一', '二', '三', '四', '五', '六'][value]
		}
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value || 0
	})
}

export const formatSize = (size) => {
	if (size > (1024 * 1024)) {
		return (size / (1024 * 1024)).toFixed(2) + 'MB'
	} else if (size > 1024) {
		return (size / 1024).toFixed(0) + 'KB'
	} else {
		return size + 'B'
	}
}

/**
 * parsed 解析获取的数据 | 从数据库中获取的数据
 */
export const formatResource = (resource, parsed = false) => {
	// resource.desc = resource.desc ? resource.desc : '暂无简介'
	if (!parsed) {
		resource.tags = resource.tags ? resource.tags.split('!sep!') : []
		resource.file_type = resource.filename.substring(resource.filename.lastIndexOf('.') + 1).toUpperCase()
		resource.size = formatSize(resource.size)
		resource.create_time = parseTime(resource.create_time, '{y}年{m}月{d}日')
		resource.is_new = parseTime(new Date(), '{y}年{m}月{d}日') === resource.create_time
		resource.is_hot = resource.download_count > 1
	}

	return resource
}

export const formatArticle = (article) => {
	article.tags = article.tags ? article.tags.split('!sep!') : [],
		article.create_time = parseTime(article.create_time, '{y}年{m}月{d}日')
	article.content = article.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto;" ');
	article.content = article.content.replace(/<!-- flowchart.+\n.+\n.+\n.+svg>/, '');
	article.is_new = parseTime(new Date(), '{y}年{m}月{d}日') === article.create_time
	article.is_hot = article.view_count > 50
	return article
}

// https://github.com/ineo6/hubot-dingtalk/blob/master/dingtalk.js
// https://github.com/ineo6/dingtalk-robot-sdk/blob/master/src/robot.js
export const ding = (msg) => {
	const timestamp = Date.now()
	const crypto = require('crypto')
	// 加签
	const sign = encodeURIComponent(crypto.createHmac('sha256', config.dingtalkSecret).update(timestamp + '\n' +
		DINGTALK_SECRET).digest('base64'))
	uni.request({
		url: 'https://oapi.dingtalk.com/robot/send?access_token=' + config.dingtalkAccessToken +
			'&timestamp=' +
			timestamp + '&sign=' + sign,
		method: 'POST',
		header: {
			'Content-Type': 'application/json'
		},
		data: JSON.stringify({
			msgtype: 'text',
			text: {
				content: msg + ' [源自下载小程序]'
			}
		})
	})
}

// 防抖
let timeout = null
export const debounce = (fn, wait) => {
	timeout !== null && clearTimeout(timeout)
	timeout = setTimeout(fn, wait)
}

export const CSDN_URL_PATTERN = /^(http(s)?:\/\/download\.csdn\.net\/(download|detail)\/).+\/.+$/
export const ITEYE_URL_PATTERN = /^http(s)?:\/\/www\.iteye\.com\/resource\/.+\-.+$/
export const WENKU_URL_PATTERN = /^(http(s)?:\/\/w(en)?k(u)?\.baidu\.com\/view\/).+$/
export const DOCER_URL_PATTERN = /^(http(s)?:\/\/www\.docer\.com\/(webmall\/)?preview\/).+$/
export const ZHIWANG_URL_PATTERN = /^(http(s)?:\/\/kns(8)?\.cnki\.net\/KCMS\/detail\/).+$/
export const QIANTU_URL_PATTERN = /^(http(s)?:\/\/www\.58pic\.com\/newpic\/)\d+(\.html)$/
export const MBZJ_URL_PATTERN = /^(http(s)?:\/\/www\.cssmoban\.com\/(cssthemes|wpthemes)\/\d+\.shtml).*$/
export const isResourceUrl = url => {
	return CSDN_URL_PATTERN.test(url) || WENKU_URL_PATTERN.test(url) || DOCER_URL_PATTERN.test(url) ||
		ZHIWANG_URL_PATTERN.test(url) || QIANTU_URL_PATTERN.test(url) || MBZJ_URL_PATTERN.test(url) ||
		ITEYE_URL_PATTERN.test(url)
}

export const CSDN_ARTICLE_URL = /^http(s)?:\/\/blog\.csdn\.net\/.+\/article\/details\/.+$/
export const isArticleUrl = url => {
	return CSDN_ARTICLE_URL.test(url)
}

export const formatComment = (comment) => {
	comment.create_time = parseTime(comment.create_time)
	return comment
}

/**
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
export const getRandomInt = (max) => {
	return Math.floor(Math.random() * Math.floor(max));
}