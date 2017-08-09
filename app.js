//app.js
// import config from './config.js'
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    this.getUserInfo()
    this.getSystemInfo()
    // this.checkLogin()
  },
  postCode () {
    const self = this
    wx.login({
      success: function (res) {
        console.log(res)
        var code = res.code
        wx.request({
          url: `https://byjiedian.com/index.php/byjie/get_openid?code=${code}&from=v`,
        })
      }
    })
  },
  getUserInfo:function(cb){
    var self = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              self.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  checkLogin () {
    const self = this
    try {
      var openid = wx.getStorageSync('openid')
      if (openid) {
        self.globalData.openid = openid
      } else {
        self.getLogin()
      }
    } catch (e) {
      self.getLogin()
    }
  },
  getLogin () {
    const self = this
    wx.login({
      success: function (res) {
        var code = res.code
        console.log(res)
        // console.log(code)
        wx.request({
          url: `https://byjiedian.com/index.php/byjie/get_openid?code=${code}&from=v`,
          success: function (data) {
            const openid = data.data.data
            try {
              self.globalData.openid = openid
              wx.setStorageSync('openid', openid)
            } catch (e) {    
            }
          }
        })
      }
    })
  },
  getSystemInfo () {
    var self = this
    wx.getSystemInfo({
      success (res) {
        self.globalData.systemInfo = res
      }
    })
  },
  getShopList () {
    const self = this
    wx.request({
      url: 'https://byjiedian.com/index.php?m=byjie&a=get_posi',
      data: {
        lat,
        lng
      },
      success (res) {
        if (res.statusCode === 200) {
          const shopList = res.data.map((item) => {
            return {
              id: 1,
              latitude: item.lat,
              longitude: item.lng,
              iconPath: '/assets/dingwei.png',
              width: 24,
              height: 27
            }
          })
          self.globalData.shopList = shopList
        }
      }
    })
  },
  globalData:{
    userInfo:null,
    systemInfo: null,
    shopList: [],
    openid: ''
  }
})