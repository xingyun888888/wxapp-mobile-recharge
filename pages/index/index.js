// pages/map/map.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        lng: '',
        lat: '',
        logo: "http://about:blank",
        amount: 0.00,
        systemInfo: {},
        mapHeight: '',
        shopList: [],
        markers: [],
        controls: [],
        scale: 15
    },
    // 获取周边网点 
    getNearShop(lat, lng) {
        const self = this
        wx.setNavigationBarTitle({
            title: '搜索附近网点...'
        })
        wx.showNavigationBarLoading()
        wx.request({
            url: 'https://byjiedian.com/index.php/byjie/get_posi',
            data: {
                lat,
                lng
            },
            success(res) {
                console.log(res, "get_posi返回值")
                if (res.statusCode === 200) {
                    const shopList = res.data.data
                    console.log(shopList, 'shopList')
                    const markers = shopList.map((item) => {
                        return {
                            id: item.id,
                            latitude: item.lat,
                            longitude: item.lng,
                            title: item.name,
                            iconPath: '../../assets/dingwei.png',
                            width: 32,
                            height: 36
                        }
                    })
                    wx.setNavigationBarTitle({
                        title: '附近网点'
                    })
                    wx.hideNavigationBarLoading()
                    console.log("网点信息" + JSON.stringify(markers));
                    self.setData({
                        markers: markers,
                        shopList: shopList
                    })
                }
            }
        })
    },
    // 选择位置
    chooseLocation() {
        const self = this
        wx.chooseLocation({
            success(res) {
                self.setData({
                    lat: res.latitude,
                    lng: res.longitude
                })
            }
        })
    },
    // 跳转页面
    navigateTo(page) {
        const self = this
        wx.navigateTo({
            url: `../list/list?lat=${self.data.lat}&lng=${self.data.lng}`
        })
    },
    // 初始化控件
    initControls() {
        const self = this
        // this.setControls(controls);
        let controls = this.getControls()
        this.setData({
            controls: controls
        })
    },
    getControls() {
        const self = this
        const wWidth = self.data.systemInfo.windowWidth
        const mapHeight = self.data.mapHeight
        const intval = (wWidth - 242) / 3
        const scanBorrow = {
            id: 1,
            position: {
                left: intval,
                top: mapHeight - 52 - 30,
                width: 121 * 1.2,
                height: 52 * 1.2
            },
            iconPath: '../../assets/scan-borrow.png',
            clickable: true
        }
        const scanBuy = {
            id: 2,
            position: {
                left: intval * 3 / 2 + 121,
                top: mapHeight - 52 - 30,
                width: 121 * 1.2,
                height: 52 * 1.2
            },
            iconPath: '../../assets/scan-buy.png',
            clickable: true
        }
        const origin = {
            id: 3,
            position: {
                left: wWidth - 36 - 20,
                top: mapHeight - 132,
                width: 44,
                height: 44
            },
            iconPath: '../../assets/origin@3x.png',
            clickable: true
        }
        const neighbor = {
            id: 7,
            position: {
                left: wWidth - 378 / 3 - 40 - 15,
                top: 16,
                width: 378 / 3,
                height: 108 / 3
            },
            iconPath: '../../assets/neighbour@3x.png',
            clickable: true
        }
        const logo = {
            id: 8,
            position: {
                left: 56,
                top: 21.5,
                width: 147 / 3,
                height: 75 / 3
            },
            iconPath: '../../assets/logo@3x.png',
            clickable: true
        }

        const menu = {
            id: 9,
            position: {
                left: wWidth - 50,
                top: 14,
                width: 40,
                height: 40
            },
            iconPath: '../../assets/menu@3x.png',
            clickable: true
        }

        const avatar = {
            id: 10,
            position: {
                left: 16,
                top: 16,
                width: 36,
                height: 36
            },
            iconPath: '../../assets/company.png',
            clickable: true
        }

        let controls = [scanBorrow, scanBuy, origin, neighbor, menu, logo, avatar];
        return controls;
    },
    setControls() {
        console.log(app.globalData.userInfo.amount, "amount")
        const wWidth = this.data.systemInfo.windowWidth
        let recharge = {
                id: 6,
                position: {
                    left: wWidth / 2,
                    top: 70,
                    width: wWidth / 2,
                    height: wWidth / 2 * 126 / 477
                },
                iconPath: '../../assets/nomoney@3x.png',
                clickable: true
            },
            flag = true;
        if (app.globalData.userInfo.amount > 79.999) {
            flag = false;
        } else {
            if (app.globalData.userInfo.amount < 0.001) {

            } else {
                recharge.iconPath = '../../assets/notenoughmoney@3x.png';
            }
        }
        let controls = [];
        if (flag) {
            console.log(this.data.controls, '--------')
            // let controls = this.data.controls.push(recharge);
            // this.setData({
            //   controls: this.data.controls.push(recharge)
            // })
            controls = this.getControls().concat(recharge);
        } else {
            controls = this.getControls()
        }
        this.setData({
            controls: controls
        })
        console.log(this.data.controls, "After controls...")

    },
    scanBorrow: function() {
        let self = this;

        wx.scanCode({
            success: function(res) {
                console.log(res);
                self.scanBorrowNow(res.result, 'borrow')
            }
        })
    },
    scanBorrowNow: function(shopid) {
        let self = this;
        const uid = app.globalData.unionid;
        const openid = app.globalData.openid;

        let result = encodeURIComponent(shopid);
        if (app.globalData.userInfo.amount < 80.0) {
            wx.navigateTo({
                url: `/pages/recharge/recharge?action=borrow&shopid=${result}`
            })
        } else {
            //查询用户当前是否在借的状态
            wx.request({
                url: `https://www.byjiedian.com/index.php/byjie/scan_lending?uid=${uid}&from=v`,
                success: function(res) {
                    if (res.data.errcode === 0 && res.data.data.status === true) {
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
                            if (data.retCode === 0) {
                                let fee = {
                                    "1": {
                                        per: 1,
                                        most: 8,
                                    },
                                    "2": {
                                        per: 2,
                                        most: 14
                                    },
                                    "3": {
                                        per: 3,
                                        most: 18,
                                    },
                                    "4": {
                                        per: 5,
                                        most: 25
                                    }
                                }
                                let rule = fee[data.rule]
                                // let str = "该充电宝每小时收费" + rule.per + "元，每天最多收费" + rule.most + "元。"
                                let str = "请在槽位" + data.slot_id + "取走充电宝。该充电宝免费使用时长为" + data.free_time + "分钟，之后每小时收费" + rule.per + "元，每天最多收费" + rule.most + "元。"
                                wx.showModal({
                                    title: '恭喜您成功借到充电宝',
                                    content: str + "请在使用完毕后及时归还充电宝，系统将停止计费",
                                    confirmText: "我了解了",
                                    showCancel: false
                                })

                            } else {
                                wx.showModal({
                                    title: '借充电宝失败',
                                    content: data.msg || "网络错误，请稍后再试",
                                    confirmText: "我了解了",
                                    showCancel: false
                                })

                            }
                        }
                    })
                }
            })
        }
    },
    scanBuy: function() {
        let self = this
        wx.showModal({
          title: '您确定要购买充电宝吗',
          content: '充电宝售价为80元/个，系统一次性从您的账户余额中扣除',
          success: function(res) {
            if(res.confirm) {
              self.scanBuyNow()  
            }
          },
          confirmText: "确定",
          showCancel: true
        })    
    },
    scanBuyNow: function () {
      let self = this;
      const uid = app.globalData.unionid;
      const openid = app.globalData.openid;
      wx.scanCode({
        success: function(res) {
          console.log(res);
          let result = encodeURIComponent(res.result);

          if(app.globalData.userInfo.amount < 80.0) {
            wx.navigateTo({
              url: `/pages/recharge/recharge?action=buy&shopid=${result}`
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
                  url: `https://www.byjiedian.com/index.php/byjie/buy_imei?shopid=${result}&uid=${uid}&from=v`,
                  success: function(d) {
                    console.log(d); 
                    let data = d.data
                    // if()
                    if(data.errcode === 0 || data.retCode === 0) {
                      wx.showModal({
                        title: '恭喜您购买成功',
                        content: '请在槽位' + data.slot_id + '取走充电宝。系统已从您余额中扣除80元',
                        confirmText: "我了解了",
                        showCancel: false
                      });
                      //更新余额           
                      self.updateInfo()
                    } else {
                      wx.showModal({
                        title: '购买失败',
                        content: data.msg || "网络错误，请稍后再试",
                        confirmText: "我了解了",
                        showCancel: false
                      })  
                    }
                  } 
                }) 
              }
            })          
          }
        }
      })
    },
    // 点击控件
    clickControl(e) {
        const self = this
        if (e.controlId === 1) {
            this.scanBorrow();
            // wx.navigateTo({
            //   url: '../scanborrow/scanborrow'
            // })
        }
        if (e.controlId === 2) {
            this.scanBuy();
            // wx.navigateTo({
            //   url: '../scanbuy/scanbuy'
            // })
        }
        if (e.controlId === 3) {
            self.mapCtx.moveToLocation()
            wx.getLocation({
                type: 'gcj02', //返回可以用于wx.openLocation的经纬度
                success: function(res) {
                    var latitude = res.latitude
                    var longitude = res.longitude
                    console.log(latitude, longitude, "您的当前位置")
                    self.setData({
                        lat: res.latitude,
                        lng: res.longitude,
                    })
                    console.log("按钮复位", latitude, longitude);
                    self.getNearShop(latitude, longitude)
                },
            })
        }
        // recharge
        if (e.controlId === 6) {
            console.log('点到我了')
            wx.navigateTo({
                url: '/pages/recharge/recharge'
            })
        }

        // 搜索
        if (e.controlId === 7) {
            this.chooseLocation();
        }
        // 用户头像
        if (e.controlId === 10) {
            console.log('点到我了')
            wx.navigateTo({
                url: '/pages/usercenter/usercenter'
            })
        }

        // 进入附近门店
        if (e.controlId === 9) {
            console.log('点到我了')
            let lat = this.data.lat,
                lng = this.data.lng;
            console.log("进入附近门店", lat, lng);
            this.navigateTo(null);
        }


        //plus
        // if (e.controlId === 4) {
        //   const scale = self.data.scale
        //   if (scale < 18) {
        //     self.setData({
        //       scale: scale + 1
        //     })
        //   } 
        // }
        //minus
        // if (e.controlId === 5) {
        //   const scale = self.data.scale
        //   if (scale > 5) {
        //     self.setData({
        //       scale: scale - 1
        //     })
        //   }
        // }
    },
    // 点击标注
    markertap(e) {
        // console.log('((((((((__)))))aaasdfsdfsdfsdf');
        const self = this
        const id = e.markerId
        const shopInfo = self.data.shopList.find((shop) => {
            console.log(shop.name)
            return shop.id == id;
        })
        console.log("====================过滤到店铺信息" + shopInfo.name);
        wx.showActionSheet({
            itemList: [shopInfo.name],
            success(res) {
                if (res.tapIndex === 0) {
                    wx.navigateTo({
                        url: `/pages/shopdetail/shopdetail?id=${id}`
                    })
                }
            }
        })
    },
    regionchange(e) {
        const self = this
        if (e.type === 'end') {
            self.mapCtx.getCenterLocation({
                success(res) {
                    console.log("区域变更", res.latitude, res.longitude);
                    self.getNearShop(res.latitude, res.longitude)
                }
            })
        }
    },
    returnOrigin() {
        return new Promise((resolve, reject) => {
            const deferred = [resolve, reject]

        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const self = this
        self.mapCtx = wx.createMapContext('map')

        wx.setNavigationBarTitle({
            title: '附近网点'
        })

        if (app.globalData.systemInfo) {
            self.setData({
                systemInfo: app.globalData.systemInfo,
                mapHeight: app.globalData.systemInfo.windowHeight
            })
        }
        self.initControls()

        this.getLocation();

        console.log("start setting map info")
    },

    getLocation() {
        let self = this
        wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: function(res) {
                var latitude = res.latitude
                var longitude = res.longitude
                self.setData({
                    lat: res.latitude,
                    lng: res.longitude,
                })
                console.log("获取位置", latitude, longitude);
                self.getNearShop(latitude, longitude)
            },
            fail: function(e) {
                console.log('获取位置失败');
                wx.showModal({
                    title: '获取地理位置失败',
                    content: '请允许爽电使用您的位置信息',
                    confirmText: "设置",
                    showCancel: false,
                    success: function(res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                            wx.openSetting({
                                success: function() {
                                    console.log(12345);
                                    self.getLocation();
                                }
                            })
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
            }
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        // app.postCode()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        let self = this
        this.updateInfo()
        // app.getUserInfo()
        console.log("触发了onShow!");

    },

    updateInfo() {
        var self = this
        // console.log("更新用户信息")
        // var amount = app.globalData.userInfo && app.globalData.userInfo.amount || -1;
        // console.log("刷新")
        if (app.globalData.userInfo && app.globalData.unionid) {
            console.log("You have user info already");
            //重新拉取amount
            app.getUserInfoByApi(() => {
                self.setData({
                    logo: app.globalData.userInfo.avatarUrl,
                    amount: app.globalData.userInfo.amount
                });

                console.log("因为余额变化1，重新刷新controls")
                self.setControls();
            })
        } else {
            setTimeout(() => {
                this.updateInfo();
            }, 100);
        }
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