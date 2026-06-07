Page({
	data: {
		orderId: 0
	},
	onLoad: function (e) {
		var orderId = e.orderId;
		this.setData({
			orderId: orderId
		});
	},
	orderDetail: function () {
		wx.redirectTo({
			url: '../myOrder/myOrder?id=0&status=1'
		})
	}
})