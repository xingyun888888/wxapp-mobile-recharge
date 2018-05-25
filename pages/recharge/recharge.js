// pages/recharge/recharge.js
const app = getApp()
// console.log(app.globalData.userInfo)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo: '',
    payDisabled: false,
    action: null,
    shopid: '',
    needpay: 0.00,
    showRechargeProtocol: false,
    showUseProtocol: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("recharge");
    this.action = options.action
    this.shopid = options.shopid

    console.log(this.action, this.shopid)
    if(!app.globalData.openid) {
      wx.navigateBack({
        delta: 1
      });
      return false;
    }

    wx.setNavigationBarTitle({
      title: '充值押金'
    });
    console.log(app.globalData.userInfo.nickName)
    //获取余额
    if(app.globalData.userInfo.nickName) {
      // this.data.amount = app.globalData.userInfo.amount;
      // console.log(this.data.amount)
      this.setPay()
    } else {
      app.userinfoChanged(() => {
         // this.data.amount = app.globalData.userInfo.amount;
         this.setPay()
      });
    }
  },

  setPay() {
    var amount = app.globalData.userInfo.amount;
    var needpay = 0.00;
    if(amount < 80.00) {
      needpay = 100.00 - amount;
    } else {
      needpay = 0.00;
    }
    this.setData({
      needpay: needpay.toFixed(2)
    })
  },

  openUseProtocol() {
    this.setData({
      showUseProtocol: true
    })
  },

  closeUseProtocol() {
    console.log("关闭充值协议");
    this.setData({
      showUseProtocol: false
    })
  },

  openRechargeProtocol() {
    this.setData({
      showRechargeProtocol: true
    })
  },

  closeRechargeProtocol() {
    console.log("关闭充值协议");
    this.setData({
      showRechargeProtocol: false
    })
  },

  //https://www.byjiedian.com/index.php/byjie/get_pay
  //https://www.byjiedian.com/index.php/byjie/check_pay
  recharge: function () {
    this.setData({
      payDisabled: true
    });
    if(this.data.needpay < .001) {
      wx.showModal({
        title: "您暂时不需要充值",
        content: "当您押金不足80元时，需补存至100元押金",
        confirmText: "我了解了",
        showCancel: false
      })
      this.setData({
        payDisabled: false
      });
      return false;
    }

    const self = this
    const uid = app.globalData.unionid;
    const openid = app.globalData.openid;
    console.log(uid, "uid in recharge")
    wx.request({
      url: `https://www.byjiedian.com/index.php/byjie/get_pay?uid=${uid}&openid=${openid}&from=v`,
      header: {
        'Content-type': 'application/json'
      },
      success: function (d) {
        console.log(d)
        var res = d.data;
        if(res.jsApiParameters) {
          self.setData({
            orderNo: res.data.out_trade_no
          })
          console.log(res.jsApiParameters, res.jsApiParameters.timeStamp)
          wx.requestPayment({
            timeStamp: res.jsApiParameters.timeStamp,
            nonceStr: res.jsApiParameters.nonceStr,
            package: res.jsApiParameters.package,
            signType: res.jsApiParameters.signType,
            paySign: res.jsApiParameters.paySign,
            success: function(ret){
              console.log("requestPayment success", ret);
              self.checkPay(res.data.out_trade_no, openid, uid)
            },
            fail:function(res){
              self.setData({
                payDisabled: false
              });
              console.log("requestPayment failed", JSON.stringify(res));
            }
          })          
        }
      }
    })
  },
  checkPay (orderNo, openid, uid) {
    var self = this;
    wx.request({
      url: 'https://www.byjiedian.com/index.php/byjie/check_pay?order_no='+orderNo+"&from=v&openid=" + openid + "&uid=" + uid,
      success: function (res) {
        console.log(res, "支付成功回调");
        var data = res.data;
        if(data.errcode == 0) {
           app.globalData.userInfo.amount = 100;
            self.setData({
              needpay: 0.00
            });             

            if(!self.action) {
              wx.showModal({
                title: "恭喜您充值成功",
                content: "您可以借/买充电宝了",
                confirmText: "确定",
                showCancel: false
              })
            } else if(self.action === 'borrow') {
              self.scanBorrowNow(self.shopid);
            } else  if(self.action === 'buy') {
              self.scanBuyNow(self.shopid)
            }
        } else {
            //显示出错原因
            wx.showModal({
              title: "充值失败",
              content: data.msg || "网络错误，请稍候再试",
              confirmText: "确定",
              showCancel: false
            })
        }
      },
      complete: function() {
        self.setData({
          payDisabled: false
        });
      }
    })
  },
  scanBorrowNow: function (shopid, action) {
    let self = this;
    const uid = app.globalData.unionid;
    const openid = app.globalData.openid;
    console.log("即将借充电宝:" + shopid);
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
        wx.showLoading({
          title: '正在借充电宝...'
        });
        wx.request({
          url: `https://www.byjiedian.com/index.php/byjie/borrow?shopid=${shopid}&uid=${uid}&from=v`,
          success: function(d) {
            let data = d.data;
            console.log(data);
            wx.hideLoading();
            wx.navigateBack();

            if(data.retCode === 0) {
              let fee = {
                "1": {
                  per: 1,
                  most: 8,
                },
                "2": {
                  per: 2,
                  most: 14
                },
                "3": {
                  per: 3,
                  most: 18,
                },
                "4": {
                  per: 5,
                  most: 25
                }
              }
              let rule = fee[data.rule]
              let str = "请在槽位" + data.slot_id + "取走充电宝。该充电宝免费使用时长为" + data.free_time + "分钟，之后每小时收费" + rule.per + "元，每天最多收费" + rule.most + "元。"

              wx.showModal({
                title: '恭喜您成功借到充电宝',
                content: str + "请在使用完毕后及时归还充电宝，系统将停止计费",
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
  },
  scanBuyNow: function (shopid, action) {
    let self = this;
    const uid = app.globalData.unionid;
    const openid = app.globalData.openid;

    //查询用户当前是否在借的状态
    wx.request({
      url: `https://www.byjiedian.com/index.php/byjie/scan_lending?uid=${uid}&from=v`,
      success: function(res) {
        if(res.data.errcode === 0 && res.data.data.status === true) {
          wx.showModal({
            title: '您有尚未归还的充电宝',
            content: '请先归还充电宝后，重新扫码买充电宝',
            confirmText: "我了解了",
            showCancel: false
          })
          return false;
        }
        wx.showLoading({
          title: '正在买充电宝...'
        });
        wx.request({
          url: `https://www.byjiedian.com/index.php/byjie/buy_imei?shopid=${shopid}&uid=${uid}&from=v`,
          success: function(d) {
            console.log(d); 
            let data = d.data
            wx.hideLoading();
            wx.navigateBack();

            if(data.errcode === 0 || data.retCode === 0) {
              wx.showModal({
                title: '恭喜您购买成功',
                content: '请在槽位' + data.slot_id + '取走充电宝。系统已从您余额中扣除80元',
                confirmText: "我了解了",
                showCancel: false
              });
              //更新余额           
              app.updateInfo();
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