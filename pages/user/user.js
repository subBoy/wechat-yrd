Page({
  data: {
    accountName: 'Hello, 您还未开启出借之旅~~',
    avatar: '../../images/logo.png',
    isLogin: false,
    isOlder: false,
    isInvestor: false,
    dueSum: '*.**',
    dueDate: '****-**-**',
    dueSumNext: '*.**'
  },
  gotoSign: function () {
    if (this.data.isLogin) {
      return;
    }
    wx.navigateTo({
      url: '/pages/signIn/signIn'
    })
  },
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo.source === 'wx') {
      this.setData({
        accountName: userInfo.data.account,
        avatar: userInfo.data.avatar,
        isLogin: true,
        isOlder: userInfo.data.isOlder,
        isInvestor: userInfo.data.isInvestor,
        dueSum: userInfo.data.data1,
        dueDate: userInfo.data.data2,
        dueSumNext: userInfo.data.data3
      });
      return;
    }
  },
  makeCall: function () {
    wx.makePhoneCall({
      phoneNumber: '400-663-9190'
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '有人贷-微信小程序',
      path: '/page/user/user'
    }
  }
})