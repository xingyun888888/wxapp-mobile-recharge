// usercenter.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    lending: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('欢迎进入用户个人中心')
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
    // this.updateInfo()
    console.log("Enter page usercenter");
    this.updateInfo();
  },

  onShow() {
    console.log("用户中心显示")
    this.updateInfo();
    console.log("触发了onshow");
  },

  updateInfo() {
    var self = this
    console.log("更新用户信息")
    var amount = app.globalData.userInfo && app.globalData.userInfo.amount || -1;
    console.log(amount, "余额")
   if(app.globalData.userInfo && app.globalData.unionid) {
      console.log("You have user info already");
      //重新拉取amount
      app.getUserInfoByApi(()=>{
          self.setData({
              user: app.globalData.userInfo
          });         
      })

      var self = this;
      const uid = app.globalData.unionid;
      const openid = app.globalData.openid;
      console.log("查询是否借充电宝");
      wx.request({
        url: `https://www.byjiedian.com/index.php/byjie/scan_lending?uid=${uid}&from=v`,
        success: function(res) {
          if(res.data.errcode === 0) {
            self.setData({
              lending: res.data.data.status
            })
          }
        }
      })
    } else {
      setTimeout(()=>{
        this.updateInfo();
      }, 100);
    }
  },



  call: function() {
    wx.makePhoneCall({
      phoneNumber: '4000805985', //此号码并非真实电话号码，仅用于测试
      success:function(){
        console.log("拨打电话成功！")
      },
      fail:function(){
        console.log("拨打电话失败！")
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
    if(app.globalData.openid) {
      console.log("进入个人中心，刷新用户信息");
      app.getUserInfoByApi(()=>{
          console.log("用户信息已更新！！！");
          this.setData({
              user: app.globalData.userInfo
          });
      });
    }
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