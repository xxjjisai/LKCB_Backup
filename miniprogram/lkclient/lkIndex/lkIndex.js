// miniprogram/pages/lkAdmin/lkAdmin.js

const app = getApp();
import QQMapWX from '../../libs/qqmap-wx-jssdk.min.js';
var qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    city:"",
    province:'',
    latitude:'',
    longitude:'',
    inputShowed: false,
    inputVal: "",
    zkSerchShowLong:220,
    openid:"",
    zkFunc:[
      {name:"发布需求"},
      {name:"商家入驻"},
      {name:"广告加盟"},
      {name:"关于我们"},
    ],
    zkShopName:[
      {name:"重庆鸡公煲"},
      {name:"固始鹅块"},
      {name:"新疆烤肉"},
      {name:"四川小小"},
      {name:"串串香"},
      {name:"麻辣火锅"},
      {name:"尽头巴脑"},
      {name:"胖哥俩蟹肉包"},
    ],
    // tabs: ["转让求租", "求职招聘", "商家信息","广告加盟"],
    tabs: ["转让求租", "求职招聘"],
    zktbCanYin:[],
    zktbZhaoPin:[],
    zktbJanKang:[],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    circular: false,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,

    zk_limit:10,
    // 全局列表页数用来统计当前加载到多少页（下拉，初始化）
    zk_ZhuanRang_Page:0,
    zk_ZhaoPin_Page:0

  },

  //点击tap或者下拉刷新，重新初始化页面并且加载列表到最新
  pageBottomConcat:function(){
    this.setData({
      zk_ZhuanRang_Page:0,
      zktbCanYin: [],
      zk_ZhaoPin_Page:0,
      zktbZhaoPin: []
    });
  },

  // 上拉列表加载更多的列表项
  pageUpdateConcat:function(){
    var zk_ZhuanRang_Page = this.data.zk_ZhuanRang_Page;
    var zk_ZhaoPin_Page = this.data.zk_ZhaoPin_Page;
    var zk_limit = this.data.zk_limit;
    this.setData({
      zk_ZhuanRang_Page:zk_ZhuanRang_Page+zk_limit,
      zk_ZhaoPin_Page:zk_ZhaoPin_Page+zk_limit
    });
  },

  // 滚动试图
  changeProperty: function (e) {
    var propertyName = e.currentTarget.dataset.propertyName
    var newData = {}
    newData[propertyName] = e.detail.value
    this.setData(newData)
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("app.globalData.openid",app.globalData.openid)
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
    qqmapsdk = new QQMapWX({
      key:'NREBZ-CPGWQ-ASU5P-GBICN-JUAKO-ZYFPY'
    }); 
  },

  onQueryListInfo:function(){
    var type = this.data.activeIndex;
    if (type == 0 ){
      this.onQueryZhuanRangList();
    }else if (type == 1 ){
      this.onQueryZhaoPinList();
    }
  },

  onQueryZhuanRangList:function(){
    var old_zktbCanYin = this.data.zktbCanYin;
    var page = this.data.zk_ZhuanRang_Page;
    var zk_limit = this.data.zk_limit;
    const db = wx.cloud.database()
    const _ = db.command
    // 查询当前用户所有的 lk_add_zhuanrang
    db.collection('lk_add_zhuanrang')
    .where({
      // _openid: this.data.openid
      // zkIcon: _.eq("con_nav_special")
    })
    .orderBy('timestamp', 'desc')
    .skip(page)
    .limit(zk_limit)
    .get({
      success: res => {
        var tbList = old_zktbCanYin.concat(res.data);
        this.setData({
          zktbCanYin: tbList,
        })
        console.log('[数据库] [查询记录] 餐饮信息 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })

  },

  onQueryZhaoPinList:function(){
    const db = wx.cloud.database()
    var old_zktbZhaoPin = this.data.zktbZhaoPin;
    var page = this.data.zk_ZhaoPin_Page;
    var zk_limit = this.data.zk_limit;
    console.log("this.data.openid",this.data.openid)
    // 查询当前用户所有的 lk_add_zhuanrang
    db.collection('lk_add_zhaopin').where({
      // _openid: this.data.openid
    })
    .orderBy('timestamp', 'desc')
    .skip(page)
    .limit(zk_limit)
    .get({
      success: res => { 
        var tbList = old_zktbZhaoPin.concat(res.data);
        this.setData({
          zktbZhaoPin: tbList
        })
        console.log('[数据库] [查询记录] 招聘信息 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })

  },

  tabClick: function (e) {
    this.pageBottomConcat();
    console.log("e.currentTarget.id",e.currentTarget.id)
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    this.onQueryListInfo();
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
    this.getUserLocation();
    this.pageBottomConcat();
    this.onQueryZhuanRangList(); 
    this.onQueryZhaoPinList();
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
    this.pageBottomConcat();
    this.onQueryListInfo();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.pageUpdateConcat();
    this.onQueryListInfo();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //----------------------------------
  //搜索 
  showInput: function () {
    // console.log("showInput")
      this.setData({
          inputShowed: true,
          zkSerchShowLong:10
      });
  },
  hideInput: function () {
    // console.log("hideInput")
      this.setData({
          inputVal: "",
          inputShowed: false,
          zkSerchShowLong:220
      });
  },
  clearInput: function () {
    // console.log("clearInput")
      this.setData({
          inputVal: ""
      });
  },
  inputTyping: function (e) {
    // console.log("inputTyping")
      this.setData({
          inputVal: e.detail.value
      });
  },
  //----------------------------------

  // 定位
  getLocation:function (){
    wx.getLocation({
      type:'wgs84',
      success:(res)=>{
        console.log('success x ' + JSON.stringify(res))
        var latitude = res.latitude;
        var longitude = res.longitude;
        var speed = res.speed;
        var accuracy = res.accuracy;
        this.getLocal(latitude,longitude);
      },
      fail:(res)=>{
        console.log('fail' + JSON.stringify(res))
      }
    })
  },

  getLocal:function (latitude,longitude){
    qqmapsdk.reverseGeocoder({
      location:{
        latitude:latitude,
        longitude:longitude
      },
      success:(res)=>{
        console.log('getLocal success' + JSON.stringify(res))
        let province = res.result.ad_info.province;
        let city = res.result.ad_info.city;
        this.setData({
          city:city,
        })
      },
      fail:(res)=>{
        console.log('getLocal fail' + JSON.stringify(res))
      }
      // complete:(res)=>{
      //   console.log('getLocal complete' + JSON.stringify(res))
      // }
    })
  },

  getUserLocation:function(){
    wx.getSetting({
      success:(res)=>{
        console.log(JSON.stringify(res))

        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权

        if(res.authSetting["scope.userLocation"] != undefined && 
           res.authSetting["scope.userLocation"] != true)
        {
          wx.showModal({
            title:'请求授权当前位置',
            content:'需要获取您的地理位置，请确认授权',
            success:(res)=>{
              if(res.cancel)
              {
                wx.showToast({
                  title:'拒绝授权',
                  icon:'none',
                  duration:1000
                })
              }
              else if(res.confirm)
              {
                wx.openSetting({
                  success:(dataAu)=>{
                    console.log('openSetting success' + JSON.stringify(dataAu))
                    if(dataAu.authSetting["scope.userLocation"] == true)
                    {
                      wx.showToast({
                        title:'授权成功',
                        icon:'none',
                        duration:1000
                      })
                      this.getLocation();
                    }
                    else 
                    {
                      wx.showToast({
                        title:'授权失败',
                        icon:'none',
                        duration:1000
                      })
                    }
                  },
                  // fail:(dataAu)=>{
                  //   console.log('openSetting fail' + JSON.stringify(dataAu))
                  // },
                })
              }
            },
            fail:(res)=>{
              console.log('getUserLocation fail' + JSON.stringify(res))
            },
          });
        }
        else if (res.authSetting["scope.userLocation"] == undefined)
        {
          this.getLocation();
        }
        else
        {
          this.getLocation();
        }
      },
      fail:(res)=>{
        console.log('getUserLocation fail' + JSON.stringify(res))
      },
    })
  }
})