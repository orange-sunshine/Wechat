var app = getApp();
var host = app.globalData.host;
Page({
  data: {
    index: 0,
    tip: '',
    address: '',
    region: ['北京市', '北京市', '大兴区'],
    customItem: '全部',
    addressId: '',
    sex: '',
    phone: '',
    num: '',
    userName: '',
    goodsData: '',
    goodsId: '',
    goodsNum: ''
  },
  onLoad: function (e) {
    var raw = e.goodsData || '';
    this.setData({
      goodsData: raw ? decodeURIComponent(raw) : '',
      goodsId: e.goodsId || '',
      goodsNum: e.num || ''
    });
    var addressId = e.addressId;
    if (addressId) {
      this.setData({ addressId: addressId });
      this.loadAddress(addressId);
    }
  },
  loadAddress: function (addressId) {
    var that = this;
    wx.showLoading({ title: '加载中...' })
    wx.request({
      url: host + '/api/address/getAddressById',
      method: 'GET',
      data: { "id": addressId },
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        wx.hideLoading()
        var code = res.data.code;
        var address = res.data.data;
        if (code == '0000') {
          that.setData({
            userName: address.personName,
            sex: address.gender,
            phone: address.contactNumber,
            num: address.houseNumber,
            address: address.address
          });
          var cities = address.city;
          var region = cities.split(', ');
          that.setData({ region: region });
        }
      },
      fail: function () {
        wx.hideLoading()
        wx.showToast({ title: '网络异常', icon: 'none' })
      }
    })
  },
  bindPickerChange: function (e) {
    this.setData({ index: e.detail.value });
  },
  formSubmit: function (e) {
    var that = this;
    var personName = e.detail.value.userName;
    var gender = e.detail.value.sex;
    var contactNumber = e.detail.value.phone;
    var address = e.detail.value.address;
    var houseNumber = e.detail.value.num;
    var citys = e.detail.value.city;
    var city = citys[0];
    if (citys[1] != '全部') { city += ', ' + citys[1]; }
    if (citys[2] != '全部') { city += ', ' + citys[2]; }
    var ret = that.check(personName, gender, contactNumber, address, houseNumber, city);
    var userId = wx.getStorageSync("userId");
    var addressId = this.data.addressId;
    if (userId != "") {
      if (ret) {
        wx.showLoading({ title: '保存中...' })
        var buildUrl = function () {
          var base = '../address/address?goodsData=' + encodeURIComponent(that.data.goodsData || '');
          return base;
        };
        if (addressId) {
          wx.request({
            url: host + '/api/address/updateAddress',
            method: 'GET',
            data: {
              "userId": userId, "personName": personName, "gender": gender,
              "contactNumber": contactNumber, "address": address, "houseNumber": houseNumber,
              "city": city, "addressId": addressId
            },
            header: { 'Content-Type': 'application/json' },
            success: function (res) {
              wx.hideLoading()
              if (res.data.code == '0000') {
                wx.redirectTo({ url: buildUrl() })
              }
            },
            fail: function () {
              wx.hideLoading()
              wx.showToast({ title: '网络异常', icon: 'none' })
            }
          })
        } else {
          wx.request({
            url: host + '/api/address/saveAddress',
            method: 'GET',
            data: {
              "userId": userId, "personName": personName, "gender": gender,
              "contactNumber": contactNumber, "address": address, "houseNumber": houseNumber,
              "city": city
            },
            header: {},
            success: function (res) {
              wx.hideLoading()
              if (res.data.code == '0000') {
                wx.redirectTo({ url: buildUrl() })
              }
            },
            fail: function () {
              wx.hideLoading()
              wx.showToast({ title: '网络异常', icon: 'none' })
            }
          })
        }
      }
    } else {
      wx.redirectTo({ url: '../login/login' })
    }
  },
  check: function (personName, gender, contactNumber, address, houseNumber, city) {
    var that = this;
    if (personName == "") { that.setData({ tip: '联系人不能为空！' }); return false }
    if (gender == '') { that.setData({ tip: '性别不能为空！' }); return false }
    if (contactNumber == '') { that.setData({ tip: '手机号不能为空！' }); return false }
    var myreg = /^[1][3, 4, 5, 7, 8][0-9]{9}$/;
    if (!myreg.test(contactNumber)) { that.setData({ tip: '手机号不合法！' }); return false; }
    if (address == '') { that.setData({ tip: '收货地址不能为空！' }); return false }
    if (houseNumber == '') { that.setData({ tip: '门牌号不能为空！' }); return false }
    if (city == '') { that.setData({ tip: '所在城市不能为空！' }); return false }
    that.setData({ tip: '' });
    return true
  },
  chooseLocation: function () {
    var that = this;
    wx.chooseLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({ address: res.name })
      }
    })
  },
  bindRegionChange: function (e) {
    this.setData({ region: e.detail.value })
  }
})
