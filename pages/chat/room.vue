<template>
	<view>
		<view class="cu-chat" @touchstart="drawerVisible = false">
			<scroll-view scroll-y="true" :scroll-with-animation="scrollAnimation" :scroll-top="scrollTop" :scroll-into-view="scrollToView"
			 @scrolltoupper="loadHistory">
				<!-- 加载历史数据waitingUI -->
				<view class="loading">
					<view class="spinner">
						<view class="rect1"></view>
						<view class="rect2"></view>
						<view class="rect3"></view>
						<view class="rect4"></view>
						<view class="rect5"></view>
					</view>
				</view>
				<!-- 消息列表 -->
				<view class="row" v-for="(row,index) in msgList" :key="index" :id="'msg'+row.msg.id">
					<!-- 系统消息 -->
					<block v-if="row.type=='system'">
						<!-- 文字消息 -->
						<view v-if="row.msg.type=='text'" class="cu-info">{{row.msg.content.text}}!</view>
						<!-- 领取红包消息 -->
						<view v-if="row.msg.type=='redEnvelope'" class="cu-info">
							<text class="cuIcon-redpacket_fill text-red"></text>
							{{row.msg.content.text}}
						</view>
					</block>
					<!-- 用户消息 -->
					<block v-if="row.type=='user'">
						<!-- 自己发出的消息 -->
						<view class="cu-item" :class="{self:row.msg.userinfo.uid==myuid}">
							<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></view>
							<view class="main">
								<!-- 文字消息 -->
								<view v-if="row.msg.type=='text'" class="content shadow">
									<rich-text :nodes="row.msg.content.text"></rich-text>
								</view>
								<!-- 图片消息 -->
								<image v-if="row.msg.type=='img'" :src="row.msg.content.url" src="https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg"
								 class="radius" mode="widthFix"></image>
								<!-- 语言消息 -->
								<template v-if="row.msg.type=='voice'">
									<view class="content shadow">
										<text class="cuIcon-sound text-xxl padding-right-xl"> </text>
									</view>
									<view class="action text-bold text-grey">
										{{row.msg.content.length}} "
									</view>
								</template>
								<!-- 红包消息 -->
								<view v-if="row.msg.type=='redEnvelope'" class="red-envelope" @tap="openRedEnvelope(row.msg,index)">
									<image src="/static/img/red-envelope.png"></image>
									<view class="blessing">
										{{row.msg.content.blessing}}
									</view>
								</view>

							</view>
							<view class="date">{{row.msg.time}}</view>
						</view>
					</block>
				</view>
			</scroll-view>
		</view>
		<!-- 底部输入栏 -->
		<view class="chat-bar" :class="{'open':drawerVisible}">
			<!-- 输入框 -->
			<view class="input-box">
				<view class="action" @click="drawerVisible = !drawerVisible">
					<text class="cuIcon-roundadd text-grey"></text>
				</view>
				<input class="solid-bottom" maxlength="300" cursor-spacing="10"></input>
				<view class="action">
					<text class="cuIcon-emojifill text-grey"></text>
				</view>
				<button class="cu-btn bg-green shadow">发送</button>
			</view>
			<!-- popup layer -->
			<view class="popup-layer padding-sm bg-gray">
				<swiper class="swiper">
					<swiper-item>
						<view class="swiper-item">
							<view class="menu-list grid col-4">
								<view class="padding-bottom-sm">
									<navigator url="../packet/send" class="menu-item text-center bg-white radius">
										<text class="cuIcon-redpacket_fill"></text>
									</navigator>
								</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<!-- 红包弹窗 -->
		<view class="modal" :class="{show:packetModalShow}">
			<!-- 遮罩层 -->
			<view class="mask" @touchmove.stop.prevent="discard" @tap="packetModalShow = false"></view>
			<view class="layer" @touchmove.stop.prevent="discard">
				<view class="open-redenvelope">
					<view class="top">
						<view class="close-btn text-xxl">
							<text class="cuIcon-close" @tap="packetModalShow = false"></text>
						</view>
						<image src="/static/img/avatar/face_1.jpg"></image>
					</view>
					<view class="from">来自{{packetData.from}}</view>
					<view class="blessing">{{packetData.blessing}}</view>
					<view class="money">{{packetData.money}}</view>
					<view class="showDetails" @tap="toDetails(packetData.rid)">
						<text>查看领取详情</text>
						<text class="cuIcon-right"></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { Chat } from '@/api/index';
	export default {
		data() {
			return {
				myuid: 0,
				//消息列表
				isHistoryLoading: false,
				scrollAnimation: false,
				scrollTop: 0,
				scrollToView: '',
				msgList: [],
				// 抽屉参数
				drawerVisible: false,
				//红包相关参数
				packetModalShow: false,
				packetData: {
					rid: null, //红包ID
					from: null,
					face: null,
					blessing: null,
					money: null
				}
			};
		},
		methods: {
			// 打开红包
			openRedEnvelope(msg, index) {
				uni.showLoading({
					title: '加载中...'
				});
				this.redenvelopeData = {
					rid: 0, //红包ID
					from: "大黑哥",
					face: "/static/img/im/face/face.jpg",
					blessing: "恭喜发财，大吉大利",
					money: "已领完"
				}
				setTimeout(() => {
					uni.hideLoading();
					this.packetModalShow = true;
				}, 500);
			},
		},
		onLoad() {

		},
		onShow() {
			return
			// 建立websocket连接
			uni.connectSocket({
				url: 'ws://sl.daikan8.com:8282',
			});
			// 监听消息
			uni.onSocketMessage(async (res) => {
				let data = JSON.parse(res.data);
				let { type } = data;
				// 获取sid
				switch (type) {
					case 'ok':
						// 认证socket信息
						let { code, msg } = await Chat.verify({
							type: 3,
							client_id: data.sid,
						});
						break;
					case 'packet':
						// 接收到红包
						this.msgList.push(data);
						break;
					default:
						break;
				}

			});
		},
	}
