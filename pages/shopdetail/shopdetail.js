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
      url: 'https://byjiedian.com/index.php?m=byjie&a=get_shop&',
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