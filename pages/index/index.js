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
    mapHeight: '',
    shopList: [],
    markers: [],
    controls: [],
    scale: 15
  },
  // 获取周边网点 
  getNearShop (lat, lng) {
    const self = this
    wx.setNavigationBarTitle({
      title: '搜索附近网点...'
    })
    wx.showNavigationBarLoading()
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
          wx.setNavigationBarTitle({
            title: '附近网点'
          })
          wx.hideNavigationBarLoading()
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
    const mapHeight = self.data.mapHeight
    const intval = (wWidth - 242) / 3
    const scanBorrow = {
      id: 1,
      position: {
        left: intval,
        top: mapHeight - 52 - 30,
        width: 121 * 1.2,
        height: 52 * 1.2
      },
      iconPath: '/assets/scan-borrow.png',
      clickable: true
    }
    const scanBuy = {
      id: 2,
      position: {
        left: intval * 3/2 + 121,
        top: mapHeight - 52 - 30,
        width: 121 * 1.2,
        height: 52 * 1.2
      },
      iconPath: '/assets/scan-buy.png',
      clickable: true
    }
    const origin = {
      id: 3,
      position: {
        left: wWidth - 36 - 30,
        top: mapHeight - 120,
        width: 36,
        height: 36
      },
      iconPath: '/assets/origin.png',
      clickable: true
    }
    const plus = {
      id: 4,
      position: {
        left: wWidth - 30 - 32,
        top: mapHeight - 159 - 30,
        width: 30,
        height: 30
      },
      iconPath: '/assets/mapplus.png',
      clickable: true
    }
    const minus = {
      id: 5,
      position: {
        left: wWidth - 30 - 32,
        top: mapHeight - 130 - 30,
        width: 30,
        height: 30
      },
      iconPath: '/assets/mapminus.png',
      clickable: true
    }
    const controls = [scanBorrow, scanBuy, origin]
    self.setData({
      controls: controls
    })
  },
  // 点击控件
  clickControl (e) {
    const self =  this
    if (e.controlId === 1) {
      wx.scanCode()
    }
    if (e.controlId === 2) {
      wx.scanCode()
    }
    if (e.controlId === 3) {
      self.mapCtx.moveToLocation()
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
    }
    //plus
    // if (e.controlId === 4) {
    //   const scale = self.data.scale
    //   if (scale < 18) {
    //     self.setData({
    //       scale: scale + 1
    //     })
    //   } 
    // }
    //minus
    // if (e.controlId === 5) {
    //   const scale = self.data.scale
    //   if (scale > 5) {
    //     self.setData({
    //       scale: scale - 1
    //     })
    //   }
    // }
  },
  // 点击标注
  clickMarker (e) {
    const self = this
    const id = e.markerId
    const shopInfo = self.data.shopList.find(shop => shop.id = id)
    wx.showActionSheet({
      itemList: [shopInfo.name],
      success (res) {
        if (res.tapIndex === 0) {
          wx.navigateTo({
            url: `/pages/shopdetail/shopdetail?id=${id}`
          })
        }
      }
    })
  },
  regionchange (e) {
    const self = this
    if (e.type === 'end') {
      self.mapCtx.getCenterLocation({
        success (res) {
          self.getNearShop(res.latitude, res.longitude)
        }
      })
    }
  },
  returnOrigin () {
    return new Promise((resolve, reject) => {
      const deferred = [resolve, reject]

    })
  },
  // clickMap (e) {
  //   if (e === 'end') {
  //     console.log('草你妈')
  //   }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this
    self.mapCtx = wx.createMapContext('map')
    
    wx.setNavigationBarTitle({
      title: '附近网点'
    })
   
    if (app.globalData.systemInfo) {
      self.setData({
        systemInfo: app.globalData.systemInfo,
        mapHeight: app.globalData.systemInfo.windowHeight - 48
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