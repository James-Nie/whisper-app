<script>
	import config from './config.js';
	import { Socket } from './utils/socket';
	import { mapGetters, mapMutations } from 'vuex';
	import {
		read,
		write
	} from './utils/fileStorage';
	import {
		getUserInfo,
		heartbeat
	} from './server/index';

	let socket;
	export default {
		globalData: {  
			network: {
				networkType: '',
				isConnected: true
			},
			loginState: false
		},
		onLaunch: function() {
			console.log('App Launch')
			this.initDeviceId();
			this.getNetworkState();
			this.reconnection();
		},
		onShow: function() {
			console.log('App Show===')
		},
		mounted() {
			console.log('App mounted===')
		},
		onHide: function() {
			console.log('App Hide===')
		},
		computed: {
			...mapGetters(['getMessageList'])
		},
		methods: {
			...mapMutations(['addMessage', 'updateDialogs']),
			initDeviceId() {
				let deviceId = uni.getStorageSync('deviceId');
				if (!deviceId) {
					read((result) => {
						if (result) {
							uni.setStorageSync('deviceId', result)
						} else {
							const deviceInfo = uni.getDeviceInfo()
							deviceId = deviceInfo.deviceId;
							write(deviceId)
							uni.setStorageSync('deviceId', deviceId)
						}
					})

				}
			},
			initSocket(userId) {
				let _this = this;
				socket = new Socket({
					host: config.host, 
					query: {
						userId
					},
					reconnectionDelay: 2000,
					debug: true
				});
				
				// 异常监听
				socket.on("messageException", (data) => {
					uni.showToast({
						icon: 'none',
						title: data.message
					})
				});
				
				// 消息接受
				socket.on("messageFromFriend", (data) => {
					console.log('messageFromFriend===', data)
					this.addMessage(data);
				});
				
				// 建立新的对话
				socket.on("updateDialog", (data) => {
					console.log('updateDialog===', data);
					this.updateDialogs([data]);
				})
				
				// 对方添加我为好友
				socket.on("addFriendFrom", (data) => {
					uni.$emit("addFriendFrom", data)
				})
				
				// 添加对方好友的结果
				socket.on("addFriendResult", (data) => {
					uni.$emit("addFriendResult", data)
				})
				
				// 对方认可我
				socket.on("acceptFriendFrom", (data) => {
					uni.$emit("acceptFriendFrom", data)
				})
				
				// 认可对方的结果
				socket.on("acceptFriendResult", (data) => {
					uni.$emit("acceptFriendResult", data)
				})
				
				
				uni.$on('logout',function(data){
					console.log('登出事件');
					_this.globalData.loginState = false;
					socket.close();
					socket.destroy();
				})
				
				uni.$on('sendMessage',function(data){
					socket.emit("message", data);
				})
				
				// 添加好友
				uni.$on('addFriend',function(data){
					socket.emit("addFriend", data);
				})
				
				// 认可好友
				uni.$on('acceptFriend',function(data){
					socket.emit("acceptFriend", data);
				})
				
				uni.$on('login',function(data){
					console.log('登录事件');
					_this._getUserInfo();
				})
			},
			_getUserInfo() {
				getUserInfo(res => {
					if (res.success) {
						this.globalData.loginState = true;
						uni.setStorageSync('userInfo', res.data);
						this.initSocket(res.data.user_id);
					}
				})
			},
			// 网络状态
			getNetworkState() {
				let _this = this;
				uni.getNetworkType({
					success: (res) => {
						_this.globalData.network.networkType = res.networkType;
						if(res.networkType === 'none') {
							_this.globalData.network.isConnected = false;
						}
					}
				});
				uni.onNetworkStatusChange((res) => {
					this.globalData.network.networkType = res.networkType;
					this.globalData.network.isConnected = res.isConnected;
				})
			},
			// 心跳检测
			reconnection() {
				let _this = this;
				heartbeat({
					success: (data) => {
						_this._getUserInfo();
					},
					fail: (err) => {
						console.log('heartbeat fail==', err)
						setTimeout(()=>{
							_this.reconnection();
						}, 2000)
					}
				})
			},
			
		}
	}
</script>

<style>
	/*每个页面公共css */

</style>