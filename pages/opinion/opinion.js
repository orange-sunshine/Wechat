// pages/opinion/opinion.js
var app = getApp();
var host = app.globalData.host;
Page({

	data: {

	},


	onLoad: function (options) {


	},


	formSubmit: function (e) {
		var content = e.detail.value.content;
		if (content == null || content == '') {

			wx.showModal({
				title: '提示',
				content: '请填写您的意见或建议',
				showCancel: false
			});
			return;
		}
		var userId = wx.getStorageSync("userId");
		if (userId == null || userId == "") {
			wx.navigateTo({
				url: '../login/login',
			})
		} else {
			wx.showLoading({ title: '提交中...' })
			wx.request({
				url: host +
					'/api/user/saveOpinion',
				method: 'GET',
				data: {
					userId: userId,
					content: content
				},
				header: {
					'Content-Type': 'application/json'
				},
				success: function (res) {
					wx.hideLoading()
					var code = res.data.code;
					if (code == '0000') {
						wx.showToast({
							title: '保存成功',
							icon: 'success',
							duration: 1000,
							success: function (res) {
								wx.reLaunch({
									url: '../me/me'
								})
							}
						})
					}
				},
				fail: function () {
					wx.hideLoading()
					wx.showToast({ title: '网络异常', icon: 'none' })
				}
			})
		}
	},
})