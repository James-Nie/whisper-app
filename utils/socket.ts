import { request } from "./request";
import { encode } from "./queryString";

/**
 * websocket实例化参数
 */
interface Option {
	host: string, //
	query?: object, // 请求参数
	reconnection?: boolean; // 是否重连
	reconnectionAttempts?: null | number; // 重连次数
	reconnectionDelay?: number; // 重新连接前的初始延迟（以毫秒为单位）
	reconnectionDelayMax?: number; // 两次重新连接尝试之间的最大延迟。每次尝试都会使重新连接延迟增加2倍。
	randomizationFactor?: number, //  重新连接时使用的随机化因子
	timeout?: number; // 超时时间
}

// 异步事件队列
interface Queue {
	eventName: string,
	callback: Function
}

class Socket {
	protected socket: any;
	protected baseUrl: string;
	protected sid: string; // 每个通道唯一id
	protected host: string;
	protected id: string;
	private _readyState: string; // 链接状态
	private _queues: Array<Queue>; // 订阅事件队列
	private debug: boolean;
	
	private reconnectionTimes: number; // 重新链接次数
	
	private option: Object;
	
	constructor(option: Option) {
		const { host } = option;
		
		this.option = {
			reconnection: true,
			reconnectionAttempts: null,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
			timeout: 20000,
			autoConnect: true,
			debug: false, //是否开启debu日志
			...option
		};
		const reg = /^http(s)?:\/\//g;
		this.host = host.replace(reg, '');
		this.baseUrl = '/socket.io/';
		this._queues = [];
		this.reconnectionTimes = 0;
		if(this.option.autoConnect) {
			this.emitState('handshake');
		}
	}
	
	// debug方法
	private console() {
		if(this.option.debug) {
			console.log(...arguments)
		}
	}
	
	// 请求参数合并获取，增加EIO、t、sid
	private genParams(transport?: string) {
		let params = {
			EIO: 4,
			transport: transport || 'polling',
			t: Date.now()
		}
		if(this.sid) {
			params.sid = this.sid
		} 
		if (this.option.query){
			params = {
				...this.option.query,
				...params
			}
		}
		return params;
	}
	
	// 对请求url编码
	private genQueryUrl(transport?: string) {
		const queryObj = this.genParams(transport)
		return encode(queryObj)
	}
	
	// 重连
	// 暂时没有使用reconnectionDelayMax
	private reconnection() {
		if(this.option.reconnection) {
			const { reconnectionAttempts } =this.option;
			if(reconnectionAttempts === null || (this.reconnectionTimes < reconnectionAttempts)) {
				setTimeout(()=>{
					this.emitState('handshake');
				}, this.option.reconnectionDelay)
			}
			this.reconnectionTimes ++;
			this.console('reconnection times:', this.reconnectionTimes)
		}
	}
	
	// 整个连接的入口
	// 发起握手请求
	private handshake() {
		request({
			url: this.baseUrl + '?' + this.genQueryUrl(),
			data: this.genParams(),
			header: {
				timeout: this.option.timeout
			},
			success: (res: any) => {
				this.console('handshake ===', res )
				try {
					const data = JSON.parse(res.substring(1))
					const sid = data.sid; 
					
					this.sid = sid; // 通道唯一id赋值
					this.emitState('handshaking');
				} catch(e) {
					this.console(this.baseUrl + '?' + this.genQueryUrl())
					this.console(e)
				}
				
			},
			fail: (err: any) => {
				console.log('handshake err==', err);
				this.emitState('handshakeFail')
			}
		})
	}
	
	private handshaking() {
		request({
			url: this.baseUrl + '?' + this.genQueryUrl(),
			data: '40/websocket,',
			method: 'post',
			header: {
				timeout: this.option.timeout
			},
			success: (res: any) => {
				this.console('handshaking===', res)
				this.emitState('handshakeEnd');
			},
			fail: (err: any) => {
				console.log('handshaking err==', err)
				this.emitState('handshakeFail')
			}
		})
	}
	
