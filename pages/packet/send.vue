<template>
	<view>
		<form @submit="sendPacket">
			<view class="cu-form-group margin-top">
				<view class="title">
					<text class='cuIcon-rechargefill text-orange'></text>
					总金额
				</view>
				<input type="number" placeholder="红包金额必须是10的倍数" v-model="form.money" name="money"></input>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">红包个数</view>
				<picker @change="packetPickerChange" :value="packetIndex" :range="packetNumber">
					<view class="picker">
						{{packetNumber[packetIndex]}}个
					</view>
				</picker>
				<input type="text" class="hidden" v-model="form.number" name="number" />
			</view>

			<view class="cu-form-group margin-top">
				<view class="title">地雷数字</view>
			</view>
			<view class="bg-white padding-xs">
				<view class="grid col-5 ">
					<view v-for="item in bombNumber" :key="item.value">
						<view @click="bombCheckHandle(item)" :class="item.selected?'bg-blue':'bg-gray'" class="checkbox padding text-center margin-xs solid shadow radius">
							{{item.title}}
						</view>
					</view>
				</view>
				<view class="grid padding-xs text-sm">
					<text>多雷请选择多个数字：</text>
					<input v-model="form.Bomb" class="text-blue text-sm" disabled name="Bomb"></input>
				</view>
			</view>

			<view class="cu-form-group margin-top">
				<input type="text" placeholder="恭喜发财 , 大吉大利" v-model="form.blessing" name="blessing"></input>
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
					number: 9,
					Bomb: '',
					blessing: '恭喜发财，大吉大利',
					group: 1,
					type: 1,
				},
				packetNumber: [7, 9],
				packetIndex: 1,
				bombNumber: [{
					value: 0,
					selected: false,
					title: 0
				}, {
					value: 1,
					selected: false,
					title: 1
				}, {
					value: 2,
					selected: false,
					title: 2
				}, {
					value: 3,
					selected: false,
					title: 3
				}, {
					value: 4,
					selected: false,
					title: 4
				}, {
					value: 5,
					selected: false,
					title: 5
				}, {
					value: 6,
					selected: false,
					title: 6
				}, {
					value: 7,
					selected: false,
					title: 7
				}, {
					value: 8,
					selected: false,
					title: 8
				}, {
					value: 9,
					selected: false,
					title: 9
				}]
			};
		},
		computed: {
			bombChecked: function() {
				let checkedValue = this.bombNumber
					.filter((item) => item.selected == true)
					.map(item => item.value)
					.toString();
				return checkedValue;;
			}
		},
		methods: {
			packetPickerChange(e) {
				this.packetIndex = e.detail.value;
				this.form.number = this.packetNumber[e.detail.value];
			},
			bombCheckHandle(item) {
				item.selected = !item.selected;
				this.form.Bomb = this.bombChecked;
			},
			async sendPacket(e) {
				// 1、定义验证规则
				var rules = [
					{ name: "money", checkType: "between", checkRule: "10,200", errorMsg: "红包金额范围10~200元" },
					{ name: "number", checkType: "int", checkRule: "0,3", errorMsg: "请选择红包个数" },
					{ name: "Bomb", checkType: "reg", checkRule: "^[0-9]|(,[0-9])*$", errorMsg: "请选择0~9之间地雷数字" },
					{ name: "blessing", checkType: "notnull", checkRule: "", errorMsg: "请输入红包祝福语！" }
				];
				//进行表单验证
				var formData = e.detail.value;
				var isValid = graceChecker.check(formData, rules);
				uni.redirectTo({
					url: `../chat/room?packet=43121`
				});
				// 验证失败，提示错误
				if (!isValid) {
					uni.showToast({ title: graceChecker.error, icon: "none" });
					return;
				}
				// 发送ajax
				let res = await Packet.release({ ...this.form });
				if (res.code == 0) {
					uni.showToast({
						title: res.msg,
						icon: "none"
					});
					return;
				}
				uni.redirectTo({
					url: `../chat/room?packet=${res.id}`
				});
			},
		}
	}
</script>

<style lang="scss">
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}

	.hidden {
		display: none;
	}
</style>
