// FT010 123 1522033086
// （标准会员——FT + 010 + 000~999随机数 + 时间戳）
// （高级会员——FT + 100 + 000~999随机数 + 时间戳）

function getOrderNum(memberNum){
    var randomVal = Math.round(Math.random()*899)+100;
    var orderNum = '';
    var time = Math.round(new Date().getTime()/1000);   
    orderNum = 'FT' + memberNum + randomVal + time;
    return orderNum;
}

window.iapProducts = [{title: '标准会员',price: '¥198.00',id: 'ftc_standard',image: 'http://i.ftimg.net/picture/6/000068886_piclink.jpg', teaser: '注册成为标准会员', isPurchased: false, state: '订阅', group: 'membership', groupTitle: '会员',benefits:['- 精选深度分析','- 中英双语内容','- 金融英语速读训练','- 英语原声电台','- 无限浏览7日前所有历史文章（近8万篇）'],period:'year'},{title: '高端会员',price: '¥1,998.00',id: 'ftc_premium',image: 'http://i.ftimg.net/picture/6/000068886_piclink.jpg', teaser: '注册成为高端会员', isPurchased: false, state: '订阅', group: 'membership', groupTitle: '会员',benefits:['- 享受“标准会员”所有权益','- 编辑精选，总编/各版块主编每周五为您推荐本周必读资讯，分享他们的思考与观点','- FT中文网2018年度论坛门票2张，价值3999元/张 （不含差旅与食宿）'],period:'year'}];

var subscribeIntruction = {
    title: '订阅说明与注意事项',
    items: [
        {headline: '订阅价格与周期', lead: '您可以在应用内订阅《FT中文网会员》和《FT中文网高端会员》两种服务。《FT中文网会员》每年订阅价格为 198元（$28.99），订阅后您可以解锁阅读FT中文网每日新增的两篇独家文章内容，以及解锁双语文章的英语语音服务。《FT中文网高端会员》每年订阅价格为 1998元（$294.99），订阅后您可以解锁《FT中文网会员》提供的所有服务，再加上每周的《编辑精选》周刊。'}
    ],
    moreService: ['隐私申明','用户协议','反馈']
}

function getSubscribeIntructionHtml(){
    var intructionHtml = '';
    var items = subscribeIntruction.items;
    var services = subscribeIntruction.moreService
    var itemsHtml = '';
    for (var i = 0 ,len = items.length; i < len; i++) {
        itemsHtml += '<div class="hint-headline">'+items[i].headline+'</div><div class="hint-content">'+items[i].lead+'</div>';
    }
    intructionHtml = '<div class="iap-intruction"><div class="headline">'+subscribeIntruction.title+'</div>'+itemsHtml+'<div class="more-service"><div class="hint-headline">更多服务与信息</div><div class="policy" url="http://www.ftchinese.com/m/corp/privacy-policy.html?ad=no">'+services[0]+'<span>></span></div><div class="policy" url="http://www.ftchinese.com/m/corp/service.html?ad=no">'+services[1]+'<span>></span></div><div class="policy" url="http://www.ftchinese.com/m/corp/faq.html?ad=no">'+services[2]+'<span>></span></div></div></div>';
    return intructionHtml;
}
var subscribeIntructionHtml = getSubscribeIntructionHtml();

// MARK: - The HTML template for iap channel pages like eBook store or subscription center, so that you don't have to load from web
var channelPageTemplate = '<div class="channel-iap" id="channelScroller" style="overflow-y: scroll;"><div id="channelContent"><div id="head" onclick="switchNavOverlay()"><div class="header"><div class="channeltitle">[channelTitle]</div></div></div><div class="layout-a_region-3"><div class="inner"><div class="container">[channelContent]</div></div></div><div class="layout-a_region-3"><div class="inner"><div class="container">' + subscribeIntructionHtml + '</div></div></div><div class="copyright"><b><font face="arial">© </font>英国金融时报</b> 有限公司 <font face="arial">2018</font>&nbsp;&nbsp;<span><acronym title="Financial Times">FT中文网</acronym>为英国金融时报的注册商标</span></div></div></div>';

