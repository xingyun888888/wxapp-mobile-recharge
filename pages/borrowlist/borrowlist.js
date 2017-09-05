// borrowlist.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      listType: 0, //展示状态
      borrowingList: [], //租借列表
      borrowedList: [], //购买列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("进入租借记录页");
    wx.setNavigationBarTitle({
      title: '租借记录'
    });
    this.getBorrowList();  
  },

  changeListType: function() {
    let type = 1 - this.data.listType;
    console.log(type);
    this.setData({
      listType: type
    });
  },

  getBorrowList: function() {
    // let list = [
    //   {
    //     ord_id: "B010203030303030303030434",
    //     amount: "2",
    //     rtime: "2017年1月3日",
    //     rent: "麻辣1号 ",
    //     btime: "2017年2月2日",
    //     back: "麻辣1号",
    //     status: 1
    //   },      
    //   {
    //     ord_id: "B34eefet45645645646456333",
    //     amount: "3",
    //     rtime: "2017年2月2日",
    //     rent: "木屋烧烤",
    //     btime: "2017年2月2日",
    //     back: "麻辣2号",
    //     status: 2
    //   },      
    //   {
    //     ord_id: "B34eefet45645645646456333",
    //     amount: "2",
    //     rtime: "2017年7月2日",
    //     rent: "木屋烧烤",
    //     btime: "2017年7月5日",
    //     back: "麻辣2号",
    //     status: 2
    //   }
    // ];
    // let borrowingList = list.filter((item) => {
    //   return item.status === 1
    // }),
    //   borrowedList = list.filter((item) => {
    //     return item.status === 2
    //   });

    // this.setData({
    //   borrowingList: borrowingList,
    //   borrowedList: borrowedList
    // });
    // return false;

    wx.request({
      url: app.globalData.rootUrl + 'rent_list',
      data: {
      },
      success (res) {
        if (res.statusCode === 200) {
          let data = res.data;
          if(data.errorCode === 0 ) {
            let borrowingList = data.data.filter((item) => {
              return item.status === 1
            }),
              borrowedList = data.data.filter((item) => {
                return item.status === 2
              });

            this.setData({
              borrowingList: borrowingList,
              borrowedList: borrowedList
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