import {request} from '../utils/request';

/**
 * 登录
 * @param {any} {
	data,
	success
} 
 * @return 
*/
export function login({ data, success}) {
	return request({
		url: '/api/login',
		method: 'POST',
		data,
		success
	})
}

/**
 * 登出
 */
export function logout(success: Function) {
	return request({
		url: '/api/logout',
		success
	})
}

/**
 * 注册
 */
export function register({
	data,
	success
}) {
	return request({
		url: '/api/register',
		method: 'POST',
		data,
		success
	})
}

/**
 * 获取用户信息
 */
export function getUserInfo(success: Function) {
	return request({
		url: '/api/user/getinfo',
		success
	})
}

/**
 * 修改用户信息
 */
export function updateUserInfo(data: any, success: Function) {
	return request({
		url: '/api/user/updateInfo',
		method: 'POST',
		data,
		success
	})
}

/**
 * 修改密码
 */
export function updatePassword(data: any, success: Function) {
	return request({
		url: '/api/user/updatePassword',
		method: 'POST',
		data,
		success
	})
}


/**
 * 创建topic
 */
export function createTopic(data: any, success: Function) {
	return request({
		url: '/api/topic/create',
		method: 'POST',
		data,
		success
	})
}

/**
 * 发送一条消息
 */
export function searchTopic(success: Function) {
	return request({
		url: '/api/topic/search',
		success
	})
}

/**
 * 上传
 */
export function getSingature(data: any, success: Function) {
	return request({
		url: '/api/file/signature',
		method: 'POST',
		data,
		success
	})
}

/**
 * 添加好友
 */
export function addFriend(data: any, success: Function) {
	return request({
		url: '/api/friends/add',
		method: 'POST',
		data,
		success
	})
}

/**
 * 好友列表
 */
export function getFriends(data: any, success: Function) {
	return request({
		url: '/api/friends/list',
		data,
		success
	})
}

/**
 * 是否为好友
 */
export function isFriend(data: any, success: Function) {
	return request({
		url: '/api/friends/isFriend',
		method: 'POST',
		data,
		success
	})
}

/**
 * 屏蔽删除好友
 */
export function shieldFriend(data: any, success: Function) {
	return request({
		url: '/api/friends/shield',
		method: 'POST',
		data,
		success
	})
}

/**
 * 恢复删除好友
 */
export function toNormalFriend(data: any, success: Function) {
	return request({
		url: '/api/friends/tonormal',
		method: 'POST',
		data,
		success
	})
}

/**
 * 认可好友
 */
export function accept(data: any, success: Function) {
	return request({
		url: '/api/friends/accept',
		method: 'POST',
		data,
		success
	})
}

/**
 * 认可状态查询
 */
export function checkIsAccept(data: any, success: Function) {
	return request({
		url: '/api/friends/isAccept',
		method: 'POST',
		data,
		success
	})
}

/**
 * 投诉举报
 */
export function complaint(data: any, success: Function) {
	return request({
		url: '/api/friends/complaint',
		method: 'POST',
		data,
		success
	})
}

/**
 * 服务心跳检测
 */
export function heartbeat({success, fail}) {
	return request({
		url: '/api/heartbeat',
		success,
		fail
	})
}

/**
 * dialog列表
 */
export function getDialogList(data: any, success: Function) {
	return request({
		url: '/api/dialog/list',
		data,
		success
	})
}

/**
 * dialog查询
 */
export function getDialogInfo(data: any, success: Function) {
	return request({
		url: '/api/dialog/info',
		data,
		success
	})
}


/**
 * 更新dialog
 * @param {any} data 
 * @param {Function} success 
 * @return 
 */ 
export function updateDialog(data: any, success: Function) {
	return request({
		url: '/api/dialog/update',
		method: 'POST',
		data,
		success
	})
}

/**
 * message历史数据
 */
export function getMessagesHistory(data: any, success: Function) {
	return request({
		url: '/api/message/history',
		data,
		success
	})
}

/**
 * 是否vip
 * @param {any} {success, fail} 
 * @return 
 */ 
export function isVip(success: Function) {
	return request({
		url: '/api/user/isvip',
		success
	})
}

/**
 * 创建order
 * @param {any} data 
 * @param {Function} success 
 * @return 
 */ 
export function createOrder(data: any, success: Function) {
	return request({
		url: '/api/recharge/createOrder',
		method: 'POST',
		data,
		success
	})
}

/**
 * 更新order状态
 * @param {any} data 
 * @param {Function} success 
 * @return 
 */ 
export function updateOrderState(data: any, success: Function) {
	return request({
		url: '/api/recharge/updateOrderState',
		method: 'POST',
		data,
		success
	})
}

/**
 * 校验支付结果
 * @param {any} data 
 * @param {Function} success 
 * @return 
 */ 
export function validatePaymentResult(data: any, success: Function, fail: Function) {
	return request({
		url: '/api/recharge/validatePaymentResult',
		method: 'POST',
		data,
		success,
		fail
	})
}

/**
 * 获取价格列表
 * @param {any} data 
 * @return 
 */ 
export function getPrices(success: Function) {
	return request({
		url: '/api/recharge/prices',
		success
	})
}