var memberTemplate = '<div product-id="{{id}}" class="iap-item oneStory iap-member iap-member__{{type}}{{firstChildClass}} track-click" eventLabel="iap-detail: {{i}}">' +
    '<div class="headline">{{title}}</div>' +
    '<ul class="iap-benefits">{{benefits}}</ul>' +
    '{{button}}' +   
'</div>' +
'<div class="clearfloat"></div>';

var gUserId = getCookie('USER_ID') || '';


// MARK: - Display all the iap products on the home page
function displayProductsOnHome(products) {
    // TODO: When displaying iap products on home, it should be grouped by type
    if (typeof products === 'object' && products.length > 0) {
        var productsHTML = getProductHTMLCode(products, 'all',{});
        if (document.getElementById('iap')) {
            document.getElementById('iap').innerHTML = productsHTML;
        }
        var iapChannelLinks = document.querySelectorAll('.iap-channel');
        for (var i = 0; i < iapChannelLinks.length; i++) {
            var iapClassName = iapChannelLinks[i].className.replace(' hide', '');
            iapChannelLinks[i].className = iapClassName;
        }

        // MARK: - Update the dimension of the home page navigation scroller so that the last items are displayed
        try {
            sectionScroller.updateDimensions();
        } catch (ignore) {
        }
    }
}

// MARK: - Create the HTML Code for iap Products to be displayed on home and channel pages
// MARK: - forGroup is used as filter to get only the specified iap type for channel page
function isEmptyObj(dataObj){
     var arr = Object.keys(dataObj);    
     if (arr.length > 0){
        return false;
     }else{
        return true;
     }
}
var upgradePrice = '¥1,998.00';
function getProductHTMLCode(products, forGroup, dataObj) {
    var productsHTML = '';
    var currentGroup = '';
    var productLen = products.length;
    var gUserId = getCookie('USER_ID') || '';
    if (typeof products === 'object' && productLen > 0) {
        for (var i = 0; i < productLen; i++) {
            if (forGroup === products[i].group) {
                var firstChildClass = '';
                var productActionButton = '';
                var productPrice = products[i].price || '购买';
                var productBenefits = '';
                var benefitsArray = [];
                var productName = products[i].title || '';

                var memberNum = (products[i].title == '高端会员') ? '100' : '010';
                var orderNum = getOrderNum(memberNum);
                // console.log('dataObj:'+dataObj);
                if(dataObj.standard===1 && dataObj.premium===0){
                    products[0].isPurchased = true;
                    products[0].state = '<button class="iap-move-left">已订阅</button><p class="iap-teaser">' + products[i].price + '/年' + '</p>';
                    products[1].state = '<a onclick="getBuyCode(\''+ products[1].id +'\',\''+ dataObj.v +'\',\''+ gUserId +'\',\''+ productName +'\',\''+ orderNum +'\')"><button class="iap-move-left">现在升级</button></a><p class="iap-teaser">¥' + dataObj.v + '.00/年' + '</p>';
                    upgradePrice = dataObj.v;
                }else if(dataObj.premium===1){
                    products[i].isPurchased = true;
                    products[i].state = '<button class="iap-move-left">已订阅</button><p class="iap-teaser">' + products[i].price + '/年' + '</p>';
                }else{
                    products[i].isPurchased = false;
      
                    products[i].state = '<a onclick="getBuyCode(\''+ products[i].id +'\',\''+ productPrice +'\',\''+ gUserId +'\',\''+ productName +'\',\''+ orderNum +'\')"><button class="iap-move-left">订阅</button></a><p class="iap-teaser">' + products[i].price + '/年' + '</p>';
                    upgradePrice = '¥1,998.00';

                }
                if(!isEmptyObj(dataObj)){
                    productActionButton = '<div class="iap-button" product-id="' + products[i].id + '" product-price="' + productPrice + '" product-title="' + productName + '">' + products[i].state + '</div>';    
                    // <p class="iap-teaser">' + products[i].price + '/年' + '</p>
                }
                // MARK: - use onclick to capture click rather than jQuery's body.on, which is buggy on iPhone
                // MARK: render UI
                if (products[i].group === 'membership') {
                    benefitsArray = products[i].benefits;
                    if (Array.isArray(benefitsArray) && benefitsArray.length > 0) {
                        for (var j = 0; j < benefitsArray.length; j++) {
                            productBenefits += '<li>' + benefitsArray[j] + '</li>';
                        }
                    }
 
                    var memberTypeArr = products[i].id.split('.');
                    var memberTypeLen = products[i].id.split('.').length;
                    var memberType = memberTypeArr[memberTypeLen-2];
                    productsHTML += memberTemplate
                        .replace('{{id}}', products[i].id)
                        .replace('{{type}}', memberType)
                        .replace('{{firstChildClass}}', firstChildClass)
                        .replace('{{i}}', i)
                        .replace('{{title}}', products[i].title)
                        .replace('{{image}}', products[i].image)
                        .replace('{{benefits}}', productBenefits)
                        .replace('{{button}}', productActionButton);
                } else {
                    productsHTML = '';

                }
            }
        }
    }
    return productsHTML;
}

