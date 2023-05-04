import wxCloudApi from '../../service/api'
// pages/answer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputText: '',
    list: [],
    canUseBtn: true,
    scrollLast: null,
    conversationId: '',
    parentMessageId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
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

  catchGPTError() {
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
  },

  async queryAi(text) {
    let data;
    const list = this.data.list;
    list.push({
      role: 'ai',
      text: 'ai在思考中...'
    })

    this.setData({
      list: list,
    }, () => {
      this.scrolTolLast()
    });

    try {
      const res = await wxCloudApi({
        url: '/api/chat/answer',
        method: 'POST',
        data: {
          question: text,
          conversationId: this.data.conversationId,
          parentMessageId: this.data.parentMessageId
        }
      }) 
      data = res;
    } catch (error) {
      this.catchGPTError()
    }

    this.setData({
      canUseBtn: true
    })
    if (data.code === 0) {
      const list = this.data.list;
      list.push({
        role: 'ai',
        text: data.data.text
      })
      this.setData({
        list: list,
        conversationId: data.data.conversationId,
        parentMessageId: data.data.messageId
      }, () => {
        this.scrolTolLast()
      });
    } else {
      this.catchGPTError()
    }
  }

})