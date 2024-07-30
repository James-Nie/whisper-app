<template>
	<text class="link" @click="goto" :style="{'color': color}">{{text}}</text>
</template>

<script>
	export default {
		name:"link",
		data() {
			return {
				
			};
		},
		props: {
			color: {
				type: String,
				default: "#007BFF"
			},
			text: {
				type: String
			},
			url: {
				type: String
			}
		},
		methods: {
			goto() {
				if(this.url) {
					uni.navigateTo({
						url: `/pages/webview/webview?url=${this.url}`
					})
				}
			}
		}
	}
</script>

<style>

</style>