// pages/map/map.js
const app = getApp()
import API from '../../api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lon: '',
    lat: '',
    systemInfo: {},
    markers: []
  },
  // 获取周边网点 
  getNearShop (lat, lng) {
    return API.getNearShop(lat, lng)
  },
  // 选择位置
  chooseLocation () {
    const self = this
    wx.chooseLocation({
      success (res) {
        self.setData({
          lat: res.latitude,
          lon: res.longitude
        })
      }
    })
  },
  click () {
    const self = this
    wx.chooseLocation({
      success (res) {
        console.log(res)
        self.setData({
          lat: res.latitude,
          lon: res.longitude,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this
   
    wx.setNavigationBarTitle({
      title: '附近网点'
    })
   
    if (app.globalData.systemInfo) {
      self.setData({
        systemInfo: app.globalData.systemInfo
      })
    } 

    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        self.setData({
          lat: res.latitude,
          lon: res.longitude,
          // markers: [{
          //   id: 1,
          //   latitude: res.latitude,
          //   longitude: res.longitude,
          //   iconPath: '/assets/logo.png',
          //   width: 24,
          //   height: 27
          // }]
        })
        self.getNearShop(latitude, longitude).then((list) => {
          console.log(list)
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