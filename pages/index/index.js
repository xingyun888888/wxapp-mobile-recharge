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
  getNearShop (lat, lng) {
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
      success (res) {
        console.log(res,"get_posi返回值")
        if (res.statusCode === 200) {
          const shopList = res.data.data
          console.log(shopList, 'shopList')
          const markers = shopList.map((item) => {
            return {
              id: item.id,
              latitude: item.lat,
              longitude: item.lng,
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
  chooseLocation () {
    const self = this
    wx.chooseLocation({
      success (res) {
        self.setData({
          lat: res.latitude,
          lng: res.longitude
        })
      }
    })
  },
  // 跳转页面
  navigateTo (page) {
    const self = this
    wx.navigateTo({
      url: `../list/list?lat=${self.data.lat}&lng=${self.data.lng}`
    })
  },
  // 初始化控件
  initControls () {
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
        left: intval * 3/2 + 121,
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
        left: wWidth  - 378 / 3 - 40 - 15,
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
        top: 26,
        width: 147 / 3,
        height: 45 / 3
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
    // this.setControls(controls);
    this.setData({
      controls: controls
    })    
  },
  setControls(controls) {
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
    if(app.globalData.userInfo.amount > 80.0) {
      flag = false;
    } else {
      if(app.globalData.userInfo.amount < 0.001) {

      } else {
        recharge.iconPath = '../../assets/notenoughmoney@3x.png';
      }
    }

    if(flag) {
      console.log(this.data.controls, '--------')
      // let controls = this.data.controls.push(recharge);
      // this.setData({
      //   controls: this.data.controls.push(recharge)
      // })
      let controls = this.data.controls.concat(recharge);
      this.setData({
        controls: controls
      })
      console.log(this.data.controls, "After controls...")
    }
  },
  scanBorrow: function () {
    let self = this;
    const uid = app.globalData.unionid;
    const openid = app.globalData.openid;
    wx.scanCode({
      success: function(res) {
        console.log(res);
        let result = res.result;
                let index = result.indexOf('shopid=');
        if(index > -1) {
          result = result.slice(index + 'shopid='.length);
        }

        if(app.globalData.userInfo.amount < 0.0) {
          wx.navigateTo({
            url: '/pages/recharge/recharge'
          })
        } else {
          wx.request({
            url: `https://www.byjiedian.com/index.php/byjie/borrow?shopid=${result}&uid=${uid}&from=v`,
            success: function(d) {
              let data = d.data;
              console.log(data);
              if(data.retCode === 0) {
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
      }
    })
  },
  scanBuy: function () {
    let self = this;
    const uid = app.globalData.unionid;
    const openid = app.globalData.openid;
    wx.scanCode({
      success: function(res) {
        console.log(res);
        let result = res.result;
                let index = result.indexOf('shopid=');
        if(index > -1) {
          result = result.slice(index + 'shopid='.length);
        }

        if(app.globalData.userInfo.amount < 80.0) {
          wx.navigateTo({
            url: '/pages/recharge/recharge'
          })          
        } else {
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
                    // setTimeout(()=>{
                    //   wx.navigateTo({
                    //     url: `../borrowlist/borrowlist`
                    //   })                    
                    // }, 3000)
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
      }
    })
  },
  // 点击控件
  clickControl (e) {
    const self =  this
    if (e.controlId === 1) {
      // this.scanBorrow();
      wx.navigateTo({
        url: '../scanborrow/scanborrow'
      })
    }
    if (e.controlId === 2) {
      // this.scanBuy();
      wx.navigateTo({
        url: '../scanbuy/scanbuy'
      })
    }
    if (e.controlId === 3) {
      self.mapCtx.moveToLocation()
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude
          console.log(latitude, longitude, "您的当前位置")
          self.setData({
            lat: res.latitude,
            lng: res.longitude,
          })
          self.getNearShop(latitude, longitude)
        }
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
      wx.navigateTo({
        url: '/pages/list/list'
      })
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
  clickMarker (e) {
    const self = this
    const id = e.markerId
    const shopInfo = self.data.shopList.find(shop => shop.id = id)
    wx.showActionSheet({
      itemList: [shopInfo.name],
      success (res) {
        if (res.tapIndex === 0) {
          wx.navigateTo({
            url: `/pages/shopdetail/shopdetail?id=${id}`
          })
        }
      }
    })
  },
  regionchange (e) {
    const self = this
    if (e.type === 'end') {
      self.mapCtx.getCenterLocation({
        success (res) {
          self.getNearShop(res.latitude, res.longitude)
        }
      })
    }
  },
  returnOrigin () {
    return new Promise((resolve, reject) => {
      const deferred = [resolve, reject]

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        self.setData({
          lat: res.latitude,
          lng: res.longitude,
        })
        self.getNearShop(latitude, longitude)
      }
    });

    console.log("start setting map info")

    if(app.globalData.userInfo && app.globalData.userInfo.already) {
        self.setData({
            logo: app.globalData.userInfo.avatarUrl,
            amount: app.globalData.userInfo.amount
        });
        console.log("You have user info already");
        self.setControls();
    } else {
      app.userinfoChanged(() => {
        console.log("user info changed");
        console.log(app.globalData.userInfo)
        self.setData({
            logo: app.globalData.userInfo.avatarUrl,
            amount: app.globalData.userInfo.amount
        });
        self.setControls();
      });      
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // app.postCode()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // app.getUserInfo()
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