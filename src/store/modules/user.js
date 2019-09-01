import { login, logout, getInfo } from '@/mall-api/system/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    menuList:[],
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_MENULIST: (state, roles) => {
      state.menuList = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data;
          const tokenStr = response.jwtToken;
          console.info(tokenStr);
          setToken(tokenStr);
          commit('SET_TOKEN', tokenStr);
          if (data.permissionCodeList && data.permissionCodeList.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.permissionCodeList)
          } else {
            reject('Login: roles must be a non-null array !')
          }
          if (data.menuList && data.menuList.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_MENULIST', data.menuList)
          }
          commit('SET_NAME', data.username);
          commit('SET_AVATAR', data.icon);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data
          if (data.permissionCodeList && data.permissionCodeList.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.permissionCodeList)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          if (data.menuList && data.menuList.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_MENULIST', data.menuList)
          }
          commit('SET_NAME', data.username)
          commit('SET_AVATAR', data.icon)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
