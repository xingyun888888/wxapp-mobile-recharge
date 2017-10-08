// pages/recharge/recharge.js
const app = getApp()
// console.log(app.globalData.userInfo)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo: '',
    needpay: 0.00,
    showRechargeProtocol: false,
    showUseProtocol: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("recharge");
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
      needpay: needpay
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
    if(this.data.needpay < .001) {
      wx.showModal({
        title: "您暂时不需要充值",
        content: "当您押金不足80元时，需补存至100元押金",
        confirmText: "我了解了",
        showCancel: false
      })
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
            wx.showToast({
              title: "恭喜您充值成功！",
              duration: 2000
            })
          self.setData({
            needpay: 0.00
          });          
        } else {
            //显示出错原因
            wx.showToast({
              title: data.msg,
              duration: 2000
            })
        }
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