// MARK: - extract product information and display it to home or channel page
function displayProducts(products, page, pageTitle,dataObj) {
    if (typeof products === 'object' && products.length > 0) {
        var productsHTML = getProductHTMLCode(products, page, dataObj);
        // MARK: - if page is not 'home', then we should open channel view
        if (page !== '') {
            var channelHTML = channelPageTemplate
                .replace('[channelContent]', productsHTML)
                .replace('[channelTitle]', pageTitle);
            var channelView = $('#channelview');
            channelView.html(channelHTML);
            document.getElementById('header-title').innerHTML = pageTitle;
            closeOverlay();
            document.body.className = 'channelview channel-iap';
            gNowView = 'channelview';
            if (useFTScroller === 0) {
                window.scrollTo(0, 0);
            }
            // MARK: - Send Traffic Data so that this can be tracked
            var url = gDeviceType + '/channelpage/iap/' + page;
            httpspv(url);
            // MARK: 记录频道页浏览历史
            if (hist && ((hist[0] && hist[0].url != url) || hist.length == 0)) {
                hist.unshift({ 'url': '/channelpage/iap/' + page, 'title': pageTitle });
            }
        }

        $('.policy').unbind().bind('click', function() {
          var url = $(this).attr('url');
          window.open(url);
        });
    }
}

// MARK: - Update window.iapProducts after user act on any one of the products
function updateProductStatus(productIndex, isProductPurchased, isProductDownloaded) {
    if (productIndex >= 0 && window.iapProducts[productIndex]) {
        window.iapProducts[productIndex].isPurchased = isProductPurchased;
    }
}



