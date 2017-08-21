// recommend.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        friendList: [],
        friendNum: 0,
        showShare: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log("recommend");
        if (!app.globalData.openid) {
            wx.navigateBack({
                delta: 1
            });
            return false;
        }
        this.getFriendList();

        wx.showShareMenu({
          withShareTicket: true,
          success: function(res) {
            console.log("test", res);
          }
        })
    },

    onShareAppMessage: function(res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '自定义转发标题',
            path: '/page/usercenter/usercenter',
            success: function(res) {
                // 转发成功
                console.log('转发成功');
            },
            fail: function(res) {
                // 转发失败
            }
        }
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
                    let _list = (res.data.list || []).slice(0, 5).map(item => {
                        return {
                            head: item.headimgurl.replace(/\\/, ''),
                            username: item.username,
                            amount: item.amount,
                            time: item.time
                        }
                    })

                    self.setData({
                        friendNum: res.data.total,
                        friendList: _list
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg || "",
                        duration: 2000
                    })
                }
            }
        })
    },

    toggleShare: function() {
        let showShare = !this.data.showShare;
        this.setData({
            showShare: showShare
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