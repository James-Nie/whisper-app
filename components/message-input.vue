<template>
	<view class="input-wrap">
		<view class="input-box">
			<view class="">
				<image class="icon" src="/static/microphone.png" mode="widthFix" @click="changeInputType" v-if="inputType==='text' "></image>	
				<image class="icon" src="/static/keybord.png" mode="widthFix" @click="changeInputType" v-else="inputType==='audio' "></image>
			</view>
			<text
				id="audioRecord"
				class="audio-btn"
				v-if="inputType ==='audio' "
				@touchstart="wrapTouchStart"
				@touchend="wrapTouchEnd"
			>{{audioBtnText}}</text>
			<textarea v-else ref="inputVal"
				class="text-value" auto-height 
				v-model="inputVal"
				@focus="inputFocus" 
				@confirm="handleSubmit"
				@blur="handleBlur"
				:placeholder="placeholder" 
			/>
			<view class="right-btns">
				<image class="icon" src="/static/expression.png" mode="widthFix" @click.stop="toggleEmoji" v-if="showEmoji"></image>
				<image class="icon" src="/static/plus.png" mode="widthFix" v-if="!renderEmoji " @click="chooseImage"></image>
				<image class="icon" src="/static/send.png" mode="widthFix" v-if="renderEmoji " @click="handleSubmit"></image>
			</view>
		</view>
		<Emoji v-if="renderEmoji" @select="selectEmoji"></Emoji>
		
		<!-- <view class="audio-operate" id="audioCancel">
			<uni-icons type="closeempty" size="50"></uni-icons>
		</view> -->
		
	</view>
</template>

<script>
	import Emoji from './emoji.vue';
	import { upload } from '@/utils/OSS';
	import { recorderManager } from '@/utils/recorderManager';
	export default {
		name: "message-input",
		components: {
			Emoji
		},
		props: {
			canSendImage: {
				type: Boolean,
				default: false
			},
			showEmoji: {
				type: Boolean,
				default: false
			},
			placeholder: {
				type: String
			}
		},
		data() {
			return {
				renderEmoji: false,
				inputVal: '',
				inputType: 'text',
				audioBtnText: '按住说话',
				screenheight: '',
				audioCancel: false
			};
		},
		onShow() {
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 300
			});
		},
		mounted() {
			const windowInfo = uni.getWindowInfo();
			this.screenheight = windowInfo.windowHeight + 'px';
			
			const _this = this;
			recorderManager.onStop((res) => {
				const { tempFilePath } = res;
				console.log('audioCancel===', this.audioCancel)
				
				if(this.audioCancel) { // 取消发送
					return;
				}
				upload({
					fileType: 'audio', 
					fileLocalPath: tempFilePath,
					success: (res, url) => {
						console.log(res, url)
						_this.$emit('submit', {
							type: 'audio',
							content: url
						})
					},
					fail: (err) => {
						console.log('upload err===', err)
					}
				})
			})
		},
		methods: {
			toggleEmoji() {
				this.renderEmoji = !this.renderEmoji;
				this.inputType = 'text';
				this.$refs.inputVal.blur();
			},
			inputFocus() {
				this.inputType = 'text';
				this.renderEmoji = false;
			},
			handleBlur() {
				console.log('handleBlur===')
			},
			handleSubmit() {
				if(this.inputVal.trim()) {
					this.$emit('submit', {
						type: 'text',
						content: this.inputVal.trim()
					})
					this.$refs.inputVal.blur();
					this.inputVal = '';
				}
			},
			wrapTouchStart(evt) {
				if(evt.target.id && evt.target.id ==='audioRecord') {
					recorderManager.startRecord();
					this.audioBtnText = '松开发送';
				}
				
			},
			wrapTouchEnd(evt) {
				console.log('wrapTouchEnd', evt)
				
				if(evt.target.id && evt.target.id === 'audioCancel') {
					this.audioCancel = true;
				} else {
					this.audioCancel = false;
				}
				
				recorderManager.stopRecord();
				this.audioBtnText = '按住说话';
			},
			
			selectEmoji(data) {
				this.inputVal = this.inputVal + data;
			},
			chooseImage() {
				const _this = this;
				if(!this.canSendImage) {
					uni.showToast({
						icon: 'none',
						title: '对方认可才能发送图片'
					})
					return;
				}
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					success: function(res) {
						const localPath = res.tempFilePaths[0];
						console.log('localPath==', localPath)
						upload({
							fileType: 'images', 
							fileLocalPath: localPath,
							success: (res, url) => {
								_this.$emit('submit', {
									type: 'image',
									content: url
								})
							},
							fail: (err) => {
								
							}
						})
					}
				})
			},
			changeInputType() {
				if(this.inputType === 'text') {
					if(!this.canSendImage) {
						uni.showToast({
							icon: 'none',
							title: '对方认可才能发送语音'
						})
						return;
					}
					this.inputType = 'audio';
					this.renderEmoji = false;
				} else {
					this.inputType = 'text';
				}
			},
			audioBtnTouchmove() {
				console.log('audioBtnTouchmove========')
			},
			
		}
	}
</script>

<style lang="scss">
	.input-wrap {
		position: fixed;
		bottom: 0px;
		background-color: $uni-bg-color-grey;
		padding: 10rpx;
		z-index: 900;
		border-top: 1px solid $uni-border-color;
		.input-box {
			display: flex;
			flex-direction: row;
			width: 750rpx;
			justify-content: space-between;
			align-items: center;
			.right-btns {
				padding-right: 10px;
				display: flex;
				flex-direction: row;
				width: 70px;
				justify-content: space-between;
			}
			.icon {
				display: inline-block;
				width: 25px;
				height: 25px;
			}
			.icon:last-child {
				padding-right: 10px;
			}

			.text-value {
				width: 260px;
				padding: 5px;
				// margin-left: 8px;
				border: 1px solid #f7f7f7;
				border-radius: 5px;
				background-color: #fff;
			}
			.audio-btn {
				width: 260x;
				padding: 5px;
				margin-left: 8px;
				border: 1px solid #f7f7f7;
				border-radius: 5px;
				text-align: center;
				background-color: #fff;
			}
			.audio-btn:active {
				background-color: #ddd;
				color: #333;
			}
		}
		
		.audio-operate {
			width: 60px;
			height: 60px;
			border-radius: 60px;
			background-color: #666;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			position: absolute;
			bottom: 120px;
			left: 375rpx;
			margin-left: -30px;
		}
		.audio-operate:active{
			background-color: $uni-bg-color-grey;
		}
		
	}
</style>