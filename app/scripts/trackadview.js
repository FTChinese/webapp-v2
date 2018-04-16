var gViewableAds = [];
var gCurrentScroller = '';
var gHeaderHeight = 44;
var gBottomBarHeight = 45;
var w = window;
var d = document;
var e = d.documentElement;
var g = d.getElementsByTagName('body')[0];
var windowHeight = w.innerHeight|| e.clientHeight|| g.clientHeight;
var gAdImpressionExpose = 0.5;
var gScrollerHeight = windowHeight - gBottomBarHeight;
var gUserType = 'visitor';

function adViewUpdate() {
  var scrollTop = document.getElementById(gCurrentScroller).scrollTop;
  //console.log (gCurrentScroller + ': ' + scrollTop + '/' + gNowView);
  for (var adCount = 0; adCount < gViewableAds.length; adCount ++ ) {
    // if inViewScrollTop <= 0, the top is in view
    var inViewScroll = gViewableAds[adCount].top - gScrollerHeight + gHeaderHeight - scrollTop + gViewableAds[adCount].height * gAdImpressionExpose;
    var outViewScroll = gViewableAds[adCount].top + gViewableAds[adCount].height - gHeaderHeight - scrollTop - gViewableAds[adCount].height * gAdImpressionExpose;
    var isInView = (inViewScroll <= 0 && outViewScroll >= 0 && !document.hidden);
    var currentTime = new Date();
    var timeStamp = currentTime.getTime();
    var adch = '';
    var adPosition = '';
    //document.getElementById('header-title').innerHTML = inViewScroll + ' | ' + outViewScroll + ' | ' + isInView;
    //console.log (inViewScroll + ' | ' + outViewScroll + ' | ' + isInView);
    if (isInView === true) {
      //document.getElementById('header-title').innerHTML = gViewableAds[adCount].adid + ': ' + gViewableAds[adCount].status;
      if (gViewableAds[adCount].status === 'created') {
        gViewableAds[adCount].timeStamp = timeStamp;
        gViewableAds[adCount].status = 'viewing';
        setTimeout(adViewUpdate,1000);
      } else if (gViewableAds[adCount].status === 'viewing') {
        //var kkkk = timeStamp - gViewableAds[adCount].timeStamp;
        // document.getElementById('header-title').innerHTML = (typeof gViewableAds[adCount].timeStamp === 'number' && timeStamp - gViewableAds[adCount].timeStamp >= 999);
        // console.log (timeStamp + '-' + gViewableAds[adCount].timeStamp);
        // console.log (timeStamp - gViewableAds[adCount].timeStamp);
        if (typeof gViewableAds[adCount].timeStamp === 'number' && timeStamp - gViewableAds[adCount].timeStamp >= 999) {
          if (typeof gViewableAds[adCount].adid === 'string' && gViewableAds[adCount].adid.length === 8) {
            gViewableAds[adCount].status = 'viewed';
            adch = gViewableAds[adCount].adid.substring(0,4);
            adPosition = gViewableAds[adCount].adid.substring(4,8);
            // console.log (gViewableAds[adCount].adid + ' is viewed. adchi is ' + adch + ', ad position is ' + adPosition);
            //document.getElementById('header-title').innerHTML = adch + adPosition;
            ga('send','event', 'Ad In View', adch, adPosition, {'nonInteraction':1});
            playVideoInAdIframe(adch + adPosition);
          }
        }
      }
    } else if (gViewableAds[adCount].status !== 'viewed') {
      gViewableAds[adCount].status = 'created';
    }
  }
}


function createViewableAds() {
  // initiate the array for all viewable ad units
  gViewableAds = [];
  // make sure gNowView matches gCurrentScroller
  if (gNowView === 'fullbody') {
    gCurrentScroller = 'homeScroller';
  } else if (gNowView === 'storyview') {
    gCurrentScroller = 'storyScroller';
      scrollEle(storyScroller, 'storyScroller');
  } else if (gNowView === 'channelview') {
    gCurrentScroller = 'channelScroller';
  }
  var viewablesCollection = document.getElementById(gCurrentScroller).querySelectorAll('.adiframe');
  for (var adCount=0; adCount < viewablesCollection.length; adCount ++) {
    //console.log (viewablesCollection[adCount]);
    var currentViewableAd = {};
    currentViewableAd.top = viewablesCollection[adCount].offsetTop || '';
    currentViewableAd.height = viewablesCollection[adCount].offsetHeight || 0;
    currentViewableAd.status = 'created';
    if (typeof currentViewableAd.top === 'number' && currentViewableAd.top >= 0) {
      //gViewableAds['ad-' + gNowView + adCount] = currentViewableAd;
      currentViewableAd.id = 'ad-' + gNowView + adCount;
      gViewableAds.push(currentViewableAd);
    }
  }
}

