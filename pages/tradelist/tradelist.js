// usercenter.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      list: [], //充值记录
      recharge: '', //充值总额
      take: '' //提现金额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("进入交易记录页", this.data.list);
    wx.setNavigationBarTitle({
      title: '交易记录'
    });
    this.getTradeList();
  },

  getTradeList() {
    // let recharge = 20,
    //     take = 1,
    //     list = [
    //       {
    //         type: 0,
    //         out_trade_no: "D323sdve32m3",
    //         createime: "2016年4月9日",
    //         total_fee: "20"
    //       },          
    //       {
    //         type: 0,
    //         out_trade_no: "D323sdve32m3",
    //         createime: "2016年4月9日",
    //         total_fee: "20"
    //       },          
    //       {
    //         type: 1,
    //         out_trade_no: "D323sdve32m3",
    //         createime: "2016年4月9日",
    //         total_fee: "20"
    //       },          
    //       {
    //         type: 1,
    //         out_trade_no: "D323sdve32m3",
    //         createime: "2016年4月9日",
    //         total_fee: "20"
    //       }
    //     ];

    // this.setData({
    //   list: list,
    //   recharge: recharge,
    //   take: take
    // })
    const self = this
    wx.request({
      url: app.globalData.rootUrl + 'trade_list',
      data: {
      },
      success (res) {
        console.log(res, "trade_list")
        if (res.statusCode === 200) {
          let data = res.data;
          console.log(data.errcode, data.data)
          if(data.errcode === 0 && data.data) {
            self.setData({
              list: data.data,
              recharge: data.recharge,
              take: data.take
            })
          }
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