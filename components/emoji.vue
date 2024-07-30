<template>
	<view class="emoji-warp">
		<!--列表-->
		<list :show-scrollbar='false'>
			<!-- 注意事项: 不能使用 index 作为 key 的唯一标识 -->
			<cell v-for="(items, index) in emojData" :key="index">
				<view style="display: flex;flex-direction: row;">
					<block v-for="(item, index) in items">
						<view class="emoj_parent"
							hover-class="checkActive"
							hover-stay-time="100"
							@click.stop="tuchEmoj(item,index)">
							<text class="emoj_conn">{{item}}</text>
						</view>
					</block>
				</view>
			</cell>
		</list>
	</view>
 
</template>
 
<script>
	export default {
		data() {
			return {
				emojData: [
					['🤞', '👍', '👏', '❤', '😁', '🖐', '😀', '😃'],
					['😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇'],
					['🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗'],
					['😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨'],
					['🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞'],
					['😔', '😟', '😕', '🙁', '😣', '😖', '😫', '😩'],
					['🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯'],
					['😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓'],
					['🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑'],
					['😬', '🙄', '😯', '😦', '😧', '😮', '😲', '😴'],
					['🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧'],
					['😷', '🤒', '🤕', '🤑', '🤠', '👻', '🐧']
				]
			}
		},
		methods: {
			tuchEmoj: function(item, index) {
				this.$emit('select', item)
			}
		}
	}
</script>
 
<style lang="scss">
	.emoji-warp {
		width: 750rpx;
		height: 220px;
	}
	.emoj_parent {
		margin-left: 8rpx;
		margin-bottom: 5rpx;
		align-items: center;
		margin-top: 8rpx;
		padding-top: 5rpx;
		padding-bottom: 5rpx;
	}
 
	.checkActive {
		background-color: #e8e8e8 !important;
	}
 
	.emoj_conn {
		width: 80rpx;
		font-size: 56rpx;
		text-align: center;
	}
</style>