<template>
	<view>
		<view class="cu-list menu-avatar">
			<view class="cu-item arrow">
				<view class="cu-avatar round xl" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg)">
					<view class="cu-tag badge" :class="0?'cuIcon-female bg-pink':'cuIcon-male bg-blue'"></view>
				</view>
				<view class="content">
					<view class="text-black">
						<view class="text-cut">昵称：瓦洛兰之盾-塔里克</view>
					</view>
					<view class="text-gray text-sm">
						<view class="text-cut">
							账号：moz
						</view>
						<view class="text-cut">
							用户ID:17368
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-list menu sm-border">
			<view class="cu-item margin-tb-xs arrow">
				<navigator class="content" hover-class="none" url="../list/list" open-type="redirect">
					<text class="cuIcon-pay text-olive"></text>
					<text class="text-grey">钱包</text>
				</navigator>
				<view class="action">
					<text class="text-orange text-sm">{{balance}}元</text>
				</view>
			</view>
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" url="../list/list" open-type="redirect">
					<text class="cuIcon-fork text-purple"></text>
					<text class="text-grey">我的推广</text>
				</navigator>
			</view>
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" url="../list/list" open-type="redirect">
					<text class="cuIcon-service text-green"></text>
					<text class="text-grey">客服充值</text>
				</navigator>
			</view>
			<view class="cu-item margin-tb-xs arrow">
				<navigator class="content" hover-class="none" url="../list/list" open-type="redirect">
					<text class="cuIcon-recharge text-orange"></text>
					<text class="text-grey">充值</text>
				</navigator>
			</view>
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" url="../list/list" open-type="redirect">
					<text class="cuIcon-sponsor text-red"></text>
					<text class="text-grey">提现</text>
				</navigator>
			</view>
			<view class="cu-item arrow">
				<navigator class="content" hover-class="none" url="../list/list" open-type="redirect">
					<text class="cuIcon-form text-mauve"></text>
					<text class="text-grey">资金记录</text>
				</navigator>
			</view>
			<view class="cu-item margin-tb-xs arrow">
				<navigator class="content" hover-class="none" url="../list/list" open-type="redirect">
					<text class="cuIcon-settings text-pink"></text>
					<text class="text-grey">设置</text>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	import { Money } from '@/api/index';
	export default {
		data() {
			return {
				balance: 0,
			}
		},
		created() {
			this.loadBalance();
		},
		methods: {
			async loadBalance() {
				let { money } = await Money.balance({ type: 2 });
				this.balance = money;
			}
		},
	}
</script>

<style scoped>
	.menu-avatar .cu-item {
		height: 240upx;
	}

	.menu-avatar .cu-item .content {
		left: 180upx;
	}

	.cu-list.menu-avatar>.cu-item.arrow:before {
		position: absolute;
		top: 0;
		right: 15px;
		bottom: 0;
		display: block;
		margin: auto;
		width: 15px;
		height: 15px;
		color: #8799a3;
		content: "\E6A3";
		text-align: center;
		font-size: 17px;
		font-family: cuIcon;
		line-height: 15px;
	}

	.cu-list.menu {
		margin-top: 0upx;
	}
</style>
