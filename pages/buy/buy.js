var app = getApp();
var host = app.globalData.host;
Page({
  data: {
    flag: 0,
    addresses: '',
    goodsList: [],
    addressId: '',
    totalPrice: 0
  },

  onLoad: function (e) {
    console.log(e);
    var goodsData = e.goodsData;
    if (goodsData) {
      var list = JSON.parse(decodeURIComponent(goodsData));
      var total = 0;
      for (var i = 0; i < list.length; i++) {
        total += list[i].goodsPrice * list[i].num;
      }
      this.setData({
        goodsList: list,
        totalPrice: total.toFixed(2),
        addressId: e.addressId || ''
      });
      if (e.addressId) {
        this.loadAddress(e.addressId);
      }
    } else {
      var single = [{
        goodsId: e.goodsId,
        num: parseInt(e.num) || 1
      }];
      this.setData({
        goodsList: single,
        addressId: e.addressId || ''
      });
      if (e.addressId) {
        this.loadAddress(e.addressId);
      }
      this.loadGoodsDetail(e.goodsId);
    }
  },

  loadAddress: function (id) {
    var that = this;
    if (id != null && id != "") {
      wx.showLoading({ title: '加载中...' })
      wx.request({
        url: host + '/api/address/getAddressById',
        method: 'GET',
        data: { "id": id },
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
    }
  },

  loadGoodsDetail: function (goodsId) {
    var that = this;
    if (goodsId) {
      wx.showLoading({ title: '加载中...' })
      wx.request({
        url: host + '/api/goods/getGoodsDetail?goodsId=' + goodsId,
        method: 'GET',
        data: { "goodsId": goodsId },
        header: { 'Content-Type': 'application/json' },
        success: function (res) {
          wx.hideLoading()
          var code = res.data.code;
          var goodsDetail = res.data.data;
          if (code == '0000') {
            var list = that.data.goodsList;
            if (list.length > 0) {
              list[0].goodsName = goodsDetail.goodsName;
              list[0].goodsPrice = goodsDetail.goodsPrice;
              list[0].listPic = goodsDetail.listPic;
            }
            var total = goodsDetail.goodsPrice * (list[0] ? list[0].num : 1);
            that.setData({
              goodsList: list,
              totalPrice: total.toFixed(2)
            });
          }
        },
        fail: function () {
          wx.hideLoading()
          wx.showToast({ title: '网络异常', icon: 'none' })
        }
      })
    }
  },

  selectAddress: function () {
    var goodsData = JSON.stringify(this.data.goodsList);
    wx.navigateTo({
      url: '../address/address?goodsData=' + encodeURIComponent(goodsData)
    })
  },

  buy: function () {
    var that = this;
    var userId = wx.getStorageSync("userId");
    var addressId = this.data.addressId;
    var goodsList = this.data.goodsList;
    if (!addressId) {
      wx.showModal({
        title: '提示',
        content: '请选择收货地址',
        showCancel: false
      })
      return;
    }
    this.getCode();
    wx.showLoading({ title: '提交中...' })

    var doPay = function (orderId) {
      wx.hideLoading()
      wx.navigateTo({
        url: '../paySuccess/paySuccess?orderId=' + orderId
      })
    }

    var submitNext = function (index) {
      if (index >= goodsList.length) return;
      var goods = goodsList[index];
      wx.request({
        url: host + '/api/order/saveOrder',
        method: 'GET',
        data: {
          "goodsId": goods.goodsId,
          "userId": userId,
          "addressId": addressId,
          "num": goods.num
        },
        header: { 'Content-Type': 'application/json' },
        success: function (res) {
          var code = res.data.code;
          var orderId = res.data.data;
          if (code == '0000') {
            if (index == goodsList.length - 1) {
              doPay(orderId);
            } else {
              submitNext(index + 1);
            }
          } else {
            wx.hideLoading()
            wx.showToast({ title: '提交失败', icon: 'none' })
          }
        },
        fail: function () {
          wx.hideLoading()
          wx.showToast({ title: '网络异常', icon: 'none' })
        }
      })
    }
    submitNext(0);
  },

  getCode: function () {
    wx.login({
      success: res => {
        wx.setStorageSync('jscode', res.code)
      }
    })
  }
})
