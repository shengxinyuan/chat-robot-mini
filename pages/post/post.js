import wxCloudApi from '../../service/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    inputText: '',
    postId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { id } = options || {};
    this.setData({
      postId: id
    })
    this.queryPost(id);
  },


  async queryPost(id) {
    const { data, code } = await wxCloudApi({
      url: '/api/post/getById',
      method: 'GET',
      data: {
        id,
        userId: 1
      }
    }) 
    if (code === 0 && data) {
      this.setData({
        detail: data,
      })
    }
  },

  inputHandler(e) {
    this.setData({
      inputText: e.detail.value
    })
  },

  bindBtn(e) {
    if (!this.data.inputText) {
      return
    }
    const text = this.data.inputText;
    
    this.setData({
      inputText: '',
    },() => {
      this.comment(text)
    })
  },

  async comment(text) {
    const { data, code } = await wxCloudApi({
      url: '/api/comment/add',
      method: 'POST',
      data: {
        postId: this.data.postId,
        content: text,
        userId: 1
      }
    }) 
    if (code === 0 && data) {
      this.queryPost(this.data.postId);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})