import login from '../../service/login'
import wxCloudApi from '../../service/api'

Page({
  data: {
    inputText: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: false, // 如需尝试获取用户信息可改为false
    recommend: [],
    tab: null,
    list: [],
    pageIndex: 1,
    pageSize: 10,
  },
  inputHandler(e) {
    this.setData({
      inputText: e.detail.value
    })
  },
  // 事件处理函数
  bindViewBtn() {
    wx.navigateTo({
      url: `/pages/answer/answer?question=${this.data.inputText}`
    })
  },
  onLoad() {
    // this.getUserProfile()
    login()
    this.queryRecommend();
  },
  
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  goPostDetail(e) {
    wx.navigateTo({
      url: `/pages/post/post?id=${e.currentTarget.id}`
    })
  },

  async queryRecommend() {
    const { data, code } = await wxCloudApi({
      url: '/api/recommend/list',
      method: 'GET',
      data: {
        type: 1,
      }
    });
    if (code === 0 && data) {
      this.setData({
        recommend: data,
        tab: data[0].id,
      })
      this.queryRecommendPost(data[0].id);
    }
  },

  onTabsClick({detail}) {
    this.queryRecommendPost(detail.value, 1)
  },

  async queryRecommendPost(recommendId, pageIndex) {
    const { data, code } = await wxCloudApi({
      url: '/api/recommendPost/getIndexPageList',
      method: 'GET',
      data: {
        recommendId,
        pageIndex: pageIndex || this.data.pageIndex,
        pageSize: this.data.pageSize,
      }
    }) 
    if (code === 0 && data) {
      this.setData({
        list: data.list,
        pageIndex: data.pageIndex,
        pageSize: data.pageSize,
      })
    }

  }
})
