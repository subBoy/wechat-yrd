App({
  onLaunch: function () {
    wx.login({
      success: res => {
        wx.request({
          url: this.globalData.basePath + '/wechat/mine.do',
          header: {
            "context-type": "application/json"
          },
          data: {
            cmd: 'init',
            code: res.code
          },
          success: res => {
            this.globalData.openId = res.data.openId
            this.globalData.sessionKey = res.data.session_key
            this.globalData.unionid = res.data.unionid
          }
        })
      }
    })
  },
  globalData: {
    basePath: 'https://pre.yourendai.com',
    token: '',
    openId: '',
    sessionKey : '',
    unionid : ''
  }
})