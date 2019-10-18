<template>
	<view>
		<form @submit="sendPacket">
			<view class="cu-form-group margin-top">
				<view class="title">
					<text class='cuIcon-rechargefill text-orange'></text>
					总金额
				</view>
				<input placeholder="输入金额" v-model="form.money" name="money"></input>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">红包个数</view>
				<input placeholder="输入红包个数" v-model="form.number" name="number"></input>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">地雷个数</view>
				<input placeholder="输入地雷个数" v-model="form.Bomb" name="Bomb"></input>
			</view>
			<view class="cu-form-group margin-top">
				<input placeholder="恭喜发财 , 大吉大利" v-model="form.blessing" name="blessing"></input>
			</view>
			<view class="padding-lg flex flex-direction">
				<button form-type="submit" class="cu-btn bg-red shadow lg">塞钱进红包</button>
			</view>
		</form>
	</view>
</template>

<script>
	let graceChecker = require("../../common/graceChecker.js");
	import { Packet } from '@/api/index';

	export default {
		data() {
			return {
				form: {
					money: '',
					number: '',
					Bomb: '',
					blessing: '恭喜发财，大吉大利',
					group: 1,
					type: 1,
				}
			};
		},
		methods: {
			async sendPacket(e) {
				// 1、定义验证规则
				var rules = [
					{ name: "money", checkType: "between", checkRule: "0.1,200", errorMsg: "红包金额范围0.1~200元" },
					{ name: "number", checkType: "int", checkRule: "0,3", errorMsg: "请输入红包个数" },
					{ name: "Bomb", checkType: "int", checkRule: "0,3", errorMsg: "请输入地雷个数" },
					{ name: "blessing", checkType: "notnull", checkRule: "", errorMsg: "请输入红包祝福语！" }
				];
				//进行表单验证
				var formData = e.detail.value;
				var isValid = graceChecker.check(formData, rules);
				// 验证失败，提示错误
				if (!isValid) {
					uni.showToast({ title: graceChecker.error, icon: "none" });
				}
				// 发送ajax
				let result = await Packet.release({ ...this.form });
				
			},
		}
	}
</script>

<style lang="scss">
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>
