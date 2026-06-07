var app = getApp();
var host = app.globalData.host;

Page({
	data: {
		indicatorDots: true,
		autoplay: true,
		interval: 5000,
		duration: 1000,
		imgUrls: [],
		hotlist: [],
		spikeList: [],
		bestSellerList: [],
		host: host
	},

	onLoad: function (options) {
		var that = this;
		that.getBannerList();
		that.getBookList();
	},




	getBannerList: function () {
		var that = this;
		wx.showLoading({ title: '加载中...' })
		wx.request({
			url: host + '/api/banner/getBannerList?type=0',
			method: 'GET',
			data: {},
			header: {
				'Content-Type': 'application/json'
			},
			success: function (res) {
				wx.hideLoading()
				var code = res.data.code;
				var list = res.data.data;
				if (code == '0000') {
					var imgUrls = new Array();
					for (var i = 0; i < list.length; i++) {
						imgUrls.push(host + "/" + list[i].url);
					}
					that.setData({
						imgUrls: imgUrls
					});
				}
			},
			fail: function () {
				wx.hideLoading()
				wx.showToast({ title: '网络异常', icon: 'none' })
			}
		})
	},





	getBookList: function () {
		var that = this;
		wx.showLoading({ title: '加载中...' })
		wx.request({
			url: host + '/api/goods/getHomeGoodsList',
			method: 'GET',
			data: {},
			header: {
				'Content-Type': 'application/json'
			},
			success: function (res) {
				wx.hideLoading()
				var book = res.data.data;
				//将图书列表数据缓存到本地
				wx.setStorage({
					key: 'book',
					data: book,
				})
				//获取缓存到本地的图书列表数据
				book = wx.getStorageSync('book');
				console.log(book);
				var hotList = book.rmjs; //热门书籍列表
				var spikeList = book.mssk; //秒杀时刻列表
				var bestSellerList = book.cxsj; //畅销书籍列表
				that.setData({
					hotList: hotList
				});
				that.setData({
					spikeList: spikeList
				});
				that.setData({
					bestSellerList: bestSellerList
				});
			},
			fail: function () {
				wx.hideLoading()
				wx.showToast({ title: '网络异常', icon: 'none' })
			}
		})
	},


	searchInput: function (e) {
		wx.navigateTo({
			url: '../search/search',
		})
	},


	more: function (e) {
		var id = e.currentTarget.id;
		wx.navigateTo({
			url: '../goods/goods?id=' + id,
		})
	},


	seeDetail: function (e) { //查看商品详情
		var goodsId = e.currentTarget.id;
		wx.navigateTo({
			url: '../goodsDetail/goodsDetail?goodsId=' + goodsId,
		})
	},
	
})