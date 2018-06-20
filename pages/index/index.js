Page({
  data: {
    returnIndex: 0,
    returnArray: ['9.6%', '8.0%', '7.0%'],
    limitIndex: 0,
    limitArray: ['12个月', '6个月', '3个月'],
    inputValue: 1000,
    earnings: ['0', '.', '0', '0'],
    expectedInterest: 0.00
  },
  bindReturnPickerChange: function(e) {
    this.setData({
      returnIndex: e.detail.value
    })
  },
  bindLimitPickerChange: function(e) {
    this.setData({
      limitIndex: e.detail.value
    })
  },
  bindKeyInput: function(e) {
    var numVal = parseFloat(e.detail.value);
    if (!numVal && e.detail.value !== '') {
      numVal = 1000
    }
    this.setData({
      inputValue: numVal
    })
  },
  removeNum: function () {
    var _val = 0;
    if (!this.data.inputValue || this.data.inputValue === '') {
      _val = 0;
    } else {
      _val = this.data.inputValue - 100;
    }
    if (_val <= 0) {
      _val = 0;
    }
    this.setData({
      inputValue: _val
    })
  },
  addNum: function () {
    var _val = 0;
    if (!this.data.inputValue || this.data.inputValue === '') {
      _val = 100;
    } else {
      _val = this.data.inputValue - 0 + 100;
    }
    this.setData({
      inputValue: _val
    })
  },
  formSubmit: function (e) {
    var data  = e.detail.value;
    var retuenPicker = this.data.returnArray[data.retuenPicker];
    retuenPicker = retuenPicker.substring(0, retuenPicker.length - 1) - 0;
    var limitPicker = this.data.limitArray[data.limitPicker];
    limitPicker = limitPicker.substring(0, limitPicker.length - 2) - 0;
    var inputNumber = data.inputNumber - 0;
    this.countInterest(limitPicker, inputNumber, retuenPicker);
  },
  countInterest: function (retuenPicker, limitPicker, inputNumber) {
    var _this = this;
    var expectedInterest = (retuenPicker / 100) * limitPicker / 12 * inputNumber;
    expectedInterest = expectedInterest.toFixed(2);
    var cardinal = (expectedInterest - this.data.expectedInterest) / 20;
    var expectedInterestStr = expectedInterest + '';
    var _to = function () {
      var startVal = _this.data.expectedInterest - 0 + cardinal;
      var _startVal = startVal.toFixed(2);
      var _startValStr = _startVal + '';
      _this.setData({
        expectedInterest: _startVal,
        earnings: _startValStr.split('')
      })
      
      if ((startVal >= expectedInterest - 0.1) && cardinal > 0) {
        _this.setData({
          expectedInterest: expectedInterest,
          earnings: expectedInterestStr.split('')
        })
        return
      }

      if ((expectedInterest >= startVal - 0.1) && cardinal < 0) {
        _this.setData({
          expectedInterest: expectedInterest,
          earnings: expectedInterestStr.split('')
        })
        return
      }

      requestAnimationFrame(_to)
    };
    _to()
  },
  onReady: function () {
    var retuenPicker = this.data.returnArray[this.data.returnIndex];
    retuenPicker = retuenPicker.substring(0, retuenPicker.length - 1) - 0;
    var limitPicker = this.data.limitArray[this.data.limitIndex];
    limitPicker = limitPicker.substring(0, limitPicker.length - 2) - 0;
    var inputNumber = this.data.inputValue - 0;
    this.countInterest(limitPicker, inputNumber, retuenPicker);
  }
})