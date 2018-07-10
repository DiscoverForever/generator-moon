import AV from 'leancloud-storage'
export default {
  install(Vue, options) {
    AV.init({
      appId: '<%= config.leancloudAppId %>',
      appKey: '<%= config.leancloudAppKey %>'
    })
  }
}
