function initSwipeGesture() {




    // doms for swipables
    var swipables = {
        // attach touchstart, touchmove and touchend to the container
        'container': document.getElementById('fullbodycontainer'),
        // navigation menu
        'navOverlay': document.getElementById('navOverlay'),
        // slide show
        'slideShow': document.getElementById('slideShow'),
        // fullbody view
        'fullbody': document.getElementById('fullbody'),
        // story view
        'storyview': document.getElementById('storyview'),
        // channel view
        'channelview':document.getElementById('channelview')
    };

    /*******测试代码:start********
    var testDiv = document.createElement("div");

    testDiv.id = "monitor";
    testDiv.setAttribute("style","position:fixed;z-index:10000;width:260px;height:450px;right:10px;bottom:10px;background-color:white;color:black;display:block;");

    testDiv.innerHTML = '<div id="monitor1"></div><div id="monitor2"></div><div id="monitor3"></div><div id="monitor4"></div><div id = "monitor5"></div><div id = "monitor6"></div><div id = "monitor7"></div>';

    document.body.appendChild(testDiv);

    var monitor1 = document.getElementById("monitor1");
    var monitor2 = document.getElementById("monitor2");
    var monitor3 = document.getElementById("monitor3");
    var monitor4 = document.getElementById("monitor4");
    var monitor5 = document.getElementById("monitor5");
    var monitor6 = document.getElementById("monitor6");
    var monitor7 = document.getElementById("monitor7");
    ******测试代码:end*********/


    // initial parameters
    var _touchStartX = -1;
    var _touchMoveX = -1;
    var _touchStartY = -1;
    var _touchMoveY = -1;
    //swipe  at least _minSwipe px to go back
    var _minSwipe = 72;
    // when you swipe at least _startSwipe px
    // you are locked in the horizontal swipe mode
    // vertical scroll (native) will be disabled
    // using preventDefault()
    var _startSwipe = 15;

    // if a user is scrolling vertically
    var _minVerticalScroll = 30;
    // var _isSwiping = false;

    // there are three possibility to moveStatus: unknown, swipe, scroll
    var _moveStatus = 'unknown'; 
   
    // Determine the browser engine and prefix, trying to use the unprefixed version where available.

    var _transformProperty = gPrefix.transformProperty;
    var _transitionProperty = gPrefix.transitionProperty;

    // meature width of navigation
    var _navListWidth = document.getElementById('navList').offsetWidth || 270;//这就是导航菜单的宽度

    // meature width of screen
    //var _screenWidth = screen.width;
    var _screenWidth = document.body.clientWidth;
    // 这一页记为
    //gNowView = document.body.className;
    // 上一页记为_PreView
    var _preView = "";
    var _histDelStory = [];
    var _histDelStoryNum = 0;

    var _touchStartT;
    var _touchEndT;
    var _touchMoveT;

    var baseView="";
    var _eventHistory = [];
    
	var _speedThred = 0.36;//单位是px/ms,算法是180px/500ms=0.36
    var _timeSpentThres = 200;//单位ms,滑动时间阈值，如果滑动时间小于timeSpentThres，则按快速情况处理
    
    var a = 1;//针对restTms的参数,越小，快速滑动情况滑动越快;
    var a2 = 1;//针对restTms2的参数

    var decelerateTimeOut;

    /*************处理前缀问题block:start*************/
    ///要保证transform/transition前缀在js和css中完全一致
    ///已移至autoPrefix.js文件
    /***********处理前缀问题block:end*********/
    var removeAllTransf = function(){    	
        swipables.navOverlay.style[_transformProperty]=null;
        swipables.fullbody.style[_transformProperty]=null;
        swipables.storyview.style[_transformProperty]=null;
        swipables.channelview.style[_transformProperty]=null;
    };

    var removeAllTransi = function(){
        swipables.navOverlay.style[_transitionProperty]=null;
        swipables.fullbody.style[_transitionProperty]=null;
        swipables.storyview.style[_transitionProperty]=null;
        swipables.channelview.style[_transitionProperty]=null;
    };
    var removeAllTransfAndTransi = function(){

        swipables.navOverlay.style[_transformProperty]=null;
        swipables.navOverlay.style[_transitionProperty]=null;

        swipables.fullbody.style[_transformProperty]=null;
        swipables.fullbody.style[_transitionProperty]=null;

        swipables.storyview.style[_transformProperty]=null;
        swipables.storyview.style[_transitionProperty]=null;

        swipables.channelview.style[_transformProperty]=null;
        swipables.channelview.style[_transitionProperty]=null;
    };

    /*****测试用:start*****/
    /*
     * @param view:swipables.navOverlay,swipables.fullbody,swipables.storyview,swipables.channelview
     * @param monitorSection:monitor1~monitor7
    */
    var setRealInnerHTML = function(view,monitorSection) {
        if(view === swipables.navOverlay||swipables.fullbody||swipables.storyview||swipables.channelview){
             monitorSection.innerHTML= 'realTransition:'+window.getComputedStyle(view)[_transitionProperty]+'\n'+
                                    'realTransform: '+window.getComputedStyle(view)[_transformProperty];
        } 
    };
    /*****测试用:end*****/

    // turn off this feature for Android because there's bug

    if (window.useFTScroller === 1) {
        try {

            swipables.container.addEventListener('touchstart', function(e) {
                // gNowView reflects the current view
                // update it from document.body anyway
                // in case other parts of the code has bugs
                //setEventInnerHTML(e);
                //monitorEventBegin.innerHTML="startEventBeginisSwipe:"+_isSwiping;
                gNowView = document.body.className;

                // MARK: - replace the extra class from the gNowView to deal with iap channels and detail pages
                gNowView = gNowView.replace(/ .*$/g, '');

                baseView = gNowView;

                //_screenWidth = screen.width;
                _screenWidth = document.body.clientWidth;
                _touchStartT = e.timeStamp;//这样直接得到时间戳，而不用(new Date()).getTime()


                // when touchstart, reset the swiping status
                // _isSwiping = false;

                // if (_moveStatus === 'decelerating') {
                //     _moveStatus = 'decelerated';
                // } else {
                //     _moveStatus = 'unknown';
                // }

                _moveStatus = 'unknown';


                /// 过滤掉hist数组中的文章页信息，这样就只留下了频道页信息

                // console.log ('print hist: ');
                // console.log (hist);
                _histDelStory = hist.filter(function(item){
                    return (item.url.indexOf("story") == -1);
                });
               

                if (gNowView == 'storyview') {
                     _histDelStoryNum = _histDelStory.length;
                    // MARK: - 只有从主页点进来的文章，_histDelStoryNum才等于1
                    if (_histDelStoryNum === 0) {
                        _preView = 'fullbody';
                    } else {
                        _preView = 'channelview';
                    }
                    //console.log ('clicked from ' + _preView);
                }
                
                // if 1. user is swiping on an FTScroller like the horizonal navigation on home
                // or 2. user is viewing a slide show
                // no need to trigger swiping gesture
                //monitorconsole.innerHTML="gFTScrollerActive:"+window.gFTScrollerActive+"\r"+"slideShowisOn: "+swipables.slideShow.className.indexOf(' on');
                if (typeof window.gFTScrollerActive === "object" || swipables.slideShow.className.indexOf(' on')>0) {//如果使用了FTScroller且使用了slideShow，则通过returnfalse终止这个事件处理函数的执行
                    _touchStartX = -1;
                    _touchStartY = -1;
                    return false;
                }
                _touchStartX = e.changedTouches[0].clientX;
                _touchStartY = e.changedTouches[0].clientY;

                _eventHistory.length = 0;
                _eventHistory.push({x:_touchStartX, y:_touchStartY,t: _touchStartT});

                 /**测试代码:start**
                    setRealInnerHTML(swipables.storyview,monitor1);
                    setRealInnerHTML(swipables.fullbody,monitor2);                
                    monitor3.innerHTML = "screen.width:"+screen.width+"\n"
                                        + "screen.availWidth:"+screen.availWidth+"\n"
                                        + "document.body.clientWidth:"+document.body.clientWidth;
                **测试代码：end**/

            }, false);

            swipables.container.addEventListener('touchmove', function(e) {
                //setEventInnerHTML(e);

                // horizontal move distance
                var xDistance;
                // vertical movement distance
                var yDistance;
               
                // 手指横向滑动的方向
                var xDirection;
                // 手指横向滑动的距离，for visual feedback
                var translateX;

                // 文章页的translatex:
                //var storyviewX;
                // 当前页面要退回的上级页面的translatex:
                var previewTranslateX;

                // if the user is locked in the swiping mode
                // disable vertical scrolling
                // this works for iOS 7 and above
                // if touchstart is tiggered while scrolling is decelerating, preventDefault will not work as expected
                if (_moveStatus === 'swipe') {
                	e.preventDefault();
                }

                // if the user is engaged in a FT Scroller activity
                // or if he is viewing a photo slide
                // abandon ensuing operations
                //如果使用了FTScroller且属于纵向滑动，或，使用了slideShow，或已经在纵向移动
                //则通过return false终止这个事件处理程序的执行
                if ( (typeof window.gFTScrollerActive === "object" && _moveStatus !== 'swipe') || swipables.slideShow.className.indexOf(' on')>0 || _moveStatus === 'scroll') {
                    _touchStartX = -1;
                    _touchMoveX = -1;
                    _touchStartY = -1;
                    _touchMoveY = -1;
                    return false;
                }
                _touchMoveX = e.changedTouches[0].clientX;//获取滑动过程中手指的横坐标位置
                _touchMoveY = e.changedTouches[0].clientY;//获取滑动过程中手指的纵坐标位置
                _touchMoveT = e.timeStamp;

                xDistance = Math.abs(_touchMoveX - _touchStartX);//手指横向滑动距离

                xDirection = (_touchMoveX-_touchStartX)>0? "toRight":"toLeft";

                yDistance = Math.abs(_touchMoveY - _touchStartY);//手指纵向滑动距离


                if (_touchStartX !== -1) {//当其等于-1就是要么用了FTScroller要么是slideShow，这时横向滑动应该是无效的
                    //whether the user is swiping or scrolling

                    if (xDistance > _startSwipe && typeof window.gFTScrollerActive !== "object" && yDistance < _minVerticalScroll && yDistance < 0.5 * xDistance && _moveStatus !== 'scroll') {
                        //当横坐标滑动距离超过15px，且没有用FTScroller，且纵坐标滑动距离不到30px，且x滑动距离比y滑动距离的两倍还多
                        //window.gFTScrollerActive = {};
                        _moveStatus = 'swipe';//这时被判定为确实是在进行横向滑动动作
                    } else if (yDistance >= _minVerticalScroll && _moveStatus !== 'swipe') {
                        _moveStatus = 'scroll';//这时被判定为确实是在进行竖向滑动动作
                    }
                    var moveTransitionProperty = 'all 0s ease-in-out';
                    // if the swiping is true
                    // provide visual feedback
                    if (_moveStatus === 'swipe') {

                        ///如果是处在首页的情况下：
                        if (gNowView === 'fullbody') {
                            // home page swiping to right
                            // reveal the navigation

                            if (swipables.navOverlay.className.indexOf(' on')==-1 && xDirection == "toRight") {//如果没有打开导航菜单
                                translateX = xDistance - _navListWidth;//手指划过的距离一旦大于菜单宽度，则不能再往外拉了
                                //拉开时往右滑：translateX小于0,绝对值越来越小，即其值越来越大，translate3d(translateX,0,0)才能向右
                              
                            } else if(swipables.navOverlay.className.indexOf('on')>-1 && xDirection == "toLeft") {
                                translateX = -xDistance;
                                //收拢时往左滑，translateX还是小于0，且绝对值越来越大，即其值越来越小
                            }
                            
                            if (translateX > 0) {
                                translateX = 0;
                            }
                            swipables.navOverlay.style[_transitionProperty] = moveTransitionProperty;
                            swipables.navOverlay.style[_transformProperty] = 'translate3d('+translateX+'px, 0, 0)';
                             //swipables.navOverlay.style[_transformProperty] = 'translateX('-translateX+'px)';

                        } else if(gNowView == 'storyview') {///如果是处在文章页的情况下,只用考虑向右滑动
                            if(xDirection == "toRight"){
                                //对于文章页，直接拉到右边去，故该处x值是从0变到100%的，就等于xDistance
                                translateX = xDistance;//translateX始终为正，往右滑动距离越大，translateX越大，这样才能实现元素向右动

                                swipables.storyview.style[_transitionProperty] = moveTransitionProperty;
                                swipables.storyview.style[_transformProperty] = 'translate3d('+translateX+'px,0,0)';

                                
                                ///上一页不管是主页or频道页，都是从左边拉到中间去，故该处x值是从-100%变到0的，就等于(xDistance - 屏幕宽度)
                                previewTranslateX = xDistance - _screenWidth;


                                ///这里要判断其上一页是主页or频道页
                                if(_preView == "fullbody"){
                                     
                                    swipables.fullbody.style[_transitionProperty] = moveTransitionProperty;
                                    swipables.fullbody.style[_transformProperty] = 'translate3d('+previewTranslateX+'px,0,0)';


                                } else if(_preView == "channelview") {
                                    swipables.channelview.style[_transitionProperty] = moveTransitionProperty;
                                    swipables.channelview.style[_transformProperty] = 'translate3d('+previewTranslateX+'px,0,0)';
                                }
                               
                            }

                        } else if(gNowView == "channelview") {
                            if(xDirection == "toRight"){
                                //对于频道页，直接拉到右边去，故该处x值是从0变到100%的，就等于xDistance
                                translateX = xDistance;

                                swipables.channelview.style[_transitionProperty] = moveTransitionProperty;
                                swipables.channelview.style[_transformProperty] = 'translate3d('+translateX+'px,0,0)';

                                //那么preView肯定是主页了
                                ///上一页是主页，是从左边拉到中间去，故该处x值是从-100%变到0的，就等于(xDistance - 屏幕宽度)
                                previewTranslateX = xDistance - _screenWidth;
                                swipables.fullbody.style[_transitionProperty] = moveTransitionProperty;
                                swipables.fullbody.style[_transformProperty] = 'translate3d('+previewTranslateX+'px,0,0)';
                            }
                        }

                        _eventHistory.push({x:_touchMoveX,y:_touchMoveY,t:_touchMoveT});

                        if(_eventHistory.length > 30){
                        	_eventHistory.splice(0,15);//只保留最后15个点
                        }



   
                    }
                }

            }, false);

            swipables.container.addEventListener('touchend', function(e) {
                if(_moveStatus === 'swipe') {
                    e.preventDefault();

                    window.gFTScrollerActive = false;

                    _touchMoveX = e.changedTouches[0].clientX;//手指离开屏幕时的横坐标位置
                    _touchMoveY = e.changedTouches[0].clientY;//手指离开屏幕时的纵坐标位置
                    var touchDistance =_touchMoveX - _touchStartX;//此值正为往右滑，负为往左滑
                    
                    _touchEndT = e.timeStamp;
                    var timeSpent = _touchEndT - _touchStartT;

                    ///快速滑动情况相关时间：restTms
                    var restTms =(_screenWidth - Math.abs(touchDistance)) * timeSpent / Math.abs(touchDistance) / a;//以ms为单位
                    var restTms_real=restTms;
                    if(restTms<100&&restTms>0){
                        restTms= 100;
                    } else if(restTms>500){
                        restTms = 500;
                    }
                    var transitionPropertyByRestT = 'all '+ restTms +'ms ease-out';

                    ///先快后面情况相关时间:restTms2
                    var lenOfEventHistory = _eventHistory.length;
                    var lastPosition = _eventHistory[lenOfEventHistory-1];
                    var comparitonPosition = _eventHistory[lenOfEventHistory-2];
                    for(var i = lenOfEventHistory-3;i>=0;i--) {
                    	if (lastPosition.t - _eventHistory[i].t > 100) {
                    		break;
                    	}
                    	comparitonPosition = _eventHistory[i];
                    }
                    var movementTime = lastPosition.t - comparitonPosition.t;
                    if (!movementTime) {
                    	movementTime = 16;
                    }
                    var movementSpeed = Math.abs(lastPosition.x - comparitonPosition.x)/movementTime;//movementSpeed就是速率
                    var restTms2 = 0;
                    restTms2 = 2*(_screenWidth - Math.abs(touchDistance))/movementSpeed/a2;
                    var restTms2_real = restTms2;
                    if(restTms2>0&&restTms2<100){
                        restTms2=100;
                    } else if(restTms2>500){
                        restTms2 = 500;
                    }
                    var transitionPropertyByRestT2 = 'all '+ restTms2 +'ms ease-out';

                    var transitionPropertyBy500 = 'all 500ms ease-out';

                    var transformPropertyAtR = 'translate3d(100%,0,0)';
                    //var transformPropertyAtR = 'translate(100%,0)';
                    var transformPropertyAtM = 'translate3d(0,0,0)';
                    //var transformPropertyAtM = 'translate(0,0)';
                    var transformPropertyAtL = 'translate3d(-100%,0,0)';
                    //var transformPropertyAtL = 'translate(-100%,0)';

                    /***测试用:start***
                    monitor4.innerHTML ="_transitionProperty: "+ _transitionProperty+"\n"+"_transformProperty: "+_transformProperty+"\n"+
                        //"baseView: " +baseView+"\n" + 
                        //"_touchMoveX:"+_touchMoveX +"\n"+
                        //"_touchStartX:"+_touchStartX+"\n"+
                        "touchDistance:"+touchDistance+"\n"+
                        "timeSpent: "+timeSpent+"\n"+
                        "restTms: "+restTms+"\n"+
                        "restTms_real: "+restTms_real+"\n"+
                        "restTms2: " +restTms2+"\n" +
                        "restTms2_real: "+restTms2_real+"\n"+
                        "movementTime: " +movementTime+"\n"+
                        "movementSpeed: "+movementSpeed; 
                    ***测试用:end***/

                   
                    /* function dealWithSlide
                     * @parameter: 
                     *  option = {
                            operatedView1:'navOverlay'/'storyview'/'channelview',
                            operatedView2:''/'fullbody'/'channelview',
                            setToutCb:switchNavOverlay/histback,
                            setToutCbP = "on"/"off"/"pinch",
                            t:restTms/restTms2/500,
                            transiP:transitionPropertyByRestT/transitionPropertyByRestT2/transitionPropertyBy500(default),
                            transfP_View1:transformPropertyAtL/transformPropertyAtM/transformPropertyAtR,
                            transfP_View2:transformPropertyAtL/transformPropertyAtM/transformPropertyAtR/''
                        }
                    */
                    var dealWithSlide = function(option){

                        console.log (option);
                        if(option.operatedView1 && typeof option.operatedView1 == 'string'){
                            var operatedView1 = document.getElementById(option.operatedView1);
                        } else {
                            var operatedView1 = document.getElementById("navOverlay");
                        }
                        if(option.operatedView2 && typeof option.operatedView2 == 'string'){
                            var operatedView2 = document.getElementById(option.operatedView2);
                        } else {
                            var operatedView2 = null;
                        }

                        if(option.transiP){
                            operatedView1.style[_transitionProperty] = option.transiP;
                            if(operatedView2){
                                operatedView2.style[_transitionProperty] = option.transiP;
                            }
                        } else {
                            operatedView1.style[_transitionProperty] = transitionPropertyBy500;
                            if(operatedView2){
                                operatedView2.style[_transitionProperty] = transitionPropertyBy500;
                            }
                        }

                        if(option.transfP_View1){
                            operatedView1.style[_transformProperty] = option.transfP_View1;
                        } else {
                            operatedView1.style[_transformProperty] = transformPropertyAtM;
                        }

                        if(operatedView2){
                            if(option.transfP_View2){
                                operatedView2.style[_transformProperty] = option.transfP_View2;
                            } else{
                                operatedView2.style[_transformProperty] = transformPropertyAtM;
                            }
                        }
                        
                        if((typeof option.t != 'number')|| option.t<=0){
                            option.t = 500;
                        }
                        setTimeout(function(){
                            removeAllTransfAndTransi();
                            option.setToutCb(option.setToutCbP);
                          
                        },option.t);
                    };

                    var option ={
                        operatedView1:'navOverlay',
                        operatedView2:'',
                        setToutCb:switchNavOverlay,
                        setToutCbP:'on',
                        t:500,
                        transiP:transitionPropertyBy500,
                        transfP_View1:transformPropertyAtM,
                        transfP_View2:''
                    };
 
                    if(touchDistance>_minSwipe || (touchDistance>_startSwipe && movementSpeed>_speedThred)){//如果是向右滑动超过72px
                       
                        if (timeSpent > 0 && timeSpent < _timeSpentThres) {//情况1：快速向右滑动超过72——即timeSpent位于(0,200)
                            //monitortype.innerHTML="fastToRight>72"; 
                            if(baseView =='fullbody'){
                                option = {
                                    operatedView1:'navOverlay',
                                    operatedView2:'',
                                    setToutCb:switchNavOverlay,
                                    setToutCbP:'on',
                                    t:restTms,
                                    transiP:transitionPropertyByRestT,
                                    transfP_View1:transformPropertyAtM,
                                    transfP_View2:''
                                };

                            } else if(baseView == 'storyview'){
                                if(_preView == "fullbody"){
                                    option = {
                                        operatedView1:'storyview',
                                        operatedView2:'fullbody',
                                        setToutCb:histback,
                                        setToutCbP:'pinch',
                                        t:restTms,
                                        transiP:transitionPropertyByRestT,
                                        transfP_View1:transformPropertyAtR,
                                        transfP_View2:transformPropertyAtM
                                    };
                                } else if(_preView == "channelview"){
                                    option = {
                                        operatedView1:'storyview',
                                        operatedView2:'channelview',
                                        setToutCb:histback,
                                        setToutCbP:'pinch',
                                        t:restTms,
                                        transiP:transitionPropertyByRestT,
                                        transfP_View1:transformPropertyAtR,
                                        transfP_View2:transformPropertyAtM
                                    };
                                }

                            } else if(baseView == 'channelview'){
                                option = {
                                    operatedView1:'channelview',
                                    operatedView2:'fullbody',
                                    setToutCb:histback,
                                    setToutCbP:'pinch',
                                    t:restTms,
                                    transiP:transitionPropertyByRestT,
                                    transfP_View1:transformPropertyAtR,
                                    transfP_View2:transformPropertyAtM
                                };
                            }

                        } else if(timeSpent >= _timeSpentThres && movementSpeed>_speedThred) {//情况2：先慢后快向右滑动超过72——即timeSpent位于[200,+infi),且momentSpeed位于(0.36,+infi)
                            //monitortype.innerHTML="slowToFastToRight>72";                            
                            if(baseView =='fullbody'){
                                option = {
                                    operatedView1:'navOverlay',
                                    operatedView2:'',
                                    setToutCb:switchNavOverlay,
                                    setToutCbP:'on',
                                    t:restTms2,
                                    transiP:transitionPropertyByRestT2,
                                    transfP_View1:transformPropertyAtM,
                                    transfP_View2:''
                                };

                            } else if(baseView == 'storyview'){
                                if(_preView == "fullbody"){
                                    option = {
                                        operatedView1:'storyview',
                                        operatedView2:'fullbody',
                                        setToutCb:histback,
                                        setToutCbP:'pinch',
                                        t:restTms2,
                                        transiP:transitionPropertyByRestT2,
                                        transfP_View1:transformPropertyAtR,
                                        transfP_View2:transformPropertyAtM
                                    };
                                } else if(_preView == "channelview"){
                                    option = {
                                        operatedView1:'storyview',
                                        operatedView2:'channelview',
                                        setToutCb:histback,
                                        setToutCbP:'pinch',
                                        t:restTms2,
                                        transiP:transitionPropertyByRestT2,
                                        transfP_View1:transformPropertyAtR,
                                        transfP_View2:transformPropertyAtM
                                    };
                                }
                                
                            } else if(baseView == 'channelview'){                      
                                option = {
                                    operatedView1:'channelview',
                                    operatedView2:'fullbody',
                                    setToutCb:histback,
                                    setToutCbP:'pinch',
                                    t:restTms2,
                                    transiP:transitionPropertyByRestT2,
                                    transfP_View1:transformPropertyAtR,
                                    transfP_View2:transformPropertyAtM
                                };

                            }  
                        } else{//情况3：正常原速向右滑动超过72——即timeSpent位于[200,+infi)，且momentSpeed位于(0,0.36]
                        	//monitortype.innerHTML="slowToRight>72";    
                            if(baseView =='fullbody'){
                               option = {
                                    operatedView1:'navOverlay',
                                    operatedView2:'',
                                    setToutCb:switchNavOverlay,
                                    setToutCbP:'on',
                                    t:500,
                                    transiP:transitionPropertyBy500,
                                    transfP_View1:transformPropertyAtM,
                                    transfP_View2:''
                                };
                                
                            } else if(baseView == 'storyview'){ 
                                 if(_preView == "fullbody"){
                                    option = {
                                        operatedView1:'storyview',
                                        operatedView2:'fullbody',
                                        setToutCb:histback,
                                        setToutCbP:'pinch',
                                        t:500,
                                        transiP:transitionPropertyBy500,
                                        transfP_View1:transformPropertyAtR,
                                        transfP_View2:transformPropertyAtM
                                    };
                                } else if(_preView == "channelview"){
                                    option = {
                                        operatedView1:'storyview',
                                        operatedView2:'channelview',
                                        setToutCb:histback,
                                        setToutCbP:'pinch',
                                        t:500,
                                        transiP:transitionPropertyBy500,
                                        transfP_View1:transformPropertyAtR,
                                        transfP_View2:transformPropertyAtM
                                    };
                                }

                            } else if(baseView == 'channelview'){
                                option = {
                                    operatedView1:'channelview',
                                    operatedView2:'fullbody',
                                    setToutCb:histback,
                                    setToutCbP:'pinch',
                                    t:500,
                                    transiP:transitionPropertyBy500,
                                    transfP_View1:transformPropertyAtR,
                                    transfP_View2:transformPropertyAtM
                                };

                            }

                        }
                       
                        dealWithSlide(option);
                        ga('send','event', 'App Feature', 'Swipe', 'Back');
                        /*测试代码：start*
                        monitor4.innerHTML = "o.transi:"+option.transiP+"\n"
                                            +"o.transf_V1:"+option.transfP_View1+"\n"
                                            +"o.transf_V2:"+option.transfP_View2;
                        setRealInnerHTML(swipables.storyview,monitor1);
                        setRealInnerHTML(swipables.fullbody,monitor2);
                         *测试代码：end*/
                    } else if (touchDistance < -_minSwipe && baseView == 'fullbody' && swipables.navOverlay.className.indexOf(" on")>-1){//如果是向左滑动超过72px且基准页为fullbody且导航菜单触发

                        if (timeSpent > 0 && timeSpent < _timeSpentThres){//情况4：快速向左滑动超过72
                            //monitortype.innerHTML="fastToLeft>72";  
                            option = {
                                operatedView1:'navOverlay',
                                operatedView2:'',
                                setToutCb:switchNavOverlay,
                                setToutCbP:'off',
                                t:restTms,
                                transiP:transitionPropertyByRestT,
                                transfP_View1:transformPropertyAtL,
                                transfP_View2:''
                            };
                      
                        } else if(timeSpent>=_timeSpentThres&& movementSpeed>_speedThred){///情况5：先慢后快向左滑动超过72
                            //monitortype.innerHTML="flowToFastToLeft>72"; 
                            option = {
                                operatedView1:'navOverlay',
                                operatedView2:'',
                                setToutCb:switchNavOverlay,
                                setToutCbP:'off',
                                t:restTms2,
                                transiP:transitionPropertyByRestT2,
                                transfP_View1:transformPropertyAtL,
                                transfP_View2:''
                            };

                        } else {///情况6：慢速向左滑动超过72
                            //monitortype.innerHTML="flowToLeft>72";
                            option = {
                                operatedView1:'navOverlay',
                                operatedView2:'',
                                setToutCb:switchNavOverlay,
                                setToutCbP:'off',
                                t:500,
                                transiP:transitionPropertyBy500,
                                transfP_View1:transformPropertyAtL,
                                transfP_View2:''
                            };

                         }
                        dealWithSlide(option);

                    } else if (touchDistance <= _minSwipe && touchDistance>=-_minSwipe){///情况7：如果向左向右滑动都没超过72px
                        //monitortype.innerHTML="moveToLeftOrRight<72"; 
                        removeAllTransfAndTransi();
                    
                    }
                
                } else {
                    removeAllTransfAndTransi();
                }               
                _touchStartX = -1;
                _touchMoveX = -1;
                _moveStatus = 'unknown';

       
                // handle the case when touchend happened but the content is decelerating
                // if (_moveStatus === 'scroll') {
                //     _moveStatus = 'decelerating';
                //     try {
                //         clearTimeout(decelerateTimeOut);
                //     } catch (ignore) {

                //     }
                //     decelerateTimeOut = setTimeout(function(){
                //         _moveStatus = 'unknown';
                //     },3000);
                // } else {
                //     _moveStatus = 'unknown';
                // }
            }, false);
        } catch (ignore){
        
        }
    }


}

