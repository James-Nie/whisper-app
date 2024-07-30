
class Audio {
	private audioContext: any;
	private url: string;
	
	constructor() {
		this.audioContext = uni.createInnerAudioContext();
	}
	
	public play(url: string) {
		if(this.url && !this.audioContext.paused) {
			this.stop();
		}
		this.url = url;
		this.audioContext.src = url;
		this.audioContext.play();
	}
	
	private stop() {
		this.audioContext.stop()
	}
	
	public onPlay() {
		this.audioContext.onPlay(() => {
		  console.log('开始播放');
		});
		
	}
	
	public onError(call: Function) {
		this.audioContext.onError((res: any) => {
		  call && call(res)
		});
	}
	
	public onPause(call: Function) {
		this.audioContext.onPause(()=>{
			call && call()
		})
	}
	
	public onStop(call: Function) {
		this.audioContext.onStop((res)=>{
			call && call(res)
		})
	}
	
	public onEnded(call: Function) {
		this.audioContext.onStop(()=>{
			call && call()
		})
	}
	
}

const audio = new Audio()

export {
	audio
}