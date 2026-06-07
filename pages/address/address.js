var app = getApp();
var host = app.globalData.host;
Page({
  data: {
    flag: 0,
    addresses: [],
    goodsData: ''
  },
  onLoad: function (e) {
    var raw = e.goodsData || '';
    this.setData({
      goodsData: raw ? decodeURIComponent(raw) : ''
    });
    this.loadAddress();
  },
  switchNav: function (e) {
    var addressId = e.currentTarget.dataset.id
    var url = '../buy/buy?addressId=' + addressId;
    if (this.data.goodsData) {
      url += '&goodsData=' + encodeURIComponent(this.data.goodsData);
    }
    wx.navigateTo({ url: url })
  },
  newAddress: function (e) {
    var url = '../newAddress/newAddress?goodsData=' + encodeURIComponent(this.data.goodsData);
    wx.navigateTo({ url: url })
  },
  editAddress: function (e) {
    var url = '../newAddress/newAddress?addressId=' + e.currentTarget.id + '&goodsData=' + encodeURIComponent(this.data.goodsData);
    wx.navigateTo({ url: url })
  },
  loadAddress: function () {
    var that = this;
    var userId = wx.getStorageSync("userId");
    if (userId != "") {
      wx.showLoading({ title: '加载中...' })
      wx.request({
        url: host + '/api/address/selectAddressByUserId',
        method: 'GET',
        data: { "userId": userId },
        header: { 'Content-Type': 'application/json' },
        success: function (res) {
          wx.hideLoading()
          var code = res.data.code;
          var addresses = res.data.data;
          if (code == '0000') {
            that.setData({ addresses: addresses });
          }
        },
        fail: function () {
          wx.hideLoading()
          wx.showToast({ title: '网络异常', icon: 'none' })
        }
      })
    } else {
      wx.redirectTo({ url: '../login/login' })
    }
  }
})
