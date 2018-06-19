var app = getApp();
Page({
  data: {
    basePath: app.globalData.basePath,
    findDataList: [],
    loadingTxt: '加载更多'
  },
  getDatas: function () {
    var _this = this
    wx.request({
      url: app.globalData.basePath + '/wechat/discover.do',
      data: {
        cmd: 'index'
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        var data = res.data.banners;
        var ret = [];
        data.map((item) => {
          var obj = {};
          obj.id = item.id;
          obj.tle = item.title;
          obj.time = '2018年06月';
          obj.imgUrl = _this.data.basePath + item.img;
          obj.detailUrl = _this.data.basePath + item.url;
          ret.push(obj)
        })
        console.log(ret)
        _this.setData({
          findDataList: ret
        })
      }
    })
  },
  loadMore: function () {
    var _this = this
    if (this.data.findDataList.length > 10) {
      _this.setData({
        loadingTxt: '已全部加载完成'
      })
      return;
    }
    wx.request({
      url: app.globalData.basePath + '/wechat/discover.do',
      data: {
        cmd: 'index'
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        var data = res.data.banners;
        var ret = [];
        data.map((item) => {
          var obj = {};
          obj.id = item.id;
          obj.tle = item.title;
          obj.time = '2018年06月';
          obj.imgUrl = _this.data.basePath + item.img;
          obj.detailUrl = _this.data.basePath + item.url;
          ret.push(obj)
        })
        var dataList = _this.data.findDataList.concat(ret);
        _this.setData({
          findDataList: dataList
        })
      }
    })
  },
  gotoDetail: function(e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/find-detail/find-detail?detailUrl=' + e.currentTarget.dataset.detailUrl + '&tle=' + e.currentTarget.dataset.tle
    })
  },
  onLoad: function (options) {
    this.getDatas()
  },
  onReachBottom: function () {
    this.loadMore()
  }
})