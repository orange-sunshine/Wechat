var app = getApp();
var host = app.globalData.host;

Page({
	data: {
		indicatorDots: true,
		autoplay: true,
		interval: 5000,
		duration: 1000,
		imgUrls: ["/pages/images/books/hot-1.jpg"],
		currentTab: 0,
		goodsDetail: null,
		num: 1,
		cartNum: 0
	},

	onLoad: function (e) {
		//从参数 e 里面获取上一个页面携带过来的参数
		var goodsId = e.goodsId;
		this.loadGoodsDetail(goodsId)
		this.loadCart();
	},



	loadGoodsDetail: function (goodsId) { //获取商品详情
		if (goodsId != "") {
			var that = this;
			wx.showLoading({ title: '加载中...' })
			wx.request({
				url: host + '/api/goods/getGoodsDetail',
				method: 'GET',
				data: {
					"goodsId": goodsId
				},
				header: {
					'Content-Type': 'application/json'
				},
				success: function (res) {
					wx.hideLoading()
					var goodsDetail = res.data.data;
					that.setData({
						goodsDetail: goodsDetail
					});
				},
				fail: function () {
					wx.hideLoading()
					wx.showToast({ title: '网络异常', icon: 'none' })
				}
			})
		}
	},
	switchNav: function (e) { //图书详情和出版信息页签切换
		var index = e.currentTarget.id;
		this.setData({
			currentTab: index
		});
	},
	buy: function (e) { //立即购买页面跳转
		var goodsId = e.currentTarget.id;
		var userId = wx.getStorageSync("userId");
		if (userId != '') {
			wx.navigateTo({
				url: '../buy/buy?goodsId=' + goodsId + '&num=' + this.data.num
			})
		} else {
			wx.navigateTo({
				url: '../login/login',
			})
		}
	},
	addGoods: function (e) { //添加商品数量
		var num = this.data.num;
		this.setData({
			num: num + 1
		});
	},
	minusGoods: function (e) { //减少商品数量
		var num = this.data.num;
		if (num > 1) {
			this.setData({
				num: num - 1
			});
		}
	},

	intocart: function (e) { //加入购物车
		var that = this;
		var goodsId = e.currentTarget.id;
		var userId = wx.getStorageSync("userId");
		if (userId != "") {
			wx.showLoading({ title: '加入中...' })
			wx.request({
				url: host + '/api/cart/saveShoppingCart',
				method: 'GET',
				data: {
					'userId': userId,
					'goodsId': goodsId,
					'type': '0'
				},
				header: {
					'Content-Type': 'application/json'
				},
				success: function (res) {
					wx.hideLoading()
					var code = res.data.code;
					if (code == '0000') {
						wx.showToast({ title: '已加入购物车', icon: 'success' })
						that.loadCart();
					}
				},
				fail: function () {
					wx.hideLoading()
					wx.showToast({ title: '网络异常', icon: 'none' })
				}
			})
		} else {
			wx.redirectTo({
				url: '../login/login'
			})
		}
	},
	seeCart: function (e) { //查看购物车
		console.log(e)
		wx.switchTab({
			url: '../shoppingcart/shoppingcart'
		})
	},
	loadCart: function () { //获取购物车列表
		var that = this;
		var userId = wx.getStorageSync("userId");
		if (userId != "") {
			wx.request({
				url: host + '/api/cart/getShoppingCartList',
				method: 'GET',
				data: {
					'userId': userId,
					'type': '0'
				},
				header: {
					'Content-Type': 'application/json'
				},
				success: function (res) {
					console.log(res);
					var code = res.data.code;
					if (code == '0000') {
						var ret = res.data.data;
						that.setData({
							cartNum: ret.length
						});
					}
				},
				fail: function () {
					wx.showToast({ title: '网络异常', icon: 'none' })
				}
			})
		} else {
			wx.redirectTo({
				url: '../login/login'
			})
		}
	},

	//用户点击右上角发送给朋友
	onShareAppMessage: function (res) {
		var goodsDetail = this.data.goodsDetail;
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(res.target)
		}
		return {
			title: goodsDetail.goodsName,
			path: 'pages/goodsDetail/goodsDetail?goodsId=' + this.data.goodsId
		}
	}, //用户点击右上角分享朋友圈
	onShareTimeline: function () {
		return {
			title: '商品详情',
			query: {
				goodsId: this.data.goodsId
			},
			imageUrl: 'https://api.mofun365.com:8888/images/goods/1555850845474.jpg'
		}
	}

})