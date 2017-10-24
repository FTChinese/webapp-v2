function writeAdNew(obj) {
  /**
   * @param obj 
   * @param obj.devices: TYPE Array, the devices are allowed to show this ad, Eg:['PC','PadWeb','iPhoneWeb','AndroidWeb']
   * @param obj.pattern: TYPE String,the key string of var adPattern, Eg：'FullScreen'、'Leaderboard'
   * @param obj.position：TYPE String, the key string of var adPattern.xxx.position,Eg: 'Num1','Right1','Middle2'
   * @param obj.container: TYPE String, the container specified for the ad position in a certain page. The priority of obj.container is the highest among obj.container,adPattern.container and 'none'
   */
  //MARK: First, get the adid
  var iframeHTML = '';
  var debugString = '';
  var adid = '';
  var deviceType = 'PC';
  var deviceId = '';
  var bannerBG = '';
  var adDescription = '';
  
  // MARK: determin device type
  /*
  if (/iPad/i.test(uaString)) {
    deviceType = 'PadWeb';
  } else if (/OS [0-9]+\_/i.test(uaString) && (/iPhone/i.test(uaString) || /iPod/i.test(uaString))) {
    deviceType = 'iPhoneWeb';
  } else if (/Android|micromessenger/i.test(uaString) || w1 <= 490) {
    deviceType = 'AndroidWeb';
  }
  */
  deviceType = 'iPhoneWeb';
  
  // MARK: If device does not fit, return immediately
  if (obj.devices.indexOf(deviceType) < 0) {
    return '';
  }

  deviceId = adDevices[deviceType].id;
  console.log(deviceId);

  // MARK: Get ad channel id from smarty server side
  /*
  var adch = adchID;
  var adchURL = window.location.href.replace(/^.*adchannelID=([0-9]{4}).*$/g,'$1');
  var fromURL = false;
  if (/^[0-9]{4}$/.test(adchURL)) {
    adch = adchURL;
    fromURL = true;
  }
  if (typeof(window.FTadchannelID)!=='undefined' && window.FTadchannelID && !fromURL) {
    adch = window.FTadchannelID;
  }
  var adChannelId = adch||'1000';
  */
  var adChannelId='1000';
  

  console.log(adDevices[deviceType]);
  console.log(obj.pattern);
  var adPattern = adDevices[deviceType].patterns[obj.pattern];
  console.log(adPattern);
  var adPatternId = adPattern.id;
  var adPositionId = adPattern.position[obj.position].id;
  var adWidth = adPattern.width || '100%';
  var adHeight = adPattern.height || '50';
  var containerType = obj.container || adPattern.container || 'none';
  
  adid = deviceId + adChannelId + adPatternId + adPositionId;


  if (window.pageTheme === 'luxury') {
    bannerBG = '&bg=e0cdac';
  } else if (window.pageTheme === 'ebook') {
    bannerBG = '&bg=777777';
  }

  var iframeSrc = '/phone/a.html?v=20161009143608' + bannerBG + '#adid='+ adid + '&pid=' + adid;
  iframeHTML = '<iframe class="banner-iframe" data-adch="'+adChannelId+'" data-adPosition="'+ adPatternId + adPositionId+'" id="ad-' + adid + '" width="'+ adWidth +'" height="'+ adHeight + '" frameborder="0" scrolling="no" marginwidth="0" marginheight="0" src="'+ iframeSrc +'" data-src="'+ iframeSrc +'" data-ad-type="'+ adPatternId + adPositionId +'" data-ad-count=0></iframe>';
  
  
  if (window.gDebugAd && typeof window.gDebugAd === 'string') {
    //MARK:找出channel的describtion
    var topChannelId = adChannelId.substring(0,2);
    var subChannelId = adChannelId.substring(2,4);
    var adChannel = adDevices[deviceType].channels;
    var subChannels = {};
    var topChannelTitle = '';
    var subChannelTitle = '';
    for(var prop in adChannel) {
      var propObj = adChannel[prop];
      if(propObj.id === topChannelId) {
        topChannelTitle = propObj.title;
        subChannels = propObj.sub;
      }
    }
    for(var subProp in subChannels) {
      var subPropObj = subChannels[subProp];
      if(subPropObj.id === subChannelId) {
        subChannelTitle = subPropObj.title;
      }
    }

    adDescription = deviceType + '-' + topChannelTitle + '-' + subChannelTitle + '-' + obj.pattern + '-' + obj.position;
    debugString = window.gDebugAd.replace('adcode_for_debug', adid + ': ' + adDescription);
  }

  iframeHTML += debugString;

  if (containerType === 'banner') {
    iframeHTML = '<div class="bn-ph"><div class="banner-container"><div class="banner-inner"><div class="banner-content">' + iframeHTML + '</div></div></div></div>';
  } else if (containerType === 'mpu') {
    iframeHTML = '<div class="mpu-container">' + iframeHTML + '</div>';
  } else if (containerType === 'mpuInStroy') {
    iframeHTML = '<div class="mpu-container-instory">' + iframeHTML + '</div>';
  } 
  return iframeHTML;
}