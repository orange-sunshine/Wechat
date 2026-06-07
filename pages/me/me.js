// pages/me/me.js
var app = getApp();
var host = app.globalData.host;

Page({


	data: {
		nickName: '立即登录'
	},


	onLoad: function (options) {
		this.checkLogin(); //校验是否登录
		wx.setNavigationBarTitle({ //设置标题
			title: '我的'
		})
	},


	checkLogin: function () { //校验是否登录
		var userId = wx.getStorageSync("userId");
		if (userId == null || userId == "") {
			wx.navigateTo({
				url: '../login/login',
			})
		} else {
			this.setData({
				nickName: wx.getStorageSync("nickName")
			});
		}
	},


	nav: function (e) { //我的订单跳转
		var id = e.currentTarget.id;
		var status = e.currentTarget.dataset.status;
		wx.navigateTo({
			url: '../myOrder/myOrder?id=' + id + '&status=' + status
		})
	},

	updatePwd: function (e) { //修改密码
		wx.navigateTo({
			url: '../updatePwd/updatePwd'
		})
	},

	opinion: function (e) { //意见反馈
		wx.navigateTo({
			url: '../opinion/opinion'
		})
	},

	clearStore: function (e) { //清除缓存
		wx.clearStorageSync();
		wx.showToast({
			title: '清除缓存成功',
			icon: 'success',
			duration: 1000
		})
		wx.reLaunch({
			url: '../me/me'
		})
	}
})