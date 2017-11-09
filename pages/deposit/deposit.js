// deposit.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount: 0,
    balance: 100
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!app.globalData.openid) {
      wx.navigateBack({
        delta: 1
      });
      return false;
    }
    this.setData({
      amount: app.globalData.userInfo.amount,
      balance: app.globalData.userInfo.amount
    })
  },

  getTime(time) {
    time = time * 1000 || Date.now();
    let now = new Date(time);
    let year = now.getFullYear(),
        month = ('00' + (now.getMonth() + 1)).slice(-2),
        day = ('00' + (now.getDate())).slice(-2),
        hour =  ('00' + (now.getHours())).slice(-2),
        minute =  ('00' + (now.getMinutes())).slice(-2),
        second =  ('00' + (now.getSeconds())).slice(-2);
    return year + '年' + month + '月' + day + '日' + ' ' + [hour,minute, second].join(':');
  },

  doDeposit: function() {
    var self = this;
    const uid = app.globalData.unionid;
    const openid = app.globalData.openid;
    const amount = app.globalData.userInfo.amount;
    // const amount = 71;

    if(amount < .001) {
      wx.showModal({
        title: "余额不足",
        content: "您没有足够的余额供提现",
        confirmText: "我了解了",
        showCancel: false
      })
      return false;
    }

    //查询是否有未归还的充电宝
    wx.request({
      url: `https://www.byjiedian.com/index.php/byjie/scan_lending?uid=${uid}&from=v`,
      success: function(res) {
        // console.log(res,"记录查询")
        // if(res.data.errcode === 0 && res.data.data.status === true) {
        //   wx.showModal({
        //     title: '您有尚未归还的充电宝',
        //     content: '请先归还充电宝后再提现',
        //     confirmText: "我了解了",
        //     showCancel: false
        //   })
        //   return false;
        // }
        wx.showModal({
          title: "您确定要提现吗？",
          content: "提现后如需继续使用BY街电服务请重新充值押金",
          confirmText: "提现",
          success: function(res) {
            if(res.confirm) {
              //确定提现
              wx.request({
                url: `https://www.byjiedian.com/index.php/byjie/refund?uid=${uid}&openid=${openid}&from=v&amount=${amount}`,
                header: {
                  'Content-type': 'application/json'
                },
                success: function(res) {
                  console.log(res);
                  var data = res.data;
                  console.log(data)
                  if(data.errcode == 0) {
                    self.setData({
                      amount: 0,
                      balance: 0
                    });
                    app.globalData.userInfo.amount = 0;
                    //进入提现结果页
                    wx.navigateTo({
                      url: '/pages/depositresult/depositresult?amount=' + amount + '&orderno=' + data.data.out_trade_no + '&time=' + self.getTime(res.data.create_time)
                    }) 
                  } else {
                    //显示出错原因
                    wx.showModal({
                      title: "提现失败",
                      content: data.msg || "网络错误，请稍候再试",
                      confirmText: "确定",
                      showCancel: false
                    })
                  }
                }
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