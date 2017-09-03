// pages/scanbuy/scanbuy.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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

    wx.setNavigationBarTitle({
      title: '还充电宝'
    });    
  },
  scanBuy: function () {
    let self = this;
    const uid = app.globalData.unionid;
    const openid = app.globalData.openid;
    wx.scanCode({
      success: function(res) {
        console.log(res);
        let result = res.result;
        wx.request({
          url: `https://www.byjiedian.com/index.php/byjie/buy?shopid=${result}&uid=${uid}&from=v`,
          success: function(d) {
            console.log(d); 
            // if()
            if(data.errcode === 0) {
              wx.showToast({
                title: '恭喜您购买充电宝成功！',
                icon: 'success',
                duration: 3000,
                mask: true,
                complete: function() {
                  setTimeout(()=>{
                    wx.navigateTo({
                      url: `../borrowlist/borrowlist`
                    })                    
                  }, 3000)
                }
              })             
            } else {
              wx.showToast({
                title: data.msg,
                icon: 'error',
                duration: 3000,
                mask: true
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