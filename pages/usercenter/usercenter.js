// usercenter.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
    console.log("Enter page usercenter");
    //app中数据更新后，执行此函数
    if(app.globalData.userInfo.already) {
        this.setData({
            user: app.globalData.userInfo
        });    
    } else {
      app.userinfoChanged(() => {
          this.setData({
              user: app.globalData.userInfo
          });
      });      
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