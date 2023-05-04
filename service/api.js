// 开启可以调试线上
const debugProd = false

const defaultEnv = 'prod'

const envMap = {
  prod: {
    envKey: 'prod-3g0c541z90544ce3',
    serviceKey: 'koa-6c9z'
  },
  dev: {
    envKey: 'dev-6gv67pv842cd4ceb',
    serviceKey: 'koa-h83h'
  }
}

const getLocalEnv = () => {
  if (debugProd) {
    return envMap.prod
  }
  let env;
  try {
    var value = wx.getStorageSync('env')
    if (!value) {
      const { miniProgram: { envVersion } }  = wx.getAccountInfoSync()
      env = envVersion === 'release' ? 'prod' : 'dev'
      wx.setStorage({
        key: "env",
        data: env
      })
      console.log('env', env, envVersion)
    } else {
      env = value
    }
  } catch (e) {
    env = defaultEnv
  }
  const res = envMap[env]
  return res || envMap[defaultEnv]
}

let init = false;

const wxCloudApi = async({ url = '', method = 'GET', data = {}, header = {} }) => {
  if (!init) {
    wx.cloud.init();
    init = true;
  }
  
  const { envKey, serviceKey } = getLocalEnv()
  const { statusCode, data: res } = await wx.cloud.callContainer({
    "config": {
      "env": envKey
    },
    "path": url,
    "header": {
      "X-WX-SERVICE": serviceKey,
      ...header,
    },
    "method": method,
    "data": data,
    "timeout": 60000
  });

  if (statusCode === 200) {
    return res;
  } else {
    wx.showToast({
      title: '服务繁忙请稍等',
      icon: 'error',
      duration: 2000
    })
  }
}

export default wxCloudApi;
