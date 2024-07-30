/**
 * 支付
 * @return 
 */

import config from '@/config.js';
import {createOrder, validatePaymentResult, updateOrderState} from '@/server/index';

const IapTransactionState = {
	purchasing: "0", // A transaction that is being processed by the App Store.
	purchased: "1", // A successfully processed transaction.
	failed: "2", // A failed transaction.
	restored: "3", // A transaction that restores content previously purchased by the user.
	deferred: "4" // A transaction that is in the queue, but its final status is pending external action such as Ask to Buy.
};

class Iap {
	_channel = null;
	_channelError = null;
	_productIds = [];
	_state = '';
	_orderId = '';
	_username = '';
	_orderState = '';
	
	constructor(options: any) {
		const { username, productIds } = options;
		this._state = 'ready';
		this._productIds = productIds;
		this._username = username;

	}

	// 1. 获取支付通道
	async getChannels() {
		let _this = this;
		return new Promise((resolve, reject) => {
			if (this._channel !== null) {
				resolve(this._channel)
				return
			}
			uni.getProvider({
			    service: 'payment',
				success(res) {
					console.log('provider===', res)
					this._channel = res.providers.find((channel) => {
					    return (channel.id === 'appleiap')
					})
				  	
					_this.restoreCompletedTransactions();
					resolve(this._channel)
				},
				fail(e) {
				  	console.log("获取iap支付通道失败：" + e.message);
				  	reject('paymentContext:fail iap service not found')
				}
			})
		})
	}

	// 3. 检查是否存在未关闭的订单
	async restoreCompletedTransactions() {
		return new Promise((resolve, reject) => {
			this._channel.restoreCompletedTransactions({
				manualFinishTransaction: true,
				username: this._username
			}, (results) => {
				console.log('restoreCompletedTransactions===', results)
				results.forEach(res => {
					if(res.transactionState === '0') {
						this.finishTransaction(res)
					}
				})
				resolve(true)
			}, (err) => {
				console.log('restoreCompletedTransactions error===', err)
				
				reject(err);
			})
		});
	}
	
	// 请求支付，传递产品信息
	async requestPayment() {
		uni.showLoading({
			title: '支付中，请稍后'
		})
		
		this._channel.requestProduct(this._productIds, (productRes: any) => {
			console.log('productRes===', productRes)
			this.createorder({
				productId: this._productIds[0]
			}).then(res => {
				if(!this._orderId) {
					uni.hideLoading();
					uni.showModal({
						title: '支付失败，请稍后再试'
					})
					return
				}
				
				uni.requestPayment({
				    provider: 'appleiap',
				    orderInfo:  {
						productid: this._productIds[0],
						username: this._username,
						quantity: 1,
						manualFinishTransaction: true			
					}, 
					success(res) {
						console.log('pay success==', res)
													
						this.validatePaymentResult(res);
						this.finishTransaction(res);
					},
					fail(err) {
						console.log('pay fail==', err)
						uni.hideLoading()
						uni.showModal({
							title: '支付失败, 请稍后再试'
						})
					}
				})
			})
			
		}, (err) => {
			console.log('fail===', err)
			uni.hideLoading();
			uni.showModal({
				title: '支付失败，请稍后再试'
			})
		})
	}
	
	// 服务器验证票据有效后在客户端关闭订单 
	async finishTransaction(transaction: any) {
		return new Promise((resolve, reject) => {
			this._channel.finishTransaction(transaction, (res) => {
				console.log('finishTransaction==', res)
				uni.hideLoading();
				resolve(res);
			}, (err) => {
				uni.hideLoading();
				reject(err);
			});
		});
	}

	// 苹果支付成功之后会返回数据，根据返回数据请求后台接口校验，然后做添加钱等相应业务逻辑
	validatePaymentResult(result : any) {
		validatePaymentResult({
			  orderId: this._orderId,
			  transactionReceipt: result.transactionReceipt, // 不可作为订单唯一标识
			  transactionIdentifier: result.transactionIdentifier
		}, (res: any) => {
			console.log('valid success==', res)
			
			if (res.success) {
				this.updateOrderState('success', result.transactionIdentifier);
			} else {
				uni.showModal({
					title: '支付失败，请稍后再试'
				})
				this.updateOrderState('fail');
			}
			
		}, (err: any) => {
			console.log('fail==', err)
			uni.hideLoading();
			uni.showModal({
				title: '支付失败, 请稍后再试'
			})

			this.updateOrderState('fail');
		})

	}
	
	// 创建订单
	async createorder(option: any) {
		return new Promise((resolve, reject)=>{
			const { productId } = option;
			const params = {
				channel: 'Apple',
				type: 'oneMonth',
				productId
			}
			createOrder(params, (res) => {
				console.log('createOrder==', res)
				this._orderId = res.data.id;
				this._username = this._username + '_' + this._orderId;
				resolve(this._orderId)
			})
		})
	}
	
	// 更新订单状态
	async updateOrderState(orderState: string ,transactionIdentifier?: string) {
		this._orderState = orderState;
		updateOrderState({
			orderId: this._orderId,
			orderState: this._orderState,
			transactionIdentifier
		},(res) => {
			console.log('updateOrderState===', res)
		})
	}

}

export {
	Iap,
	IapTransactionState
}