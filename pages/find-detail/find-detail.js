Page({
  data: {
    datailUrl: ''
  },
  onLoad: function (options) {
    this.setData({
      datailUrl: options.detailUrl
    })
    wx.setNavigationBarTitle({
      title: options.tle
    })
  }
})