<template>
	<view>
		<web-view :webview-styles="webviewStyles" :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: '',
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				}
			}
		},
		methods: {

		},
		onLoad(option) {
			if(option.url) {
				this.url = option.url
			}
		}
	}
</script>

<style>

</style>