function updateViewableAdId(containerId, adId) {
  for (var adCount=0; adCount < gViewableAds.length; adCount ++) {
    if (gViewableAds[adCount].id === containerId) {
      gViewableAds[adCount].adid = adId;
      gViewableAds[adCount].status = 'created';
    }
  }
}

function updateViewableAdSize() {
  for (var adCount=0; adCount < gViewableAds.length; adCount ++) {
    if (document.getElementById(gViewableAds[adCount].id)) {
      gViewableAds[adCount].top = document.getElementById(gViewableAds[adCount].id).offsetTop || '';
      gViewableAds[adCount].height = document.getElementById(gViewableAds[adCount].id).offsetHeight || 0;
    }
  }
}

function startTrackingAdViews(scrollerId) {
  gCurrentScroller = scrollerId;
  createViewableAds();
  // try remove event listener to avoid adding multiple event listeners
  try {
    document.getElementById(scrollerId).removeEventListener('scroll', adViewUpdate);
  } catch (ignore) {

  }
  document.getElementById(scrollerId).addEventListener('scroll', adViewUpdate);
  //console.log (scrollerId + ' scroll event listened');
}

function getAdChannelId() {
  //var matchSpecial = false;

  if (window.gSpecialAnchors && window.gSpecialAnchors.length > 0 && window.gTagData.length >0) {
    for (var i=0; i < window.gSpecialAnchors.length; i++) {
        // MARK: - this is added per request of ad sales
        // MARK: - to exclude situations where ad sales don't want to invoke sponsored special report code
        var useSpecialCode = true;
        try {
            if (gNowView === 'storyview' && window.gSpecialAnchors[i].adid === '2062') {
                useSpecialCode = false;
            }
        } catch (ignore) {
            
        }
        var keywordsOfCurrentPage = window.gTagData;
        var keywordForCheck = window.gSpecialAnchors[i].tag;
        if (keywordForCheck.indexOf('http') >= 0 && window.gSpecialAnchors[i].channel) {
            keywordForCheck = window.gSpecialAnchors[i].channel;
        }

        if (useSpecialCode === true && keywordsOfCurrentPage.indexOf(keywordForCheck) >=0) {
            return window.gSpecialAnchors[i].adid;
            //matchSpecial = true;
        }
    }
  }
  return '1000';
}


// MARK: - 刷新广告位
var gInsertedDBSourceScript = false;
function insertDBSourceScript() {
  if (!gInsertedDBSourceScript) {
    var adChannelId = getAdChannelId();
    var headEl = document.getElementsByTagName('head')[0];
    var dbSourceScript = document.createElement('script');
    var dbSource = ' googletag.cmd.push(function() { '
            + 'var gptadslots = [];'
            + 'gptadslots.push(googletag.defineSlot("/80682004/AndroidApp-4000/4000' 
            +  adChannelId +'0301", [[320,80],[375, 94],[414, 104]], "Mobile-Banner-Num1"). addService(googletag.pubads()));'
            
            + 'gptadslots.push(googletag.defineSlot("/80682004/AndroidApp-4000/4000' 
            +  adChannelId +'0401", [300,250], "Mobile-MPU-Middle1"). addService(googletag.pubads()));'

            + 'gptadslots.push(googletag.defineSlot("/80682004/AndroidApp-4000/4000' 
            +  adChannelId +'0302", [[320,80],[375, 94],[414, 104]], "Mobile-Banner-Num2"). addService(googletag.pubads()));'
            
        

            + 'googletag.pubads().enableSingleRequest();'
            + 'googletag.pubads().disableInitialLoad();'
            + 'googletag.enableServices();'
            + 'googletag.pubads().refresh(gptadslots);'
            + '});'
    dbSourceScript.innerHTML = dbSource;
    headEl.appendChild(dbSourceScript);
    gInsertedDBSourceScript = true;
  }
}


