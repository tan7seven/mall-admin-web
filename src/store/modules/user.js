import { login, logout, getInfo } from '@/mall-api/system/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    role: '',
    menuList:[],
    buttonList:[],
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
    SET_ROLE: (state, role) => {
      state.role = role
    },
    SET_MENU_LIST: (state, menuList) => {
      state.menuList = menuList
    },
    SET_BUTTON_LIST: (state, buttonList) => {
      state.buttonList = buttonList
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
          if (data.role) { //用户角色
            commit('SET_ROLE', data.role)
          } else {
            reject('Login: role must be a non-null array !')
          }
          if (data.menuList && data.menuList.length > 0) { //菜单权限
            commit('SET_MENU_LIST', data.menuList)
          }
          if (data.buttonList && data.buttonList.length > 0) { //按钮权限
            commit('SET_BUTTON_LIST', data.buttonList)
          }
          setToken(tokenStr);
          commit('SET_TOKEN', tokenStr);
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
          if (data.role) { //用户角色
            commit('SET_ROLE', data.role)
          } else {
            reject('Login: roles must be a non-null array !')
          }
          if (data.menuList && data.menuList.length > 0) { //菜单权限
            commit('SET_MENU_LIST', data.menuList)
          }
          if (data.buttonList && data.buttonList.length > 0) { //按钮权限
            commit('SET_BUTTON_LIST', data.buttonList)
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
          commit('SET_TOKEN', '');
          commit('SET_ROLE', '');
          commit('SET_MENU_LIST', []);
          commit('SET_BUTTON_LIST', []);
          removeToken();
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
