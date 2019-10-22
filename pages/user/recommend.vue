<template>
	<view>
		<view class="cu-list menu-avatar">
			<view v-for="item in list" :key="item.time" class="cu-item">
				<view class="cu-avatar round lg" :style="'background-image:url('+item.tx+')'"></view>
				<view class="content">
					<view class="text-grey">{{item.name}}</view>
					<view class="text-gray text-sm flex">
						<view class="text-cut">
							<text class="cuIcon-time text-red  margin-right-xs"></text>
							{{item.time}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { User } from '@/api/index';
	export default {
		data() {
			return {
				list: []
			}
		},
		created() {
			this.loadRecommend();
		},
		methods: {
			async loadRecommend() {
				let listData = await User.recommend({ type: 3 });
				this.list = listData;
			}
		}
	}
</script>

<style>

</style>