// iapActions('FT0101231522033086', 'fail', '');
// MARK: - Update DOM UI based on user actions
function iapActions(productID, actionType, expireDate) { 
    var gUserId = getCookie('USER_ID');   
    var iapButtons='';
    var iapHTMLCode = '';
    var productPrice = '';
    var productIndex = 0;
    var productName ='';
    var tradeNum = '';
    // MARK: get iapButtons based on the current view
    var currentView = 'fullbody';
    if (gNowView.indexOf('storyview') >= 0) {
        currentView = 'storyview';
    } else if (gNowView.indexOf('channelview') >= 0) {
        currentView = 'channelview';
    }
    tradeNum = productID;
    var productIDArr = productID.substring(2,5);
    productID = (productIDArr == '100') ? 'ftc_premium' : 'ftc_standard';
    
    iapButtons = document.getElementById(currentView).querySelectorAll('.iap-button');

    productIndex = getproductIndex(productID);

    // MARK: - get product price here
    productPrice = window.iapProducts[productIndex].price || '0￥';
    productName = window.iapProducts[productIndex].title || '';

    // MARK: - Get product type based on its identifiers
    var productType = '';
    if (/premium$|standard$|trial$/.test(productID)) {
        productType = 'membership';
    }else {
        productType = 'eBook';
    }

 
    postPayState(productID, productPrice, gUserId, tradeNum, actionType);

    switch (actionType) { 
        case 'success':
            if (productType === 'membership') {
                iapHTMLCode = '<a><button class="iap-move-left">已订阅</button></a><p class="iap-teaser">'+ productPrice + '/年' + '</p>'; 
            } 
            // isReqSuccess = false;
            recordSuccessBuyInLocal();
            updateProductStatus(productIndex, true, true);
            //window.location.reload();
            break;
        case 'fail':
            if (productType === 'membership') {  
                turnonOverlay('iap-hint');
                var isFTCpw = Boolean(Number(getCookie('isFTCw')));
                if(!isPremium && !isFTCpw){
                    iapHTMLCode = '<a onclick="getBuyCode(\''+ productID +'\',\''+ upgradePrice +'\',\''+ gUserId +'\',\''+ productName +'\',\''+ tradeNum +'\')"><button class="iap-move-left">现在升级</button></a><p class="iap-teaser">¥' + upgradePrice + '.00/年' + '</p>';  
                }else{
                    iapHTMLCode = '<a onclick="getBuyCode(\''+ productID +'\',\''+ productPrice +'\',\''+ gUserId +'\',\''+ productName +'\',\''+ tradeNum +'\')"><button class="iap-move-left">订阅</button></a><p class="iap-teaser">' + productPrice + '/年' + '</p>';
                }
                // alert('isFTCpw:'+isFTCpw+'isPremium1:'+isPremium);
                
            } 
            updateProductStatus(productIndex, false, false); 
            break;
        default:
            if (productType === 'membership') {  
                turnonOverlay('iap-hint');
                iapHTMLCode = '<a onclick="getBuyCode(\''+ productID +'\',\''+ productPrice +'\',\''+ gUserId +'\',\''+ productName +'\',\''+ tradeNum +'\')"><button class="iap-move-left">订阅</button></a><p class="iap-teaser">' + productPrice + '/年' + '</p>'; 
            } 
            updateProductStatus(productIndex, false, false); 
            break;
    }
    // MARK: - for each of the iap button containers that fit the criteria, update its innerHTML
    if (iapButtons.length>0){
        for (var i = 0,len=iapButtons.length; i < len; i++) {
            if (productID === iapButtons[i].getAttribute('product-id')) {
                iapButtons[i].innerHTML = iapHTMLCode; 
            } else if (productID === '') {
                // 这里应该一直不会执行
                iapHTMLCode = '<a><button class="iap-move-left">正在请求</button></a>';
                iapButtons[i].innerHTML = iapHTMLCode;
            }
        }
    }

    // MARK: - Send Event to GA and Other Analytics
    var eventAction = 'Buy ' + actionType + ': ' + productID;
    ga('send','event','Android Privileges', eventAction, window.gSubscriptionEventLabel);
    // FIXME: Is this useful? 
    actionType = '';
}

 // MARK: - Get the index number of the current product for window.iapProducts
function getproductIndex(productID){
    var productIndex = 0;
    var length = window.iapProducts.length;
    if (productID !== '') {
        for (var i = 0; i < length; i++) {
            if (productID === iapProducts[i].id) {
                productIndex = i;
                break;
            }
        }
    }
    return productIndex;
}

// MARK: - Get url scheme for iOS buy and JS onclick code for Android
function getBuyCode(productId, productPrice, userId, productName, orderNum){
    
    var userId = getCookie('USER_ID');
    if (!!userId){
        
        var productIDArr = orderNum.substring(2,5);
        var productIdStr = (productIDArr === '100') ? 'ftc_premium' : 'ftc_standard';
        productId = orderNum;

        if(productPrice.indexOf('¥')>=0){
            productPrice =  productPrice.substr(1,productPrice.length);
        }
        productPrice =  productPrice.replace(',','');

        if(osVersion.indexOf('Android')>=0){
            try {
                if(ftjavacriptapp){                  
                    ftjavacriptapp.payzfb(productId,productPrice,userId, productName);
                    postPayState(productIdStr, productPrice, userId, orderNum, 'start');
                    var eventAction = 'Buy: ' + productIdStr;
                    ga('send','event','Android Privileges', eventAction, window.gSubscriptionEventLabel);
                    setTimeout(function(){
                        postPayState(productIdStr, productPrice, userId, orderNum, 'start pending');
                    },15000);
                }
            } catch (ignore) {
                postPayState(productIdStr, productPrice, userId, orderNum, 'start fail');
                alert('请求失败！');
            }
        }
    }else{
        turnonOverlay('loginBox');  
    }
}







