<template>
	<view @click="handleClick">
		<view v-if="url && url !== 'null' ">
			<image class="avatar" :src="url" mode="widthFix" :width="width" :height="height" ></image>
		</view>
		<text class="defalt-avatar" v-else
			:style="{'width': width+'px', 'height': height+'px', 'line-height':  height+'px', 'font-size': fontSize+ 'px'}"
		>
			{{nickName.substring(0,1)}}
		</text>
	</view>
</template>

<script>
	export default {
		name: "avatar",
		data() {
			return {

			};
		},
		props: {
			url: {
				type: String
			},
			nickName: {
				type: String
			},
			width: {
				type: [Number, String],
				default: 40
			},
			height: {
				type: [Number, String],
				default: 40
			},
			fontSize: {
				default: 16
			}
		},
		methods: {
			handleClick() {
				this.$emit('handleClick')
			}
		}
	}
</script>

<style lang="scss">
	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 5px;
	}

	.defalt-avatar {
		display: inline-block;
		width: 40px;
		height: 40px;
		display: flex;
		line-height: 40px;
		text-align: center;
		border-radius: 5px;
		background-color: #3498db;
		filter: blur(30px);
		color: #fff;
	}
</style>