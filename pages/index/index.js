// pages/map/map.js
const app = getApp()
import API from '../../api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lng: '',
    lat: '',
    systemInfo: {},
    shopList: [],
    markers: [],
    controls: []
  },
  // 获取周边网点 
  getNearShop (lat, lng) {
    const self = this
    wx.request({
      url: 'https://byjiedian.com/index.php?m=byjie&a=get_posi',
      data: {
        lat,
        lng
      },
      success (res) {
        if (res.statusCode === 200) {
          const shopList = res.data
          const markers = res.data.map((item) => {
            return {
              id: item.id,
              latitude: item.lat,
              longitude: item.lng,
              iconPath: '/assets/dingwei.png',
              width: 24,
              height: 27
            }
          })
          self.setData({
            markers: markers,
            shopList: shopList
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
  // 跳转页面
  navigateTo (page) {
    const self = this
    wx.navigateTo({
      url: `../list/list?lat=${self.data.lat}&lng=${self.data.lng}`
    })
  },
  // 初始化控件
  initControls () {
    const self = this
    const wWidth = self.data.systemInfo.windowWidth
    const intval = (wWidth - 242) / 3
    const scanBorrow = {
      id: 1,
      position: {
        left: intval,
        top: 500 - 20,
        width: 121,
        height: 52
      },
      iconPath: '/assets/scan-borrow.png',
      clickable: true
    }
    const scanBuy = {
      id: 2,
      position: {
        left: intval * 3/2 + 121,
        top: 500 - 20,
        width: 121,
        height: 52
      },
      iconPath: '/assets/scan-buy.png',
      clickable: true
    }
    const controls = [scanBorrow, scanBuy]
    self.setData({
      controls: controls
    })
  },
  // 点击控件
  clickControl (e) {
    if (e.controlId === 1) {
      wx.scanCode()
    }
    if (e.controlId === 2) {
      wx.scanCode()
    }
  },
  // 点击标注
  clickMarker (e) {
    const self = this
    const id = e.markerId
    const shopInfo = self.data.shopList.find(shop => shop.id = id)
    wx.showActionSheet({
      itemList: [shopInfo.name],
      success (res) {
        wx.navigateTo({
          url: `/pages/shopdetail/shopdetail?id=${id}`
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
    self.initControls()
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        self.setData({
          lat: res.latitude,
          lng: res.longitude,
        })
        
        self.getNearShop(latitude, longitude)
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