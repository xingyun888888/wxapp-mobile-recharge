//app.js
//import config from './config.js'

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    this.getUserInfo();
    this.getSystemInfo()
  },
  // postCode () {
  //   const self = this
  //   wx.login({
  //     success: function (res) {
  //       var code = res.code
  //       console.log(code, "code in app.js")
  //       wx.request({
  //         url: `https://byjiedian.com/index.php/byjie/get_openid?code=${code}&from=v`,
  //       })
  //     }
  //   })
  // },
  getUserInfoByApi() {
    const self = this
    wx.request({
      url: 'https://www.byjiedian.com/index.php/byjie/info?from=v&uid=' + this.globalData.unionid,
      data: {},
      header: {
        'Content-type': 'application/json'
      },
      success: function (res) {
        console.log(res, "user info by api in app.js");
        let data = res.data.data;
        // self.globalData.openid = res.openid;
        self.globalData.userInfo.already = true;
        self.globalData.userInfo.amount = data.amount;
        // console.log(self.globalData.userinfoCallback)
        //数据更新
        for(let i = 0, callbackList = self.globalData.userinfoCallback, len = self.globalData.userinfoCallback.length; i < len; i++) {
          (typeof callbackList[i] === 'function') && callbackList[i]();
        }
      }
    })
  },

  userinfoChanged(callback) {
    this.globalData.userinfoCallback.push(callback);
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
          // console.log(r, "wx login return")
          wx.getUserInfo({
            success: function (res) {
              self.globalData.userInfo = {
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName,
                amount: 0,
                already: false
              }
              self.getLogin({
                code: r.code,
                from: "v"
                // iv: res.iv,
                // encryptedData: encodeURIComponent(res.encryptedData)
              })
              console.log(res.userInfo, self.globalData.userInfo, "userinfo in app.js");
              // console.log(res, "res in wx login");
              typeof cb == "function" && cb(this.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  getLogin (param) {
    const self = this
    wx.request({
      url: 'https://www.byjiedian.com/index.php/byjie/wx_login?from=v',
      data: param,
      header: {
        'Content-type': 'application/json'
      },
      success: function (res) {
        console.log(res, "login info in app.js");
        self.globalData.openid = res.data.data.openid;
        self.globalData.unionid = res.data.data.unionid;
        self.getUserInfoByApi();
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
      url: 'https://byjiedian.com/index.php?m=byjie&a=get_posi&from=v',
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
    userinfoCallback: [],
    userInfo:null,
    systemInfo: null,
    shopList: [],
    openid: '',
    unionid: ''
  }
})