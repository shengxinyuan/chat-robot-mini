const login = async() => {
  const res = await wx.login()
  return res
}

export default login;
