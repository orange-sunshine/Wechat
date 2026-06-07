var app = getApp();
var host = app.globalData.host;

Page({
  data: {
    categories: [
      { id: 0, name: '热门技术', key: 'rmjs' },
      { id: 1, name: '秒杀时刻', key: 'mssk' },
      { id: 2, name: '畅销书籍', key: 'cxsj' }
    ],
    currentIndex: 0,
    goodsList: []
  },

  onLoad: function () {
    this.loadCategoryGoods();
  },

  loadCategoryGoods: function () {
    var that = this;
    wx.showLoading({ title: '加载中...' })
    wx.request({
      url: host + '/api/goods/getHomeGoodsList',
      method: 'GET',
      data: {},
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        wx.hideLoading()
        var book = res.data.data;
        that.setData({
          goodsList: that.getGoodsByIndex(book, that.data.currentIndex)
        });
      },
      fail: function () {
        wx.hideLoading()
        wx.showToast({ title: '网络异常', icon: 'none' })
      }
    })
  },

  getGoodsByIndex: function (book, index) {
    var key = this.data.categories[index].key;
    return book[key] || [];
  },

  switchCategory: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var that = this;
    if (index == this.data.currentIndex) return;
    var book = wx.getStorageSync('book');
    if (book && book[that.data.categories[index].key]) {
      this.setData({
        currentIndex: index,
        goodsList: that.getGoodsByIndex(book, index)
      });
    } else {
      this.setData({ currentIndex: index });
      this.loadCategoryGoods();
    }
  },

  seeDetail: function (e) {
    var goodsId = e.currentTarget.id;
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?goodsId=' + goodsId,
    })
  }
})