function updateAds() {
   console.log('execute updateAds');
   insertDBSourceScript();
    var nowV = gNowView;
    var isColumnFlow = false;
    var currentViewPortAds;
    if (nowV !== 'storyview') {
        gSpecial = false;
    }
    // there are two possibilities when display storyview
    // if (nowV === 'storyview') {
    //     if ($('#storyview').hasClass('columnFlowOn')) {
    //         nowV = 'story-column-flow';
    //         isColumnFlow = true;
    //     } else {
    //         nowV = 'storyScroller';
    //     }
    // }
    if (isOnline() === 'possible') {        
        screenWidth = $(window).width();
        if (nowV === 'story-column-flow') {
            currentViewPortAds = $('#'+nowV).find('.cf-render-area .adiframe');
        } else {
            currentViewPortAds = $('#'+nowV).find('.adiframe');
        }
        nowV = nowV.replace(/\-/g, '');
        // console.log (nowV);
        // console.log('currentViewPortAds:');
        // console.log(currentViewPortAds);
        
        currentViewPortAds.each(function(index) {
            var adHeight=$(this).attr('type') || 0;
            var adFrame=$(this).attr('frame') || '';
            var adwidth=$(this).attr('adwidth') || '300';
            var FrameID;
            var adOverlay='';
            var forPhone;
            if (adHeight !== 'fullwidth' && adHeight !== '50') {
              adHeight = parseInt(adHeight,10);
            } else {
              adwidth = '100%';
            }
            forPhone = ($(this).hasClass('for-phone') === true) ? true : false; 
            
            if ((adHeight === 'fullwidth' && screenWidth<=490) || (adHeight>90 && screenWidth>=700 && forPhone===false) || (adHeight<90 && screenWidth<700) || (adHeight === 90 && (screenWidth===768 || screenWidth===1024)) || (forPhone === true && screenWidth<700) || adHeight ===0) {
                if ($(this).find('iframe').length>0) {
                    FrameID = $(this).find('iframe').eq(0).attr('id');
                    document.getElementById(FrameID).contentDocument.location.reload(true);
                } else {
                    if (useFTScroller===1 || nowV === 'story-column-flow') {
                        adOverlay = '<a target=_blank class="ad-overlay"></a>';
                    }
                    //console.log('hereherehere');
                    $(this).html('<iframe id="' + nowV + index + '" src="/phone/ad.html?isad=0&v=' + _currentVersion + '#adtype=' + adFrame + '&adid=' + nowV + index + '" frameborder=0  marginheight="0" marginwidth="0" frameborder="0" scrolling="no" width="'+adwidth+'" height="100%"></iframe>' + adOverlay);
                    //console.log ($(this).html());
                    $(this).attr('id','ad-' + nowV + index);

                    /**Display DB Ad Start**/
                    var adChannelId = getAdChannelId();
                    var adName; 
                    if (adFrame === 'banner-bottom-home' || adFrame === 'banner-bottom-story') {
                      adName = 'Mobile-Banner-Num2'
                    } else if (adFrame === 'ad300' || adFrame === 'ad300x90') {
                      adName = 'Mobile-Banner-Num1'; 
                    } else if (adFrame === 'banner-paid-post-home') {
                      adName = 'Information-Num1'
                    } else if (adFrame === 'banner-paid-post-home-2') {
                      adName = 'Information-Num2'
                    } else if (adFrame =='ad300x600-SP' || adFrame ==='ad300x600' || adFrame === 'ad300x250' || adFrame === 'ad300x250-e' || adFrame === 'ad300x250-home' || adFrame === 'ad300x250-story') {
                      adName = 'Mobile-MPU-Middle1';
                    } else if (adFrame === 'ad300x250-SP' || adFrame === 'ad300x250-2' || adFrame === 'ad300x250-story-bottom' || adFrame === 'ad300x250-story-vw') {
                      adName = 'Mobile-MPU-Middle2';
                    }

                    var adClass = 'db-ad';
                    if(adName === 'Mobile-Banner-Num1' || adName === 'Mobile-Banner-Num2') {
                      adClass += ' db-mobile-banner';
                    } else if(adName === 'Mobile-Information-Num1' || adName === 'Mobile-Information-Num2') {
                        adClass += ' db-mobile-information';
                    }

                    
                    // if (window.location.search.indexOf('testDB=yes') > 0 && (adName === 'Mobile-Banner-Num1' || adName === 'Mobile-Banner-Num2' || adName === 'Mobile-MPU-Middle1') && adChannelId === '1000') {
                    //   var adCode = '<div id="'+ adName + '" class ="' + adClass + '"style="padding-top:0;"><scr' + 'ipt>googletag.cmd.push(function() { googletag.display("' + adName + '")})<\/scr' + 'ipt></div>';
                    //   $(this).html(adCode);            
                    // }
                    /**Display DB Ad End */
                }
            }
            if (useFTScroller === 1 || nowV === 'story-column-flow') {
                if ($(this).offset().top >= 0 && $(this).offset().top <= screenWidth) {
                    $(this).addClass('loaded-in-view');
                } else {
                    $(this).removeClass('loaded-in-view');
                }
            }
        });


      // MARK: - when ad position is updated, create the ad positions again. 
      createViewableAds();
    }
}