	private handshakeEnd() {
		request({
			url: this.baseUrl + '?' + this.genQueryUrl(),
			data: this.genParams(),
			header: {
				timeout: this.option.timeout
			},
			success: (res: any) => {
				this.console('handshakeEnd===', res)
				try{
					if(res.includes('40/websocket,')) {
						const data = JSON.parse(res.replace('40/websocket,', ''));
						this.id = data.sid;
					} else {
						const data = JSON.parse(res.substring(1));
						this.id = data.sid;
					}
					
				}catch(e) {
					console.log('handshakeEnd catch ===', e, res)
					//TODO handle the exception
				}
				this.emitState('connectSocket');
			},
			fail: (err: any) => {
				console.log('handshakeEnd err==', err)
				this.emitState('handshakeFail')
			}
		})
	}
	
	/**
	 * handshake -> handshaking -> handshakend -> connectSocket
	 * 握手失败、服务端关闭 后重连
	 */
	private emitState(state: string) {
		this._readyState = state;
		if(state === 'connectSuccess') {
			this.onSocketMessage();
		} else if (['handshakeFail', 'connectFail'].includes(state)) {
			this.reconnection();
		}
		
		if(this[state] && typeof this[state] === 'function') {
			this[state]();
		}
	}
	
	// 连接websocket
	private connectSocket() {
		uni.connectSocket({
			url: `ws://${this.host}${this.baseUrl}?` + this.genQueryUrl('websocket'),
			header: {
				'content-type': 'application/json'
			},
			protocols: ['websocket'],
			success: () => {
				this.emitState('connectSuccess');
			},
			fail: () => {
				this.console('initSocket fail');
				this.emitState('connectFail');
			}
		})
	}
	
	// 通过 WebSocket 连接发送数据
	private sendTextMessage(text: string) {
		uni.sendSocketMessage({
			data: text
		});
	}

	// 监听 WebSocket 接受到服务器的消息事件
	private onSocketMessage() {
		let _this = this;
		uni.onSocketMessage(function(res) {
			_this.console('收到服务器内容：' + res.data);
			// 心跳保持
			if(res.data === '3probe') {
			    setTimeout(()=>{
					_this.sendTextMessage('5')
				}, 10)
			} else if(res.data === '2') {
			    setTimeout(()=>{
					_this.sendTextMessage('3')
			    }, 10)
			} else if(res.data.includes('42/websocket,')){
				let messageStringData = res.data.replace('42/websocket,', '');
				messageStringData = JSON.parse(messageStringData);
				
				const eventName = messageStringData[0];
				const eventData = messageStringData[1];
				
				_this.queuesExecute(eventName, eventData)
			}
		});
		
		// 监听 WebSocket 连接打开事件
		uni.onSocketOpen(function(res) {
			_this.console('WebSocket连接已打开！', res);
			_this.sendTextMessage('2probe');
		});

		// 监听 WebSocket 错误
		uni.onSocketError(function(err) {
			_this.console('WebSocket连接打开失败，请检查！', err);
			_this.sid = '';
			_this.emitState('handshake');
		});
		
		// 监听 WebSocket 连接关闭事件
		uni.onSocketClose(function (res) {
		  _this.console('WebSocket 已关闭！', res);
		  
		  // 服务端关闭后，尝试重新链接
		  setTimeout(() => {
				_this.sid = '';
				_this.emitState('handshake');
		  }, 2000)
		});
	}
	
	/**
	 * 收到消息后进行回调处理
	 */
	private queuesExecute(eventName: string, data: any) {
		this._queues.forEach((queue: Queue) => {
			if(queue.eventName === eventName) {
				queue.callback(data)
			}
		})
	}
	
	// 手动触发连接
	public connect() {
		this.emitState('handshake');
	}
	
	public on(eventName: string, callback: Function) {
		this._queues.push({
			eventName,
			callback
		})
	}
	
	public emit(eventName: string, data: string | number | Array<any> | object) {
		let messsageData: any;
		if(['string', 'number'].includes(typeof data)) {
			messsageData = data;
		} else if(Array.isArray(data) || typeof data === 'object') {
			messsageData = JSON.stringify(JSON.stringify(data))
		}
		const sendData = `42/websocket,["${eventName}",` + messsageData + `]`;
		
		uni.sendSocketMessage({
			data: sendData
		});
	}
	
	// 关闭连接
	public close() {
		uni.closeSocket()
	}
	
	// 销毁
	public destroy() {
		this.socket = null;
	}
	
}

export {
	Socket
};