// friendslist.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      friendNum: 0,
      friendList: [],
      balance: 0,
      friendsMoney: 0.00
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    getFriendList: function() {
        const self = this
        const uid = app.globalData.unionid;
        const openid = app.globalData.openid;
        wx.request({
            url: `https://www.byjiedian.com/index.php/byjie/get_agent_trade?uid=${uid}&openid=${openid}&from=v`,
            header: {
                'Content-type': 'application/json'
            },
            success: function(d) {
                console.log(d)
                var res = d.data;

                if (res.errcode == 0) {
                    let _list = res.data.list.map(item => {
                        return {
                            head: item.headimgurl.replace(/\\/, ''),
                            username: item.username,
                            amount: item.amount,
                            time: item.time
                        }
                    })

                    this.setData({
                        friendNum: res.data.total,
                        friendList: _list,
                        balance: res.data.balance,
                        friendsMoney: res.data.num
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        duration: 2000
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})