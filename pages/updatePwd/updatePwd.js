var app = getApp();
var host = app.globalData.host;

Page({

	data: {

	},

	
	onLoad: function (options) {

	},


	formSubmit: function (e) { //校验表单和提交表单
		var that = this;
		var oldPwd = e.detail.value.oldPwd;
		var newPwd = e.detail.value.newPwd;
		var confirmPwd = e.detail.value.confirmPwd;
		if (oldPwd == null || oldPwd == '') {
			that.showTip("原密码不能为空");
			return;
		}
		if (newPwd == null || newPwd == '') {
			that.showTip("新密码不能为空");
			return;
		}
		if (confirmPwd == null || confirmPwd == '') {
			that.showTip("确认密码不能为空");
			return;
		}
		if (confirmPwd != newPwd) {
			that.showTip("新密码与确认密码不一致");
			return;
		}
		var userId = wx.getStorageSync("userId");
		if (userId == null || userId == "") {
			wx.navigateTo({
				url: '../login/login',
			})
		} else {
			wx.showLoading({ title: '修改中...' })
			wx.request({
				url: host + '/api/user/updatePwd',
				method: 'GET',
				data: {
					userId: userId,
					oldPwd: oldPwd,
					newPwd: newPwd
				},
				header: {
					'Content-Type': 'application/json'
				},
				success: function (res) {
					wx.hideLoading()
					var code = res.data.code;
					if (code == '0000') {
						wx.showToast({
							title: '修改成功',
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

	showTip: function (content) { //表单校验弹窗提示
		wx.showModal({
			title: '提示',
			content: content,
			showCancel: false
		});
	}
})