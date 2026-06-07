var app = getApp();
var host = app.globalData.host;
Page({
	data: {
		currentTab: 0,
		orders: []
	},
	onLoad: function (e) {
		var id = e.id;
		var status = e.status;
		console.log(id);
		this.setData({
			currentTab: id
		});
		this.loadOrders(status);
	},
	switchNav: function (e) {
		var that = this;
		var status = e.currentTarget.dataset.status;
		if (this.data.currentTab == e.target.dataset.current) {
			return false;
		} else {
			that.setData({
				currentTab: e.target.dataset.current
			});
		}
		that.loadOrders(status);
	},
	toPay: function (e) {
		wx.redirectTo({
			url: '../orderDetail/orderDetail?orderId=' + e.currentTarget.id
		})
	},
	toBuy: function (e) {
		var goodsId = e.currentTarget.id;
		wx.navigateTo({
			url: '../goodsDetail/goodsDetail?goodsId=' + goodsId,
		})
	},
	toList: function (e) {
		wx.reLaunch({
			url: '../index/index'
		})
	},
	deleteOrder: function (e) {
		var that = this;
		var id = e.currentTarget.id;
		var status = e.currentTarget.dataset.status;
		wx.showLoading({ title: '删除中...' })
		wx.request({
			url: host + '/api/order/deleteOrder',
			method: 'GET',
			data: {
				id: id
			},
			header: {
				'Content-Type': 'application/json'
			},
			success: function (res) {
				wx.hideLoading()
				var code = res.data.code;
				if (code == '0000') {
					wx.showToast({
						title: '删除成功',
						icon: 'success',
						duration: 1000
					})
					that.loadOrders(status);
				}
			},
			fail: function () {
				wx.hideLoading()
				wx.showToast({ title: '网络异常', icon: 'none' })
			}
		})
	},
	loadOrders: function (orderStatus) {
		var that = this;
		var userId = wx.getStorageSync("userId");
		wx.showLoading({ title: '加载中...' })
		wx.request({
			url: host + '/api/order/getOrderList',
			method: 'GET',
			data: {
				userId: userId,
				orderStatus: orderStatus
			},
			header: {
				'Content-Type': 'application/json'
			},
			success: function (res) {
				wx.hideLoading()
				var paidOrders = wx.getStorageSync('paidOrders') || {};
				var orders = res.data.data || [];
				var filtered = [];
				for (var i = 0; i < orders.length; i++) {
					if (!paidOrders[orders[i].id]) {
						filtered.push(orders[i]);
					}
				}
				that.setData({
					orders: filtered
				});
			},
			fail: function () {
				wx.hideLoading()
				wx.showToast({ title: '网络异常', icon: 'none' })
			}
		})
	}
})