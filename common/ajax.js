// ajax请求
let api = 'http://sl.daikan8.com/app';

function AJAX({ method = "POST", url, data, config }) {
	let headerConfig = { // 默认header ticket、token、params参数是每次请求需要携带的认证信息
		token: '',
		'content-type': 'application/x-www-form-urlencoded'
	};
	uni.showLoading({
		title: '加载中',
	});
	//拼接url
	let serviceUrl = api + url;
	// 获取token
	let token = uni.getStorageSync('token');
	//返回Promise对象
	return new Promise(function(resolve) {
		uni.request({
			method: method,
			url: serviceUrl,
			data: { token, ...data },
			header: Object.assign({}, headerConfig, config), // 合并传递进来的配置
			success: ({ statusCode, data }) => {
				uni.hideLoading();
				if (statusCode == 200) {
					resolve(data);
				} else {
					//错误信息处理
					uni.showModal({
						title: '提示',
						content: '服务器错误，请联系客服',
						showCancel: false,
					})
				}
			}
		})
	})
}

function get(url, data) {
	return AJAX({
		method: "GET",
		url,
		data
	});
}

function post(url, data) {
	return AJAX({
		method: "POST",
		url,
		data
	});
}
export default { AJAX, get, post }
