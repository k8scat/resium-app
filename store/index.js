import Vue from 'vue'
import Vuex from 'vuex'
import { parseTime } from '@/common/js/utils.js'
import { getToken, setToken, getUser, setUser, getLoginTime, setLoginTime } from '@/common/js/storage.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		user: getUser(),
		token: getToken(),
		loginTime: getLoginTime()
	},
	mutations: {
		setUser(state, user) {
			state.user = user
			setUser(user)
		},
		setToken(state, token) {
			state.token = token;
			setToken(token)
		},
		setLoginTime(state, loginTime) {
			state.loginTime = loginTime
			setLoginTime(loginTime)
		}
	},
	actions: {
		handleLogin({ commit }, { token, user }) {
			commit('setToken', token)
			commit('setUser', user)
			commit('setLoginTime', new Date().getTime())
		},
		handleLogout({ commit }) {
			commit('setToken', '')
			commit('setUser', '')
			uni.reLaunch({
				url: '/pages/resource/resource'
			})
		}
	}
})

export default store