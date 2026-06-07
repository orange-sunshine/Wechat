var app = getApp();
var host = app.globalData.host;
Page({
	data: {
		currentTab: 0, //当前页签对应的序号值
		books: [{
				"id": 1,
				"listPic": "https://api.mofun365.com:8888/images/goods/1555850845474.jpg",
				"goodsName": "微信小程序开发图解案例教程",
				"goodsPrice": 62.8
			},
			{
				"id": 2,
				"listPic": "https://api.mofun365.com:8888/images/goods/1555851154057.jpg",
				"goodsName": "微信小程序开发全案精讲",
				"goodsPrice": 41.88
			},
			{
				"id": 3,
				"listPic": "https://api.mofun365.com:8888/images/goods/1555851345937.jpg",
				"goodsName": "第一行代码 Java",
				"goodsPrice": 57.7
			}
		]
	},
	onLoad: function (e) {
		var type = e.id; //接收携带参数
		console.log(type);
		this.setData({
			currentTab: type
		}); //根据携带参数显示对应页签内容
	},
	switchNav: function (e) { //页签导航切换
		var type = e.target.dataset.current;
		if (this.data.currentTab == type) {
			return false;
		} else {
			this.setData({
				currentTab: type
			});
			this.getBookList(type);
		}
	}
})