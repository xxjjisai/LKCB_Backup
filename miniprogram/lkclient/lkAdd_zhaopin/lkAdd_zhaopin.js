// miniprogram/lkclient/lkAdd_zhaopin/lkAdd_zhaopin.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAgree: false,  
    zkShopName:"老马家牛肉面",
    zkIcon:"icon_nav_special",
    zkShopInfo:"由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。",
    zkisAgree: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  showTopTips: function(){
    var zkShopName = this.data.zkShopName;
    var zkShopInfo = this.data.zkShopInfo; 
    var zkIcon = this.data.zkIcon;
    var timestamp = Date.parse(new Date());

    const db = wx.cloud.database()
    db.collection('lk_add_zhaopin').add({
      data: {
        zkShopName:zkShopName,
        zkIcon:zkIcon,
        zkShopInfo:zkShopInfo,
        timestamp:timestamp
      },
      success: res => { 
        console.log('[数据库] [新增记录] 成功，记录 res: ', res)
        wx.switchTab({
          url: '/lkclient/lkIndex/lkIndex',
          success:(res)=>{},
          fail:(err)=>{},
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    }) 
  },
  zkOnShopName: function(e){
    this.setData({
        zkShopName: e.detail.value
    });
  },
  zkOnShopInfo: function(e){
    this.setData({
      zkShopInfo: e.detail.value
    });
  },
})