// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lat: '',
    lng: '',
    shopList: []
  },
    // 获取周边网点 
  getNearShop (lat, lng) {
    const self = this
    wx.request({
      url: 'https://byjiedian.com/index.php/byjie/get_posi',
      data: {
        lat,
        lng
      },
      success (res) {
        if (res.statusCode === 200) {
          // const shopList = res.data.map((item) => {
          //   return {
          //     id: 1,
          //     latitude: item.lat,
          //     longitude: item.lng,
          //     iconPath: '/assets/dingwei.png',
          //     width: 24,
          //     height: 27
          //   }
          // })
          self.setData({
            shopList: res.data
          })
        }
      }
    })
  },
  // 选择位置
  chooseLocation () {
    const self = this
    wx.chooseLocation({
      success (res) {
        self.setData({
          lat: res.latitude,
          lng: res.longitude
        })
      }
    })
  },
  goDetail (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../shopdetail/shopdetail?id=${id}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this
    self.setData({
      lat: options.lat,
      lng: options.lng
    })
    self.getNearShop(options.lat, options.lng)
    wx.setNavigationBarTitle({
      title: '网点列表'
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