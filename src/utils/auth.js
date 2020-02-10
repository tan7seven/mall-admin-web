import Cookies from 'js-cookie'

const TokenKey = 'loginToken'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
const adminRole = ['ROLE_ADMIN'];
const ADD_CODE = ":CREATE";
const UPDATE_CODE = ":UPDATE";
const DELETE_CODE = ":DELETE";
const buttonList = [
  {buttonName:"添加", buttonCode:"CREATE"},
  {buttonName:"修改", buttonCode:"UPDATE"},
  {buttonName:"删除", buttonCode:"DELETE"},
];

export default {
  adminRole:adminRole,
  buttonList:buttonList,
  ADD_CODE:ADD_CODE,
  UPDATE_CODE:UPDATE_CODE,
  DELETE_CODE:DELETE_CODE,
};
