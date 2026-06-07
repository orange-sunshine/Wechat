var app = getApp();
var host = app.globalData.host;
Page({
  data: {
    carts: [],
    totalPrice: 0,
    selectAll: false
  },
  onLoad: function () {
    this.loadCarts();
  },
  onShow: function () {
    this.loadCarts();
  },

  loadCarts: function () {
    var that = this;
    var userId = wx.getStorageSync("userId");
    if (userId == null || userId == "") {
      wx.navigateTo({ url: '../login/login' })
    } else {
      wx.showLoading({ title: '加载中...' })
      wx.request({
        url: host + '/api/cart/getShoppingCartList',
        method: 'GET',
        data: { userId: userId, type: 0 },
        header: { 'Content-Type': 'application/json' },
        success: function (res) {
          wx.hideLoading()
          var doneIds = wx.getStorageSync('checkoutCartIds') || [];
          var carts = res.data.data || [];
          var filtered = [];
          for (var i = 0; i < carts.length; i++) {
            if (doneIds.indexOf(carts[i].id) === -1) {
              carts[i].selected = false;
              filtered.push(carts[i]);
            }
          }
          that.setData({
            carts: filtered,
            totalPrice: 0,
            selectAll: false
          });
        },
        fail: function () {
          wx.hideLoading()
          wx.showToast({ title: '网络异常', icon: 'none' })
        }
      })
    }
  },

  toggleCheck: function (e) {
    var id = e.currentTarget.dataset.id;
    var carts = this.data.carts;
    for (var i = 0; i < carts.length; i++) {
      if (carts[i].id == id) {
        carts[i].selected = !carts[i].selected;
        break;
      }
    }
    this.setData({ carts: carts });
    this.computeTotal();
  },

  toggleAll: function () {
    var selectAll = !this.data.selectAll;
    var carts = this.data.carts;
    for (var i = 0; i < carts.length; i++) {
      carts[i].selected = selectAll;
    }
    this.setData({ carts: carts, selectAll: selectAll });
    this.computeTotal();
  },

  addGoods: function (e) {
    var id = e.target.id;
    var carts = this.data.carts;
    for (var i = 0; i < carts.length; i++) {
      if (id == carts[i].id) {
        carts[i].num = carts[i].num + 1;
        this.updateCartNum(carts[i].id, carts[i].num);
        break;
      }
    }
    this.setData({ carts: carts });
    this.computeTotal();
  },

  minusGoods: function (e) {
    var id = e.target.id;
    var carts = this.data.carts;
    for (var i = 0; i < carts.length; i++) {
      if (id == carts[i].id) {
        if (carts[i].num > 1) {
          carts[i].num = carts[i].num - 1;
          this.updateCartNum(carts[i].id, carts[i].num);
          break;
        }
      }
    }
    this.setData({ carts: carts });
    this.computeTotal();
  },

  updateCartNum: function (cartId, num) {
    wx.request({
      url: host + '/api/cart/updateCartNum',
      method: 'GET',
      data: { cartId: cartId, num: num },
      header: { 'Content-Type': 'application/json' },
      success: function (res) {}
    })
  },

  computeTotal: function () {
    var carts = this.data.carts;
    var totalPrice = 0;
    var checkedCount = 0;
    for (var i = 0; i < carts.length; i++) {
      if (carts[i].selected) {
        totalPrice += carts[i].goodsPrice * carts[i].num;
        checkedCount++;
      }
    }
    var selectAll = checkedCount == carts.length && carts.length > 0;
    this.setData({
      totalPrice: totalPrice.toFixed(2),
      selectAll: selectAll
    });
  },

  buy: function () {
    var carts = this.data.carts;
    var selected = [];
    for (var i = 0; i < carts.length; i++) {
      if (carts[i].selected) {
        selected.push({
          cartId: carts[i].id,
          goodsId: carts[i].goodsId,
          num: carts[i].num,
          goodsName: carts[i].goodsName,
          goodsPrice: carts[i].goodsPrice,
          listPic: carts[i].listPic
        });
      }
    }
    if (selected.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择结算商品',
        showCancel: false
      })
      return;
    }
    var cartIds = [];
    for (var i = 0; i < selected.length; i++) {
      cartIds.push(selected[i].cartId);
    }
    wx.setStorageSync('checkoutCartIds', cartIds);
    if (selected.length == 1) {
      wx.navigateTo({
        url: '../buy/buy?goodsId=' + selected[0].goodsId + '&num=' + selected[0].num
      })
    } else {
      wx.navigateTo({
        url: '../buy/buy?goodsData=' + encodeURIComponent(JSON.stringify(selected))
      })
    }
  }
})
