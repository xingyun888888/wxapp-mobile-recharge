//app.js
//import config from './config.js'

App({
  onLaunch: function () {
    console.log("触发onlaunch")
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
  getUserInfoByApi(callback) {
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
        self.globalData.userInfo = self.globalData.userInfo || {}
        // self.globalData.openid = res.openid;
        self.globalData.userInfo.already = true;
        self.globalData.userInfo.amount = data.amount;
        // console.log(self.globalData.userinfoCallback)
        //数据更新
        // for(let i = 0, callbackList = self.globalData.userinfoCallback, len = self.globalData.userinfoCallback.length; i < len; i++) {
        //   (typeof callbackList[i] === 'function') && callbackList[i]();
        // }
        callback && callback();
        // console.log(self.globalData.userinfoCallback.length)
      }
    })
  },

  userinfoChanged(callback) {
    // this.globalData.userinfoCallback.push(callback);
  },

  getWxUserInfo(code, cb) {
    let self = this
    wx.getUserInfo({
      success: function (res) {
        console.log("Success");
        self.globalData.userInfo = {
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName,
          amount: 0.00,
          already: false
        }
        console.log("根据code登录")
        self.getLogin({
          code: code,
          // from: "v",
          cb: cb
          // iv: res.iv,
          // encryptedData: encodeURIComponent(res.encryptedData)
        })
        console.log(res.userInfo, self.globalData.userInfo, "userinfo in app.js");
        // console.log(res, "res in wx login");
        // typeof cb == "function" && cb(this.globalData.userInfo)
      },
      fail: function() {
        console.error("Get login info error!");
        wx.openSetting({
          success: function() {
            self.getWxUserInfo(code, cb);
          }
        })  
      }
    })    
  },

  getUserInfo:function(cb){
    console.log('==========全局拉取用户信息========');
    var self = this

    console.log("调用微信登录!!!")
    //调用登录接口
    wx.login({
      success: function (r) {
        // console.log(r, "wx login return")
        console.log("从后台拉取头像信息123")
        self.getWxUserInfo(r.code, cb)
      },
      failed: function() {
        console.log("error to login")
      }
    })
  },
  getLogin (param) {
    console.log("全局调用login")
    const self = this
    wx.request({
      url: 'https://www.byjiedian.com/index.php/byjie/wx_login?from=v',
      data: {
        code: param.code,
      },
      header: {
        'Content-type': 'application/json'
      },
      success: function (res) {
        console.log(res, "login info in app.js");
        self.globalData.openid = res.data.data.openid;
        self.globalData.unionid = res.data.data.unionid;
        console.log("成功获取unionid");
        if(res.data.data.unionid) {
          self.getUserInfoByApi(param.cb);
        } else {
          console.log("获取unionid失败, 重新获取code");
          self.getUserInfo();
        }
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
    scanBorrow: function () {
    let self = this;
    const uid = this.globalData.unionid;
    const openid = this.globalData.openid;
    wx.scanCode({
      success: function(res) {
        console.log(res);
        let result = encodeURIComponent(res.result);
        if(app.globalData.userInfo.amount < 80.0) {
            wx.showModal({
              title: "您的余额不足",
              content: "请先充值后再借/买充电宝",
              confirmText: "确定",
              showCancel: true
            })
            return false;
        } else {
          //查询用户当前是否在借的状态
          wx.request({
            url: `https://www.byjiedian.com/index.php/byjie/scan_lending?uid=${uid}&from=v`,
            success: function(res) {
              if(res.data.errcode === 0 && res.data.data.status === true) {
                wx.showModal({
                  title: '您有尚未归还的充电宝',
                  content: '请先归还充电宝后，重新扫码借充电宝',
                  confirmText: "我了解了",
                  showCancel: false
                })
                return false;
              }
              wx.request({
                url: `https://www.byjiedian.com/index.php/byjie/borrow?shopid=${result}&uid=${uid}&from=v`,
                success: function(d) {
                  let data = d.data;
                  console.log(data);
                  if(data.retCode === 0) {
                    wx.showModal({
                      title: '恭喜您成功借到充电宝',
                      content: "请在使用完毕后及时归还充电宝，系统将停止计费",
                      confirmText: "我了解了",
                      showCancel: false
                    })  
            
                  } else {
                   wx.showModal({
                      title: '借充电宝失败',
                      content: data.msg || "网络错误，请稍后再试",
                      confirmText: "我了解了",
                      showCancel: false
                    })  
                         
                  }
                } 
              }) 
            }
          })         
        }
      }
    })
  },
  scanBuy: function () {
    let self = this;
    const uid = app.globalData.unionid;
    const openid = app.globalData.openid;
    wx.scanCode({
      success: function(res) {
        console.log(res);
        let result = encodeURIComponent(res.result);

        if(app.globalData.userInfo.amount < 80.0) {
            wx.showModal({
              title: "您的余额不足",
              content: "请先充值后再借/买充电宝",
              confirmText: "确定",
              showCancel: true
            })         
        } else {
          //查询用户当前是否在借的状态
          wx.request({
            url: `https://www.byjiedian.com/index.php/byjie/scan_lending?uid=${uid}&from=v`,
            success: function(res) {
              if(res.data.errcode === 0 && res.data.data.status === true) {
                wx.showModal({
                  title: '您有尚未归还的充电宝',
                  content: '请先归还充电宝后，重新扫码借充电宝',
                  confirmText: "我了解了",
                  showCancel: false
                })
                return false;
              }
              wx.request({
                url: `https://www.byjiedian.com/index.php/byjie/buy_imei?shopid=${result}&uid=${uid}&from=v`,
                success: function(d) {
                  console.log(d); 
                  let data = d.data
                  // if()
                  if(data.errcode === 0 || data.retCode === 0) {
                    wx.showModal({
                      title: '恭喜您购买成功',
                      content: '您已成功购得BY街电充电宝一个，系统已从您余额中扣除80元',
                      confirmText: "我了解了",
                      showCancel: false
                    });
                    //更新余额           
                    self.updateInfo();
                  } else {
                    wx.showModal({
                      title: '购买失败',
                      content: data.msg || "网络错误，请稍后再试",
                      confirmText: "我了解了",
                      showCancel: false
                    })  
                  }
                } 
              }) 
            }
          })          
        }
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
    // userinfoCallback: [],
    userInfo:null,
    systemInfo: null,
    shopList: [],
    openid: '',
    unionid: ''
  }
})