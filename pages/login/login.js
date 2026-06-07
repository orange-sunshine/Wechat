// pages/login/login.js
var app = getApp();
var host = app.globalData.host;
var timer;
var timeSecond = false,
	sendBolen = false;

Page({
	data: {
		currentTab: 0,
		winWidth: 0,
		winHeight: 0,
		tip: '',
		form_info: '',
		yzmvalue: '获取验证码',
		mobile: '',
		timevalue: 60,
		flag: true,
		verifyCode: ''
	},
	onLoad: function (options) {
		var userId = wx.getStorageSync("userId");
		if (userId == "") {
			this.checklogin();
		} else {
			wx.reLaunch({
				url: '../index/index',
			})
		}
		var that = this;
		wx.getSystemInfo({
			success: function (res) {
				console.log(res);
				that.setData({
					winWidth: res.windowWidth
				});
				that.setData({
					winHeight: res.windowHeight
				});
			}
		})
	},
	switchNav: function (e) {
		var that = this;
		if (this.data.currentTab == e.target.dataset.current) {
			return false;
		} else {
			that.setData({
				currentTab: e.target.dataset.current
			});
			that.setData({
				tip: ''
			});
			that.setData({
				form_info: ''
			});
		}
	},
	toRegister: function (e) {
		wx.navigateTo({
			url: '../register/register'
		})
	},
	formSubmit: function (e) {
		var that = this;
		var loginName = e.detail.value.loginName;
		var mobile = e.detail.value.mobile;
		var loginPassword = e.detail.value.loginPassword;
		var verifyCode = e.detail.value.verifyCode;
		var loginType = that.data.currentTab;
		var code = app.globalData.code;
		//验证表单输入
		var ret = that.checkLogin(loginName, mobile, loginPassword, verifyCode, loginType);
		if (ret) {
			wx.showLoading({ title: '登录中...' })
			wx.request({
				url: host + '/api/user/login',
				method: 'GET',
				data: {
					'loginName': loginName,
					'mobile': mobile,
					'loginPassword': loginPassword,
					'verifyCode': verifyCode,
					'loginType': loginType,
					'code': code
				},
				header: {
					'Content-Type': 'application/json'
				},
				success: function (res) {
					wx.hideLoading()
					console.log(res);
					var code = res.data.code;
					var msg = res.data.data;
					if (code == '0000') {
						app.globalData.userId = res.data.data.user.userId;
						wx.setStorageSync('userId', res.data.data.user.id);
						wx.setStorageSync('nickName', res.data.data.user.nickName)
						wx.setStorageSync('swx_session', res.data.data.swx_session);
						wx.setStorageSync('userMobile', res.data.data.user.mobile);
						wx.setStorageSync('openId', res.data.data.openId);
						wx.setStorageSync('token', res.data.data.token);
						wx.reLaunch({
							url: '../index/index'
						})
						console.log("2")
					} else {
						that.setData({
							tip: msg
						});
						return false
					}
				},
				fail: function () {
					wx.hideLoading()
					wx.showToast({ title: '网络异常', icon: 'none' })
				}
			})
		}
	},
	checkLogin: function (loginName, mobile, loginPassword, verifyCode, loginType) {
		var that = this;
		if (loginType == 0) {
			if (loginName == "") {
				that.setData({
					tip: '用户名不能为空！'
				});
				return false
			}
			if (loginPassword == '') {
				that.setData({
					tip: '密码不能为空！'
				});
				return false
			}
		} else {
			if (mobile == '') {
				that.setData({
					tip: '手机号不能为空！'
				});
				return false
			}
			var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
			if (!myreg.test(mobile)) {
				that.setData({
					tip: '手机号不合法！'
				});
				return false;
			}
			if (verifyCode == '') {
				that.setData({
					tip: '验证码不能为空！'
				});
				return false
			}
		}
		that.setData({
			tip: ''
		});
		return true
	},
	checklogin: function () { //登录页面进行一次获取新的 code
		wx.login({
			success: function (data) {
				console.log(data)
				app.globalData.code = data.code;
			}
		})
	},
	onShareAppMessage: function () {
		// 用户点击右上角分享
		return {
			title: '沐汐科技办公平台', // 分享标题
			desc: '沐汐科技办公平台是一款针对内部使用的办公平台工具，方便企业员工的工作和使用。 ', // 分享描述
			path: '/pages/login/login' // 分享路径
		}
	},
	getcode: function (e) {
		var that = this;
		if (that.data.mobile == "") {
			that.setData({
				tip: '请输入手机号'
			});
			return false;
		}
		var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
		if (!myreg.test(that.data.mobile)) {
			that.setData({
				tip: '手机号不合法！'
			});
			return false;
		}
		that.setData({
			tip: ''
		}); //去除提示
		that.setData({
			flag: false
		}); //显示时间
		wx.showLoading({ title: '发送中...' })
		wx.request({
			url: host + '/api/user/getVerifyCode',
			method: 'GET',
			data: {
				'mobile': this.data.mobile
			},
			header: {
				'Content-Type': 'application/json'
			},
			success: function (res) {
				wx.hideLoading()
				console.log(res);
				var code = res.data.code;
				var msg = res.data.data;
				if (code == '0000') {
					clearInterval(timer);
					timer = setInterval(that.settime, 1000); //验证码倒计时
					that.setData({
						verifyCode: msg
					});
				} else {
					clearInterval(timer);
					that.setData({
						yzmvalue: '获取验证码',
						timevalue: 60,
						flag: true
					});
					that.setData({
						tip: msg
					});
					return false
				}
			},
			fail: function () {
				wx.hideLoading()
				wx.showToast({ title: '网络异常', icon: 'none' })
			}
		})
		console.log(this.data.mobile);
		console.log(e);
	},
	getMobile: function (e) {
		this.setData({
			mobile: e.detail.value
		})
	},
	settime: function () {
		var timevalue = this.data.timevalue;
		if (timevalue == 0) {
			clearInterval(timer)
			this.setData({
				yzmvalue: '重新获取',
				timevalue: 60,
				flag: true
			})
			timeSecond = false;
			sendBolen = false;
			return;
		}
		timevalue--;
		timeSecond = true;
		sendBolen = true;
		this.setData({
			timevalue: timevalue,
			flag: false
		})
	},
})