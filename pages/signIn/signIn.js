var app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  getPhoneNumber: function (e) {
    if (e.detail.encryptedData) {
      wx.checkSession({
        success: res => {
          wx.request({
            url: app.globalData.basePath + '/wechat/mine.do',
            header: {
              "context-type": "application/json"
            },
            data: {
              cmd: 'authorize',
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv,
              sessionKey: app.globalData.sessionKey
            },
            success: res => {
              app.globalData.token = res.data.token;
              this.getUserInfo();
            }
          })
        },
        fail: res => {
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
                  this.globalData.openId = res.data.openId;
                  this.globalData.sessionKey = res.data.session_key;
                  this.globalData.unionid = res.data.unionid;
                }
              })
            }
          })
        }
      })
    }
  },
  getUserInfo: function () {
    if (app.globalData.token) {
      wx.request({
        url: app.globalData.basePath + '/wechat/mine.do',
        header: {
          "context-type": "application/json"
        },
        data: {
          cmd: 'info',
          token: app.globalData.token
        },
        success: res => {
          var userData = res;
          if (!this.data.canIUse) {
            wx.showModal({
              title: '提示',
              content: '您的微信版本过低，不能使用此功能。请先升级微信版本！',
              showCancel: false
            })
            return;
          };
          wx.getSetting({
            success: resData => {
              if (resData.authSetting['scope.userInfo']) {
                wx.getUserInfo({
                  success: res => {
                    userData.source = 'wx';
                    userData.data.avatar = res.userInfo.avatarUrl;
                    wx.setStorageSync('userInfo', userData);
                    wx.reLaunch({
                      url: '/pages/user/user'
                    })
                  }
                })
              }
            }
          })
        }
      })
    }
  },
  gotoSign: function () {
    wx.navigateTo({
      url: '/pages/signUp/signUp'
    })
  },
  onLoad: function (options) {
  }
})