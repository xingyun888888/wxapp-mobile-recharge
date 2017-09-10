// pages/shopdetail/shopdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopInfo: {}
  },
  scanBorrow () {
    wx.scanCode({
      success () {}
    })
  },
  // 拨打电话
  makePhoneCall () {
    const self = this
    wx.makePhoneCall({
      phoneNumber: self.data.shopInfo.tel
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this
    wx.setNavigationBarTitle({
      title: '商铺详情'
    })
    wx.request({
      url: 'https://byjiedian.com/index.php/byjie/get_shop',
      data: {
        id: options.id
      },
      success (res) {
        self.setData({
          shopInfo: res.data
        })
      }
    })
  },

  goThere() {
    let shopInfo = this.data.shopInfo;
    let lat = shopInfo.lat,
        lng = shopInfo.lng;
    console.log("即将打开位置", lat, lng);
    console.log(parseFloat(lat), parseFloat(lng),shopInfo.name, shopInfo.address)
    wx.openLocation({
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      scale: 28,
      name: shopInfo.name,
      address: shopInfo.address,
      success: function(res) {
        console.log("您已成功打开位置", res);
      },
      fail: function(err) {
        console.log(err,"打开位置失败")
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})