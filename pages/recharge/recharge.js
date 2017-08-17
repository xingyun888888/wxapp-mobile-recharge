// pages/recharge/recharge.js
const app = getApp()
// console.log(app.globalData.userInfo)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo: '',
    needpay: 0.00
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("recharge");
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
    var needpay = 0;
    if(amount < 80) {
      needpay = 100 - amount;
    } else {
      needpay = 0;
    }
    this.setData({
      needpay: needpay
    })
  },

  //https://www.byjiedian.com/index.php/byjie/get_pay
  //https://www.byjiedian.com/index.php/byjie/check_pay
  recharge: function () {
    const self = this
    const uid = app.globalData.unionid;
    console.log(uid, "uid in recharge")
    wx.request({
      url: `https://www.byjiedian.com/index.php/byjie/get_pay?uid=${uid}&from=v`,
      header: {
        'Content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if(res.jsApiParameters) {
          self.setData({
            orderNo: res.data.out_trade_no
          })
          wx.requestPayment({
            timestamp: res.jsApiParameters.timeStamp,
            nonceStr: res.jsApiParameters.nonceStr,
            package: res.jsApiParameters.package,
            signType: res.jsApiParameters.signType,
            paySign: res.jsApiParameters.paySign,
            success: function(res){
              self.checkPay(res.data.out_trade_no)
            },
            fail:function(res){
            }
          })          
        }

      }
    })
  },
  checkPay (orderNo) {
    wx.request({
      url: 'https://www.byjiedian.com/index.php/byjie/check_pay/'+orderNo,
      success: function () {
        
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