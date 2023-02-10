// pages/answer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputText: '',
    list: [],
    canUseBtn: true,
    scrollLast: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.cloud.init();
    const { question = '' } = options || {};
    this.setData({
      inputText: question
    });
    this.bindViewBtn();
  },

  onShow() {
    if (!this.data.canUseBtn) {
      this.setData({
        canUseBtn: true,
      })
      wx.hideLoading();
    }
  },

  inputHandler(e) {
    this.setData({
      inputText: e.detail.value
    })
    this.scrolTolLast()
  },
  // 事件处理函数
  bindViewBtn() {
    if (!this.data.inputText || !this.data.canUseBtn) {
      return
    }
    const text = this.data.inputText;
    const list = this.data.list;
    list.push({
      role: 'user',
      text,
    })
    this.setData({
      list,
      inputText: '',
      canUseBtn: false,
    },() => {
      this.scrolTolLast()
      this.queryAi(text)
    })
  },

  scrolTolLast() {
    if (this.data.list.length < 5) {
      return
    }
    this.setData({
      scrollLast: 'item' + this.data.list.length
    })
  },

  async queryAi(text) {
    wx.showLoading({
      title: 'AI思考中..',
    })
    const { data } = await wx.cloud.callContainer({
      "config": {
        "env": "prod-3g0c541z90544ce3"
      },
      "path": "/api/queryChatGPT",
      "header": {
        "X-WX-SERVICE": "koa-6c9z"
      },
      "method": "POST",
      "data": {
        "question": text
      }
    });
    this.setData({
      canUseBtn: true
    })
    wx.hideLoading()
    if (data.code === 0) {
      const list = this.data.list;
      list.push({
        role: 'ai',
        text: data.data
      })
      this.setData({
        list: list,
      }, () => {
        this.scrolTolLast()
      });
    } else {
      const list = this.data.list;
      list.push({
        role: 'ai',
        text: '对不起，请稍等，我要回答的问题太多，让我思考一会！'
      })
      this.setData({
        list: list,
      }, () => {
        this.scrolTolLast()
      });
      wx.showToast({
        title: '服务繁忙请稍等',
        icon: 'error',
        duration: 2000
      })
    }
  }

})