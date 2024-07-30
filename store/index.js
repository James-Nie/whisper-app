import { StorageKeys } from '@/utils/const';
import { createStore } from 'vuex';
import { judgeCurrentPage } from '@/utils/utils'

const store = createStore({
	state: {
		messages: getMessagesFromStorage(),
		friends: uni.getStorageSync(StorageKeys.friends),
		dialogList: uni.getStorageSync(StorageKeys.dialogList) || [],
		tempDialogs: uni.getStorageSync(StorageKeys.tempDialogs) || [],
		tempMessages: uni.getStorageSync(StorageKeys.tempMessages) || {},
	},
	getters: {
		messages: (state) => {
			return state.messages
		},
		friends: (state) => {
			return state.friends
		},
		friendsId: (state) => {
			const ids = [];
			Object.keys(state.friends).some(letter => {
				state.friends[letter].forEach(item =>{
					ids.push(item.user_id)
				})
			})
			return ids;
		},
		dialogList (state) {
			return state.dialogList.sort((a, b) => {
				return new Date(b.dialogLastTime).getTime() - new Date(a.dialogLastTime).getTime()
			});
		},
		tempDialogs(state) {
			return state.tempDialogs;
		},
		tempMessages(state) {
			return state.tempMessages;
		},
		lastTempMessage(state) {
			let lastData;
			Object.values(state.tempMessages).forEach(messages => {
				lastData = messages[messages.length - 1];
			})
			return lastData;
		}
	},
	mutations: {
		addMessage(state, message) {
			let dialogId = message.dialogId;
			
			// 已有dialog
			if(dialogId) {
				const storeDialogId = '_dialog_' + dialogId;
				if(state.messages[storeDialogId]) {
					state.messages[storeDialogId].push(message);
				} else {
					state.messages[storeDialogId] = [message];
				}
				
				// 临时对话，迁移为常规对话
				const temp = state.tempMessages[message.from.userId];
				if(temp && temp.length) {
					for(let i= temp.length-1; i> 0; i--) {
						state.messages[storeDialogId].unshift(temp[i]);
					}
					delete state.tempMessages[message.from.userId];
					uni.setStorageSync(StorageKeys.tempMessages, state.tempMessages);
					
					let pages = getCurrentPages();
					if(pages.length) {
						const currentPage = pages[pages.length - 1].$page.fullPath;
						// 更新当前页面dialogId
						if(judgeCurrentPage(currentPage, message)) { 
							uni.$emit('updateMessageDialogId', dialogId);
						}
					}
				}
				uni.setStorageSync(storeDialogId, state.messages[storeDialogId])
			}
		},
		removeMessage(state, dialog) {
			let dialogId = dialog.dialogId;
			if(!dialogId && dialog.userId) {
				let dialogInfo = (state.dialogList.filter(item => { return item.dialogTargetId === dialog.userId }))[0];
				dialogId = dialogInfo.dialogId
			}
			
			// 列表隐藏
			state.dialogList.forEach(item => {
				if(item.dialogId === dialogId) {
					item.hide = true;
					item.unreadNum = 0;
				}
			})
			
			delete state.messages['_dialog_' + dialogId];
			uni.removeStorageSync('_dialog_' + dialogId);
			uni.setStorageSync(StorageKeys.dialogList, state.dialogList)
		},
		updateMessageInfo(state, message) {
			const dialogId = message.dialogId;
			const storeDialogId = '_dialog_' + dialogId;
				
			const updateMes = state.messages[storeDialogId];
			updateMes.forEach((mes, index) => {
				if((message.messageId && mes.messageId === message.messageId) || mes.messageCreatedTime === message.messageCreatedTime) {
					updateMes[index] = message;
				}
			})
			
			uni.setStorageSync(storeDialogId, state.messages[storeDialogId])
		},
		updateDialogs(state, dialogs) {
			dialogs.forEach((newD) => {
				const index = state.dialogList.findIndex(oldD => {
					return newD.dialogId === oldD.dialogId
				})
				if(index !== -1) { // 更新
					state.dialogList[index] = {
						...newD,
						// unreadNum: state.dialogList[index].unreadNum + 1
					};
				} else { // 新增
					state.dialogList.push({
						...newD,
						unreadNum: 0
					});
				}
			})
			uni.setStorageSync(StorageKeys.dialogList, state.dialogList)
		},
		updateTempMessages(state, message) {
			console.log('updateTempMessages===', message, state.tempMessages)
			if(state.tempMessages[message.dialogId]) {
				state.tempMessages[message.dialogId].push(message);
			} else {
				state.tempMessages[message.dialogId] = [message];
			}
			uni.setStorageSync(StorageKeys.tempMessages, state.tempMessages);
		},
		removeTempMessages(state, message) {
			if(state.tempMessages[message.dialogId]) {
				delete state.tempMessages[message.dialogId]
			}
			uni.setStorageSync(StorageKeys.tempMessages, state.tempMessages);
		},
		updateFriends(state, friendsData) {
			state.friends = friendsData;
			uni.setStorageSync(StorageKeys.friends, friendsData);
		}
	},
	actions: {
		addMessageAction(context, payload) {
			context.commit('addMessage', payload)
		},
		removeMessageAction(context, payload) {
			context.commit('removeMessage', payload)
		}
		
	}
})

function getMessagesFromStorage() {
	const storageMessages = {};
	const res = uni.getStorageInfoSync();
	res.keys.forEach(key => {
		if(key.startsWith('_dialog_')) {
			storageMessages[key] = uni.getStorageSync(key);
		}
		// uni.removeStorageSync(key)
	})

	// console.log('storageMessages==', uni.getStorageSync(StorageKeys.dialogList))
	
	return storageMessages;
}

export default store