/**
 * 订阅界面动作
 */

$('body').on('click', '.openPayment', function(){
    // getBuyCode(productId, productPrice, userId, productName, orderNum) 
});


// MARK: - Test paywall for Android
function postPayState(productId, productPrice, userId, orderNum, actionType){
    if (!!userId){
        var random = Math.random();
        var xhrpw = new XMLHttpRequest();
        xhrpw.open('post', './index.php/pay/app?token='+random);
        xhrpw.setRequestHeader('Content-Type', 'application/text');
        var payInfo = {
            productId:productId,
            productPrice:productPrice,
            userId:userId,
            orderNum:orderNum,
            actionType:actionType,
            actionVersion:_currentVersion
        }
        xhrpw.onload = function() {
            if (xhrpw.status === 200) {
                var data = xhrpw.responseText;
            } else {
                console.log('fail to get st');
            }
        };     
        xhrpw.send(JSON.stringify(payInfo));
    }

}

// Mark:检查是否登录，没有登录不显示vip-center 
function isShowVipCenter(){
    var userId = getCookie('USER_ID') || '';
    var vipCenterBtn = document.getElementById('vip-center-btn');
    if(!userId){
        vipCenterBtn.style.display = 'none';
    }else{
        vipCenterBtn.style.display = 'block';
    }
}

//MARK: - 交易失败时，显示的页面
$('body').on('click', '#iap-know', function(){
    $('#iap-hint').removeClass('on');
});

//MARK: - refresh page to update lock class
var isReqSuccess = false;
var i = 0;
var isPremium = false;
var isEditorChoiceStory = false;
var isEditorChoiceChannel = false;
function payWall(url){ 
    grantAccessFromLocal();
    if(!isReqSuccess && i<3){ 
        deleteCookie('isFTCw'); 
        var xhrpw = new XMLHttpRequest();
        xhrpw.open('get', url);
        xhrpw.setRequestHeader('Content-Type', 'application/text');
        xhrpw.onload = function() {
            if (xhrpw.status === 200) {  
                var data = xhrpw.responseText;
                var parsedData = JSON.parse(data); 
                vipCenter(parsedData);
                isReqSuccess = true;
                setCookie('isFTCw', parsedData.paywall, '', '/');
                if (parsedData.paywall >= 1) { 
                    updateUnlockClass();
                    if (isSuccessBuyInLocal()) {
                        var userId2 = getCookie('USER_ID') || '';
                        ga('send','event', 'CatchError', 'Local Subscription Not Validated on Server', userId2);
                    }
                } else {
                    isPremium = (parsedData.premium >= 1) ? true : false ;  
                    if(!isPremium && isEditorChoiceChannel){
                        updateUnlockClass();
                    } else {
                        updateLockClass();
                    }
                    //console.log('isEditorChoiceChannel:'+isEditorChoiceChannel); 
                }
            } else {
                isReqSuccess = false;
                i++;
                setTimeout(function() {
                    payWall(url); 
                }, 500); 
                // console.log('fail to request:'+i);
            }
            grantAccessFromLocal();
        };
        xhrpw.send(null);
        console.log('what times the paywall?'+i);
    }
}

// MARK: - Record Buying Success 
function recordSuccessBuyInLocal() {
    var userId1 = getCookie('USER_ID') || '';
    if (userId1 !== '') {
        setCookie('BoughtFromThisDevice', userId1, '', '/');
    }
}

// MARK: - Local Subscription Record: Use a local cookie to grant access
function grantAccessFromLocal() {
    if (isSuccessBuyInLocal()) {
        setCookie('isFTCw', 0, '', '/');
    }
}

function isSuccessBuyInLocal() {
    var isBoughtFromThisDeviceId = getCookie('BoughtFromThisDevice') || '';
    var userId1 = getCookie('USER_ID') || '';
    if (isBoughtFromThisDeviceId !== '' && isBoughtFromThisDeviceId === userId1) {
        return true;
    }
    return false;
}

/**
 * 获取url参数转化成对象
 */