</script>

<style lang="scss" scoped>
	page {
		padding-bottom: 100upx;
	}

	.chat-bar {
		position: fixed;
		width: 100%;
		height: 446upx;
		bottom: 0;
		z-index: 1024;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		background-color: #ffffff;
		transition: all 0.5s;
		transform: translateY(340upx);

		&.open {
			transform: translateY(0upx);
		}

		.popup-layer {
			padding-bottom: 0;
			height: 340upx;

			.swiper {
				height: 320upx;

				.menu-list {
					.menu-item {
						font-size: 60upx;
						width: 140upx;
						height: 140upx;
						line-height: 140upx;
						margin: 0 auto;
					}
				}
			}
		}

		.input-box {
			flex: 1;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 106upx;
			padding: 20upx;

			.action {
				font-size: 48upx;
			}

			input {
				overflow: initial;
				line-height: 64upx;
				height: 64upx;
				min-height: 64upx;
				flex: 1;
				font-size: 30upx;
				margin: 0 20upx;

				&+.action {
					margin-right: 20upx;
					margin-left: 0upx;
				}
			}
		}


	}

	.cu-chat .row {
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-webkit-flex-direction: column;
		-ms-flex-direction: column;
		flex-direction: column;
	}

	.red-envelope {
		position: relative;

		image {
			width: 133px;
			height: 166px;
		}

		.blessing {
			position: absolute;
			left: 50%;
			bottom: 14%;
			color: #e9b874;
			width: 80%;
			transform: translateX(-50%);
			text-align: center;
			overflow: hidden;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
		}
	}

	.self {

		.cu-avatar {
			order: 2;
		}

		.main {
			order: 1;

			.action {
				order: 1;
			}

			.content {
				background-color: #39b54a;
				color: #ffffff;
				order: 2;
			}
		}
	}

	.modal {

		.mask {
			position: fixed;
			top: 100%;
			width: 100%;
			height: 100%;
			z-index: 1000;
			background-color: rgba(0, 0, 0, .6);
			opacity: 0;
			transition: opacity .2s ease-out;
		}

		.layer {
			position: fixed;
			width: 80%;
			height: 70%;
			left: 10%;
			z-index: 1001;
			border-radius: 20upx;
			overflow: hidden;
			top: 100%;
			transform: scale3d(.5, .5, 1);
			transition: all .2s ease-out;
		}

		&.show {
			display: block;

			.mask {
				top: 0;
				opacity: 1;
			}

			.layer {
				transform: translate3d(0, -85vh, 0) scale3d(1, 1, 1);
			}
		}
	}

	.open-redenvelope {
		width: 100%;
		height: 70vh;
		background-color: #cf3c35;
		position: relative;
		text-align: center;

		.top {
			width: 100%;
			background-color: #fe5454;
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
			border-radius: 0 0 100% 100%;
			box-shadow: inset 0 -20upx 0 #9c1712;

			.close-btn {
				width: 100%;
				height: 80upx;
				display: flex;
				justify-content: flex-end;
				margin-bottom: 30upx;

				.cuIcon-close {
					color: #9c1712;
					margin-top: 10upx;
					margin-right: 10upx;
				}
			}

			image {
				width: 130upx;
				height: 130upx;
				border: solid 12upx #cf3c35;
				border-radius: 100%;
				margin-bottom: -65upx;
			}

			margin-bottom: 65upx;
		}

		.from,
		.blessing,
		.money,
		.showDetails {
			padding: 5upx 5%;
			font-size: 32upx;
			color: #fff;
		}

		.money {
			font-size: 100upx;
			color: #f8d757;
			padding-top: 20upx;
		}

		.showDetails {
			position: absolute;
			width: 100%;
			bottom: 20upx;
			font-size: 28upx;
			color: #f8d757;
			line-height: 32upx;

			.icon {
				font-size: 26upx;
				color: #f8d757;
			}
		}
	}
</style>
