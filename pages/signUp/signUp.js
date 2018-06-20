var app = getApp();
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    stepStatus: false,
    errStatus: false,
    gcfStatus: true,
    phoneValue: '',
    codeValue: '',
    passwordValue: '',
    submitTxt: '下一步',
    getCodeBtnTxt: '获取验证码',
    codeTime: 60,
    setInter: null,
    errorHintTxt: ''
  },
  bindPhoneInput: function (e) {
    this.setData({
      phoneValue: e.detail.value
    })
  },
  bindCodeInput: function (e) {
    this.setData({
      codeValue: e.detail.value
    })
  },
  bindPasswordInput: function (e) {
    this.setData({
      passwordValue: e.detail.value
    })
  },
  focusCommon: function () {
    this.setData({
      errStatus: false,
      errorHintTxt: ''
    });
  },
  verifyPh: function (ph) {
    if (ph === undefined || ph === '' || ph ===null) {
      this.setData({
        errStatus: true,
        errorHintTxt: '请输入手机号！'
      });
    } else {
      var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      var mathes = ph.match(reg);
      if (!mathes) {
        this.setData({
          errStatus: true,
          errorHintTxt: '手机号格式错误！'
        });
        return false;
      }
      this.setData({
        errStatus: false,
        errorHintTxt: ''
      });
      return true;
    }
  },
  verifyCode: function (code) {
    if (code === undefined || code === '' || code === null) {
      this.setData({
        errStatus: true,
        errorHintTxt: '请输入正确的验证码！'
      });
      return false;
    }
    this.setData({
      errStatus: false,
      errorHintTxt: ''
    });
    return true;
  },
  verifyPd: function (pd) {
    if (pd === undefined || pd === '' || pd === null) {
      this.setData({
        errStatus: true,
        errorHintTxt: '请输入密码！'
      });
      return false;
    }
    if (pd.length < 8 || pd.length > 16) {
      this.setData({
        errStatus: true,
        errorHintTxt: '密码长度需控制在8-16位！'
      });
      return false;
    }
    if (this.checkPass(pd) < 3) {
      this.setData({
        errStatus: true,
        errorHintTxt: '密码必须由大小写字母以及数字组成！'
      });
      return false;
    }
    const reg = /^[a-zA-Z0-9]\w{7,15}$/
    const mathes = reg.test(pd)
    if (!mathes) {
      this.setData({
        errStatus: true,
        errorHintTxt: '密码不能含有特殊字符！'
      });
      return false;
    }
    this.setData({
      errStatus: false,
      errorHintTxt: ''
    });
    return true;
  },
  checkPass: function (pass) {
    let ls = 0
    if (pass.match(/([a-z])+/)) {
      ls++
    }
    if (pass.match(/([0-9])+/)) {
      ls++
    }
    if (pass.match(/([A-Z])+/)) {
      ls++
    }
    if (pass.match(/[^a-zA-Z0-9]+/)) {
      ls++
    }
    return ls
  },
  getCodeFun: function () {
    if (!this.data.gcfStatus) {
      return;
    }
    var inputPhone = this.data.phoneValue;
    var phLayout = this.verifyPh(inputPhone);
    if (!phLayout) {
      return;
    }
    wx.request({
      url: app.globalData.basePath + '/wechat/mine.do',
      header: {
        "context-type": "application/json"
      },
      data: {
        cmd: 'getCheckCode',
        phoneNumber: inputPhone
      },
      success: res => {
        if (res.data.status) {
          this.setData({
            gcfStatus: false
          });
          this.setInterFuc();
          wx.showToast({
            title: '短信验证码发送成功',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  setval: function () {
    var codeTime = this.data.codeTime;
    codeTime--;
    var codeTxt = codeTime + 's后重试';
    if (codeTime < 1) {
      clearInterval(this.data.setInter);
      this.setData({
        codeTime: 60,
        getCodeBtnTxt: '重新发送',
        gcfStatus: true
      });
      return;
    }
    this.setData({
      codeTime: codeTime,
      getCodeBtnTxt: codeTxt
    });
  },
  setInterFuc: function () {
    const _this = this
    this.setData({
      setInter: setInterval(_this.setval, 1000)
    });
  },
  formSubmit: function (e) {
    if (this.data.phoneValue !== undefined) {
      var phLayout = this.verifyPh(this.data.phoneValue);
      if (!phLayout) {
        return;
      }
    }
    if (this.data.codeValue !== undefined) {
      var codeLayout = this.verifyCode(this.data.codeValue);
      if (!codeLayout) {
        return;
      }
    }

    if (!this.data.stepStatus) {
      wx.request({
        url: app.globalData.basePath + '/wechat/mine.do',
        header: {
          "context-type": "application/json"
        },
        data: {
          cmd: 'step1',
          phoneNumber: this.data.phoneValue,
          checkCode: this.data.codeValue
        },
        success: res => {
          if (res.data.status) {
            if (res.data.step == 2) {
              this.setData({
                stepStatus: true
              });
            } else {
              app.globalData.token = res.data.token;
              this.getUserInfo();
            }
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      });
      return;
    }
    if (this.data.passwordValue !== undefined) {
      var pdLayout = this.verifyPd(this.data.passwordValue);
      if (!pdLayout) {
        return;
      }
    }

    wx.request({
      url: app.globalData.basePath + '/wechat/mine.do',
      header: {
        "context-type": "application/json"
      },
      data: {
        cmd: 'step2',
        phoneNumber: this.data.phoneValue,
        password: this.data.passwordValue
      },
      success: res => {
        if (res.data.status) {
          app.globalData.token = res.data.token
          this.getUserInfo();
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
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
  }
})