function parseUrlSearch(){
    var dataObj={};
    var para = location.search.substring(1);
    if (!!para){
        var paraArr = para.split('&');
        for(let j=0;j<paraArr.length;j++){
            var arr = paraArr[j].split('=');
            dataObj[arr[0]]=Number(arr[1]);
        }
        return dataObj;
    }
    return dataObj;
}

/**
 * 更新会员中心，订阅信息
 */
function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() <10 ? '0' + (date.getDate()): date.getDate()+'';
    return Y+M+D;
}

function vipCenter(dataObj){
    var time = dataObj.expire;
    var formatTime = timestampToTime(time);
    var vipTypeId = document.getElementById('vip-type');
    var warmPrompt = document.getElementById('warm-prompt');
    if(dataObj.standard===1 && dataObj.premium===0){
        vipTypeId.innerHTML = '标准会员';
        warmPrompt.innerHTML = '您的会员截止至<span style="color:#26747a">'+formatTime+'</span>';
    }else if (dataObj.premium === 1){
        vipTypeId.innerHTML = '高端会员';
        warmPrompt.innerHTML = '您的会员截止至<span style="color:#26747a">'+formatTime+'</span>';
    }else{
        vipTypeId.innerHTML = '未付费注册用户';
        warmPrompt.innerHTML = '成为付费会员，阅读FT独家内容，请<a href="#" style="color:#26747a">成为会员</a>';
    }

}

 
// 过滤出包含locked的headline类数组
 function getPayStory(narrowClass,wideClass){
    var headlineDiv = document.querySelectorAll('.headline');
    var toPayHeadline = [];
    var len = headlineDiv.length;

    if (len>0){
        for (var i = 0; i < len; i++) {
            if (hasClass(headlineDiv[i],narrowClass)||hasClass(headlineDiv[i],wideClass)){
                toPayHeadline.push(headlineDiv[i]);
            }
        //    console.log('getPayStory len:'+len +'--headlineDiv:'+ hasClass(headlineDiv[0],'narrow-locked'));
        }
    }

    return toPayHeadline;
 }
    

function updateLockClass(){
    var toPayHeadline =  getPayStory('narrow-locked','wide-locked');
    // console.log('updateLockClass:'+toPayHeadline.length);
    if (toPayHeadline.length>0){
        for (var k = 0, len=toPayHeadline.length; k < len; k++) {
           
            if (hasClass(toPayHeadline[k],'narrow-locked')){
                removeClass(toPayHeadline[k], 'narrow-locked');
                addClass(toPayHeadline[k], 'narrow-unlocked');
            } else if(hasClass(toPayHeadline[k],'wide-locked')){
                removeClass(toPayHeadline[k], 'wide-locked');
                addClass(toPayHeadline[k], 'wide-unlocked');
            }
        }
    }
}
function updateUnlockClass(){
    var toPayHeadline =  getPayStory('narrow-unlocked','wide-unlocked');
    if (toPayHeadline.length>0){
        for (var k = 0, len=toPayHeadline.length; k < len; k++) {
            if (hasClass(toPayHeadline[k],'narrow-unlocked')){
                removeClass(toPayHeadline[k], 'narrow-unlocked');
                addClass(toPayHeadline[k], 'narrow-locked');
            } else if(hasClass(toPayHeadline[k],'wide-unlocked')){
                removeClass(toPayHeadline[k], 'wide-unlocked');
                addClass(toPayHeadline[k], 'wide-locked');
            } 
        }
    }
}
function hasClass(ele, cls) {
    var cls = cls || '';
    if (cls.replace(/\s/g, '').length === 0) {
        return false; 
    }else{
        return new RegExp(' ' + cls + ' ').test(' ' + ele.className + ' ');
    }

}

function addClass(ele, cls) {
    if (!hasClass(ele, cls)) {
        ele.className = ele.className === '' ? cls : ele.className + ' ' + cls;
    }
}

