<template>
	<view>

	</view>
</template>

<script>
	import { User } from '@/api/index';
	export default {
		data() {
			return {

			}
		},
		created() {
			this.loadRecommend();
		},
		methods: {
			async loadRecommend() {
				let res = await User.recommend({ type: 3 });

			}
		}
	}
</script>

<style>

</style>
