import config from '../config';

interface Options {
	url: string,
	method?: string,
	data?: any,
	header?: object,
	success?: Function,
	fail?: Function
}

const whiteList = ['/api/login', 'api/heartbeat'];

function request(options: Options) {
	const { isConnected } = getApp().globalData.network;
	const accessToken = uni.getStorageSync('accessToken');
	const {url, method='GET', data={}, header={}, success, fail} = options;
	return uni.request({
		url: `${config.host}${url}`,
		method,
		data,
		header: {
			accessToken,
			...header
		},
		success: (res: any)=>{
			if([401, 403].includes(res.statusCode) && !whiteList.includes(url)) {
				console.log('url===', url, res)
				setTimeout(()=>{
					uni.navigateTo({
						url: '/pages/login/login',
						complete(res) {
							console.log('navigateTo complete', res)
						}
					})
				}, 10)
				return;
			} else if(res.data && !res.data.success && res.data.message){
				uni.showToast({
					icon: 'none',
					title: res.data.message
				});
			}
			success && success(res.data)
		},
		fail: (error) => {
			console.log('network isConnected:', isConnected)
			console.log(`request error: url ${url}`, error)
			if(error && error.errMsg && error.errMsg.includes('-1004')) {
				if(!isConnected) {
					uni.showToast({
						title: '请检查您的网络连接状态',
						mask: true,
						icon: 'loading'
					})
				} else {
					uni.showToast({
						title: '系统服务更新中，请稍后重试',
						mask: true,
						icon: 'loading'
					})
				}
			}
			fail && fail(error)
		}
	})
}

export {
	request
};