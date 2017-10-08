// pages/scanborrow/scanborrow.js
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
      title: '借充电宝'
    });  
  },
  scanBorrow: function () {
    let self = this;
    const uid = app.globalData.unionid;
    const openid = app.globalData.openid;
    wx.scanCode({
      success: function(res) {
        console.log(res);
        let result = encodeURIComponent(res.result);

        if(app.globalData.userInfo.amount < 80.0) {
          wx.navigateTo({
            url: '/pages/recharge/recharge'
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
                url: `https://www.byjiedian.com/index.php/byjie/borrow?shopid=${result}&uid=${uid}&from=v`,
                success: function(d) {
                  let data = d.data;
                  console.log(data);
                  if(data.retCode === 0 || data.errcode === 0) {
                    wx.showToast({
                      title: '恭喜您借充电宝成功！',
                      icon: 'success',
                      duration: 3000,
                      mask: true,
                      complete: function() {
                        
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

        }
      }
    })
  },  /**
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