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
			url: '../orderDetail/orderDetail?orderId=' + this.data.orderId
		})
	}
})