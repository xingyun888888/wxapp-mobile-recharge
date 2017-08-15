//app.js
<<<<<<< HEAD
//import config from './config.js'
=======
// import config from './config.js'
>>>>>>> e4ac0d461bb8494f102be7f50fbb1f4817b22ace
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    this.getUserInfo()
    this.getSystemInfo()
    this.getUserInfoByApi();
    // this.checkLogin()
  },
  postCode () {
    const self = this
    wx.login({
      success: function (res) {
        var code = res.code
        console.log(code, "code in app.js")
        wx.request({
          url: `https://byjiedian.com/index.php/byjie/get_openid?code=${code}&from=v`,
        })
      }
    })
  },
  getUserInfoByApi() {
    wx.request({
      url: 'https://www.byjiedian.com/index.php/byjie/info',
      data: {},
      header: {
        'Content-type': 'application/json'
      },
      success: function (res) {
        console.log(res, "user info by api in app.js");
        // self.globalData.openid = res.openid;
      }
    })
  },
  getUserInfo:function(cb){
    console.log('==================');
    var self = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (r) {
          wx.getUserInfo({
            success: function (res) {
              self.getLogin({
                code: r.code,
                // iv: res.iv,
                // encryptedData: encodeURIComponent(res.encryptedData)
              })
              self.globalData.userInfo = res.userInfo
              console.log(res.userInfo, "userinfo in app.js");
              typeof cb == "function" && cb(this.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  getLogin (param) {
    console.log(param)
    const self = this
    wx.request({
      url: 'https://www.byjiedian.com/index.php/byjie/wx_login',
      data: param,
      header: {
        'Content-type': 'application/json'
      },
      success: function (res) {
        console.log(res, "login info in app.js");
        self.globalData.openid = res.data.data.openid;
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
    rootUrl: 'https://www.byjiedian.com/index.php/byjie/',
    userInfo:null,
    systemInfo: null,
    shopList: [],
    openid: ''
  }
})