/* Test for DB
function insertDBRequests() {
  var nowV = gNowView;
    var isColumnFlow = false;
    var currentViewPortAds;


      if (nowV === 'story-column-flow') {
          currentViewPortAds = $('#'+nowV).find('.cf-render-area .adiframe');
      } else {
          currentViewPortAds = $('#'+nowV).find('.adiframe');
      }
      nowV = nowV.replace(/\-/g, '');
      console.log (nowV);
      console.log('currentViewPortAds:');
      console.log(currentViewPortAds);
      currentViewPortAds.each(function(index) {
        console.log('thisAdPosition',$(this)[0]);
        console.log('googletag:', googletag);

        
        var adName = "Mobile-Banner-Num1";
        var adClass = 'db-ad';
        if(adName === 'Mobile-Banner-Num1' || adName === 'Mobile-Banner-Num2') {
          adClass += ' db-mobile-banner';
        } else if(adName === 'Mobile-Information-Num1' || adName === 'Mobile-Information-Num2') {
            adClass += ' db-mobile-information';
        }
        
        if (index === 0) {
          var adCode = ' <div id="'+ adName +'" class ="' + adClass + '"style="padding-top:0;"><scr'+'ipt>googletag.cmd.push(function() { googletag.display("'+ adName +'")})</scr'+'ipt></div>';

          $(this).html(adCode);            
          console.log('insertAdCode');
        }
      });
    
}
function updateAdsDB() {
  insertDBSourceScript();
  insertDBRequests();
}
*/

function playVideoInAdIframe(adId) {

  // console.log ('look for this id ' + adId + ' and play video');
  var theAdDiv = document.querySelector('[data-adid="'+ adId + '"]');

  // console.log (theAdDiv);

  // TODO: Find the video in the ad iframe dom and play it

  if (!theAdDiv.classList.contains('mpu-phone')) {
    // console.log(theAdDiv.id);
    // console.log('Not the video ad section. Abort.');
    return;
  }

  // console.log(theAdDiv.id + ' might contain video ad. Send play command.');
  var iframeEl = theAdDiv.querySelector('iframe');
  // console.log(iframeEl);
  var msg = {
    action: 'play'
  };

  iframeEl.contentWindow.postMessage(JSON.stringify(msg), '*');
}

window.addEventListener('message', function(msg) {
	var data;
	var iframeEl;
	var iframeSelector;

	try {
		data = JSON.parse(msg.data);
	} catch (e) {
		console.log(e);
		return;
	}

	data.url = data.url.replace(location.protocol + '\/\/' + location.host, '');
	iframeSelector = 'iframe[src="' + data.url + '"]';

	iframeEl = document.querySelector(iframeSelector);

  // console.log('iframe is: ' + iframeEl.id + ', is video ad: ' + data.type);

	if (data.type === 'video' && iframeEl) {
		// Check whether there is an overlay.
		var parentEl = iframeEl.parentElement;
		if (!parentEl) {
			return;
		}
		var overlayLinkEl = parentEl.querySelector('a');

		if (!overlayLinkEl) {
			return;
		}
		// console.log('Find overlay link, remove it.');
		parentEl.removeChild(overlayLinkEl);
	}
});



