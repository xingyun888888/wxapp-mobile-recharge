/**
 * 获取周边店铺地址位置及信息
 * http://byjiedian.com/index.php?m=byjie&a=get_pos 
 */
const getNearShop = function (lat, lng) {
  return wx.request({
    url: 'https://byjiedian.com/index.php?m=byjie&a=get_pos',
    data: {
      lat,
      lng
    }
  })
  // return wx.request(rootUrl, {
  //   m: 'byjie',
  //   a: 'get_pos',
  //   lat,
  //   lng
  // })
}

export default {
  getNearShop
}