function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        var newClass = ' ' + ele.className.replace(/[\t\r\n]/g, '') + ' ';
        while (newClass.indexOf(' ' + cls + ' ') >= 0) {
        newClass = newClass.replace(' ' + cls + ' ', ' ');
        }
        ele.className = newClass.replace(/^\s+|\s+$/g, '');
    }
}
function updatePageAction(){
    if (window.location.hostname === 'localhost' || window.location.hostname.indexOf('192.168') === 0 || window.location.hostname.indexOf('127.0') === 0) {
        var dataObj = parseUrlSearch();
        vipCenter(dataObj);
        payWall('api/paywall.json');
    }else{
        var userId1 = getCookie('USER_ID') || '';
        if (!!userId1) {  
            payWall('/index.php/jsapi/paywall?update');   
        }else{
            setCookie('isFTCw', 1, '', '/');
        }
    }
}

window.onload = function(){
    updatePageAction();
}

function getSystemVersion(){
    try {
        if(ftjavacriptapp){
            if(typeof ftjavacriptapp.get_systemversion === 'function'){
                var version = ftjavacriptapp.get_systemversion();
                $('#app_version').html(version);
            }else{
                $('#app_version').html('24');
            }
        }
    } catch (err) {
        console.log('get system version error');
    }
}
getSystemVersion();

// 测试付费成功与否的地方
// $(this).find("input[name='payWay']").attr('checked','true');
// ftc_premium 1800 高端会员 FT1006001526873479
// iapActions('ftc_premium_FT0101522812152', 'success', '');
// var payWrapData = {};
// function paySuccess(){
//     var psySuccess = document.getElementById('pay-success-btn');
//     psySuccess.onclick=function(){
//         turnonOverlay('pay-way');
//     }
// }
// paySuccess();
// // Mark:支付方式
// var payWay = '';
// $('body').on('click', '.one-way-container', function(){   
//     payWay = $(this).find("input[name='payWay']").val();   
// });

// $('body').on('click', '#to-pay', function(){
//     var userId = getCookie('USER_ID') || '';
//     if(payWay==='wxpay'){
//         console.log('wx pay way is:'+payWay);
//         getBuyCode('ftc_premium', '1800', 'userId', '高端会员', 'FT1006001526873479');
//     }else if(payWay==='alipay'){
//         console.log('ali pay way is:'+payWay);

//         // getBuyCode('ftc_premium', '1800', 'userId', '高端会员', 'FT1006001526873479');
//         getBuyCode(payWrapData['productsId'], payWrapData['productPrice'],'userId',payWrapData['productName'],payWrapData['orderNum']);
//     }
// });

// $('body').on('click', '.iap-button', function(){
//      var productName = $(this).attr('product-title');
//      var memberNum = (productName == '高端会员') ? '100' : '010';
//      var orderNum = getOrderNum(memberNum);
//      payWrapData['productsId'] =  $(this).attr('product-id');
//      payWrapData['productPrice'] =  $(this).attr('product-price');
//      payWrapData['productName'] =  productName;
//      payWrapData['orderNum'] =  orderNum;

//      turnonOverlay('pay-way');
//     //  console.log(payWrapData);
// });

// function getWxBuyCode(productId, productPrice, userId, productName, orderNum){
//     console.log(productId+' '+ productPrice +' '+productName+' '+orderNum);
    
//     var userId = getCookie('USER_ID');
//     if (!!userId){
        
//         var productIDArr = orderNum.substring(2,5);
//         var productIdStr = (productIDArr === '100') ? 'ftc_premium' : 'ftc_standard';
//         productId = orderNum;

//         if(productPrice.indexOf('¥')>=0){
//             productPrice =  productPrice.substr(1,productPrice.length);
//         }
//         productPrice =  productPrice.replace(',','');

//         if(osVersion.indexOf('Android')>=0){
//             try {
//                 if(ftjavacriptapp){                  
//                     ftjavacriptapp.payweixin(productId,productPrice,userId, productName);
//                     postPayState(productIdStr, productPrice, userId, orderNum, 'start');
//                     var eventAction = 'Buy: ' + productIdStr;
//                     ga('send','event','Android Privileges', eventAction, window.gSubscriptionEventLabel);
//                     setTimeout(function(){
//                         postPayState(productIdStr, productPrice, userId, orderNum, 'start pending');
//                     },15000);
//                 }
//             } catch (ignore) {
//                 postPayState(productIdStr, productPrice, userId, orderNum, 'start fail');
//                 alert('请求失败！');
//             }
//         }
//     }else{
//         turnonOverlay('loginBox');  
//     }
// }


