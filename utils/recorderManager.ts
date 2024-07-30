
/**
 * 录音器管理
 */
class RecorderManager {
	private recorderManager: any;
	private onStopCall: Function;
	
	constructor() {
		this.recorderManager = uni.getRecorderManager();
		this.recorderManager.onStop((res: any) => {
			this.onStopCall && this.onStopCall(res)
		});
	}
	
	startRecord() {
		console.log('开始录音');
		this.recorderManager.start();
	}
	
	stopRecord() {
		console.log('录音结束');
		this.recorderManager.stop();
	}
	
	onStop(call: Function) {
		this.onStopCall = call;
	}
	
}

const recorderManager = new RecorderManager();

export {
	recorderManager
}