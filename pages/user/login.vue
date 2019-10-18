<template>
	<view class="container">
		<input type="text" v-model="formData.uid" />
		<button @click="loginHandle" type="primary">登录</button>
	</view>
</template>

<script>
	import { User } from '@/api/index';
	export default {
		data() {
			return {
				formData: {
					uid: 10000,
					zt: 4,
				}
			}
		},
		methods: {
			async loginHandle() {
				let { token, type } = await User.login({ ...this.formData });
				uni.setStorageSync('token', token);
				uni.switchTab({
					url: '/pages/chat/list'
				});
			}
		}
	}
</script>

<style>
</style>