// function wxpayActions(productID, actionType) { 
//     var gUserId = getCookie('USER_ID');   
//     var iapButtons='';
//     var iapHTMLCode = '';
//     var productPrice = '';
//     var productIndex = 0;
//     var productName ='';
//     var tradeNum = '';
//     // MARK: get iapButtons based on the current view
//     var currentView = 'fullbody';
//     if (gNowView.indexOf('storyview') >= 0) {
//         currentView = 'storyview';
//     } else if (gNowView.indexOf('channelview') >= 0) {
//         currentView = 'channelview';
//     }
//     tradeNum = productID;
//     var productIDArr = productID.substring(2,5);
//     productID = (productIDArr == '100') ? 'ftc_premium' : 'ftc_standard';
    
//     iapButtons = document.getElementById(currentView).querySelectorAll('.iap-button');

//     productIndex = getproductIndex(productID);

//     // MARK: - get product price here
//     productPrice = window.iapProducts[productIndex].price || '0￥';
//     productName = window.iapProducts[productIndex].title || '';

//     // MARK: - Get product type based on its identifiers
//     var productType = '';
//     if (/premium$|standard$|trial$/.test(productID)) {
//         productType = 'membership';
//     }else {
//         productType = 'eBook';
//     }

 
//     postPayState(productID, productPrice, gUserId, tradeNum, actionType);

//     switch (actionType) { 
//         case 'success':
//             if (productType === 'membership') {
//                 iapHTMLCode = '<a><button class="iap-move-left">已订阅</button></a><p class="iap-teaser">'+ productPrice + '/年' + '</p>'; 
//             } 
//             recordSuccessBuyInLocal();
//             updateProductStatus(productIndex, true, true);
//             break;
//         case 'fail':
//             if (productType === 'membership') {  
//                 turnonOverlay('iap-hint');
//                 var isFTCpw = Boolean(Number(getCookie('isFTCw')));
//                 if(!isPremium && !isFTCpw){
//                     iapHTMLCode = '<a onclick="getWxBuyCode(\''+ productID +'\',\''+ upgradePrice +'\',\''+ gUserId +'\',\''+ productName +'\',\''+ tradeNum +'\')"><button class="iap-move-left">现在升级</button></a><p class="iap-teaser">¥' + upgradePrice + '.00/年' + '</p>';  
//                 }else{
//                     iapHTMLCode = '<a onclick="getWxBuyCode(\''+ productID +'\',\''+ productPrice +'\',\''+ gUserId +'\',\''+ productName +'\',\''+ tradeNum +'\')"><button class="iap-move-left">订阅</button></a><p class="iap-teaser">' + productPrice + '/年' + '</p>';
//                 }
                
                
//             } 
//             updateProductStatus(productIndex, false, false); 
//             break;
//         default:
//             if (productType === 'membership') {  
//                 turnonOverlay('iap-hint');
//                 iapHTMLCode = '<a onclick="getBuyCode(\''+ productID +'\',\''+ productPrice +'\',\''+ gUserId +'\',\''+ productName +'\',\''+ tradeNum +'\')"><button class="iap-move-left">订阅</button></a><p class="iap-teaser">' + productPrice + '/年' + '</p>'; 
//             } 
//             updateProductStatus(productIndex, false, false); 
//             break;
//     }
//     // MARK: - for each of the iap button containers that fit the criteria, update its innerHTML
//     if (iapButtons.length>0){
//         for (var i = 0,len=iapButtons.length; i < len; i++) {
//             if (productID === iapButtons[i].getAttribute('product-id')) {
//                 iapButtons[i].innerHTML = iapHTMLCode; 
//             } else if (productID === '') {
//                 iapHTMLCode = '<a><button class="iap-move-left">正在请求</button></a>';
//                 iapButtons[i].innerHTML = iapHTMLCode;
//             }
//         }
//     }

//     // MARK: - Send Event to GA and Other Analytics
//     var eventAction = 'Buy ' + actionType + ': ' + productID;
//     ga('send','event','Android Privileges', eventAction, window.gSubscriptionEventLabel);

// }



