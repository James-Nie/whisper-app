<template>
	<view class="empty-page" :style="{ 'height': pageHeight }">
		<image class="icon" :src="icon" mode="widthFix"></image>
		<text class="text">{{text}}</text>
	</view>
</template>

<script>
	export default {
		name:"empty",
		data() {
			return {
				pageHeight: '500px'
			};
		},
		props: {
			height: {
				type: Number
			},
			icon: {
				default: '/static/empty.png'
			},
			text: {
				type: String,
				default: '咦，怎么是空的呢'
			}
		},
		mounted() {
			if(!this.height) {
				const sysInfo = uni.getSystemInfoSync();
				this.pageHeight = sysInfo.windowHeight + 'px'
			}
			console.log('sysInfo==', sysInfo)
		}
	}
</script>

<style lang="scss">
.empty-page {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	.icon {
		width: 50px;
		height: 50px;
		margin-bottom: 10px;
	}
	.text {
		color: $uni-text-color;
		font-size: 14px;
	}
}
</style>