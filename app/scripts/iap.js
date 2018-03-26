window.iapProducts = [{title: '普通会员',description: '<p>All the benefits of a Standard FT Subscription, plus exclusive news and analysis</p><p>Mobile and tablet access via our award-winning apps</p><p>Exclusive access to the Lex Column, and Instant Insight for comment and analysis as news unfolds</p>',price: '¥198.00',id: 'com.ft.ftchinese.mobile.subscription.premium',image: 'http://i.ftimg.net/picture/6/000068886_piclink.jpg', teaser: '注册成为普通会员', isPurchased: false, isDownloaded: false, group: 'membership', groupTitle: '会员',benefits:['- 阅读FT中文网所有独家内容','- 收听英文文章音频'],period:'year'},{title: '高端会员',description: '<p>Unlimited access to all Standard-access articles and blogs</p><p>Mobile and tablet access via our award-winning apps</p><p>Personalised email briefings and alerts</p><p>Portfolio tools to track your investments</p>',price: '¥1,998.00',id: 'com.ft.ftchinese.mobile.subscription.standard',image: 'http://i.ftimg.net/picture/6/000068886_piclink.jpg', teaser: '注册成为高端会员', isPurchased: false, isDownloaded: false, group: 'membership', groupTitle: '会员',benefits:['- 《FT编辑精选》，每周不可错过的独家必读内容','- 获得两张价值3999元的FT中文网年会门票','- 阅读FT中文网所有独家内容','- 收听英文文章音频'],period:'year'}];

var subscribeIntruction = {
    title: '订阅说明与注意事项',
    items: [
        {headline: '订阅价格与周期', lead: '您可以在应用内订阅《FT中文网会员》和《FT中文网高端会员》两种服务。《FT中文网会员》每年订阅价格为 198元（$28.99），订阅后您可以解锁阅读FT中文网每日新增的两篇独家文章内容，以及解锁双语文章的英语语音服务。《FT中文网高端会员》每年订阅价格为 1998元（$294.99），订阅后您可以解锁《FT中文网会员》提供的所有服务，再加上每周的《编辑精选》周刊。'}
    ],
    moreService: ['隐私申明','用户协议','反馈']
}
// FT010 123 1522033086
// （普通会员——FT + 010 + 000~999随机数 + 时间戳）
// （高级会员——FT + 100 + 000~999随机数 + 时间戳）

function getOrderNum(memberNum){
    var randomVal = Math.round(Math.random()*999);
    var newRandomVal = '';
    var orderNum = '';
    if (Math.floor(randomVal/10) === 0){
        newRandomVal = '00' + randomVal;
    }else if(String(Math.floor(randomVal%100)).length === 2){
        newRandomVal = '0' + randomVal;
    }else{
        newRandomVal = randomVal;
    }
    var time = Math.round(new Date().getTime()/1000);   
    orderNum = 'FT' + memberNum + time;
    return orderNum;
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
        var productsHTML = getProductHTMLCode(products, 'all');
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
function getProductHTMLCode(products, forGroup) {
    var productsHTML = '';
    var currentGroup = '';
    var productLen = products.length
    if (typeof products === 'object' && productLen > 0) {
        for (var i = 0; i < productLen; i++) {
            if (forGroup === 'all' || forGroup === products[i].group) {
                var firstChildClass = '';
                var productActionButton = '';
                var productPrice = products[i].price || '购买';
                var productBenefits = '';
                var benefitsArray = [];
                var productName = products[i].title || '';
                // MARK: If the forGroup is set to all, display all products in groups
                if (forGroup === 'all' && currentGroup !== products[i].group) {
                    currentGroup = products[i].group;
                    productsHTML += '<div class="section"><a class="iap-channel" iap-action="' + currentGroup + '" iap-title="' + products[i].groupTitle + '"><span>' + products[i].groupTitle + '</span></a><a href="restorepurchases://"><button class="floatright">恢复</button></a></div>';
                    firstChildClass = ' first-child';
                }
                if (products[i].expire) {
                    // MARK: There is expire
                    if (products[i].group === 'membership') {
                        // MARK: - Button HTML for membership
                        productActionButton = '<div class="iap-button" product-id="' + products[i].id + '" product-price="' + productPrice + '" product-title="' + productName + '"><a'+getBuyCode(products[i].id, productPrice, gUserId, productName)+'><button class="iap-move-left">续订</button></a><p class="iap-teaser">您已订阅'+ productName +'，到期日为' + products[i].expire + '</p></div>';
                    } else if (products[i].group === 'subscription') {
                        productActionButton = '';
                    }
                }else if (products[i].isPurchased === true) {
                    if (products[i].group === 'membership') {
                        // MARK: - Button HTML for membership
                        productActionButton = '<div class="iap-button" product-id="' + products[i].id + '" product-price="' + productPrice + '" product-title="' + productName + '"><a><button class="iap-move-left">已订阅</button></a><p class="iap-teaser">' + products[i].price + '/年' + '</p></div>';
                    } else if (products[i].group === 'subscription') {
                        productActionButton = '';
                    }
                } else {
                    if (products[i].group === 'membership') {
                        // MARK: - Button HTML for membership
                        productActionButton = '<div class="iap-button" product-id="' + products[i].id + '" product-price="' + productPrice + '" product-title="' + productName + '"><a'+getBuyCode(products[i].id, productPrice, gUserId, productName)+'><button class="iap-move-left">订阅</button></a><p class="iap-teaser">' + products[i].price + '/年' + '</p></div>';
                    }
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
                    // productsHTML += '<div product-id="' + products[i].id + '" product-price="' + productPrice + '" product-title="' + productName + '" class="iap-item oneStory' + firstChildClass + ' track-click" eventLabel="iap-detail: ' + i + '"><div onclick="showProductDetail(\'' + products[i].id + '\');"><img src="https://www.ft.com/__origami/service/image/v2/images/raw/' + products[i].image + '?source=ftchinese&width=160" class=leftimage width="80"><div class="headline">' + products[i].title + '</div><div class=lead>' + products[i].teaser + '</div></div>' + productActionButton + '<div class=clearfloat></div></div>';
                }
            }
        }
    }
    return productsHTML;
}

// MARK: - extract product information and display it to home or channel page
function displayProducts(products, page, pageTitle) {
    if (typeof products === 'object' && products.length > 0) {
        // TODO: Page should be used as a filter, for example, "ebook" should be used to extra only the eBooks from the iapProducts
        // page:products group; products: products
        var productsHTML = getProductHTMLCode(products, page);
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
        //   window.location.href = url;
          window.open(url);
          console.log('open policy');
        });
    }
}

// MARK: - Update window.iapProducts after user act on any one of the products
function updateProductStatus(productIndex, isProductPurchased, isProductDownloaded) {
    if (productIndex >= 0 && window.iapProducts[productIndex]) {
        window.iapProducts[productIndex].isPurchased = isProductPurchased;
    }
}

// MARK: - Update DOM UI based on user actions
function iapActions(productID, actionType, expireDate) {    
    var iapButtons='';
    var iapRailHTML = '';
    var iapHTMLCode = '';
    var productPrice = '';
    var productTeaser = '';
    var productIndex = 0;
    var productName ='';
    var productExpire = '为止';
    var memberNum = '';
    // MARK: get iapButtons based on the current view
    var currentView = 'fullbody';
    if (gNowView.indexOf('storyview') >= 0) {
        currentView = 'storyview';
    } else if (gNowView.indexOf('channelview') >= 0) {
        currentView = 'channelview';
    }
    
    iapButtons = document.getElementById(currentView).querySelectorAll('.iap-button');

    productIndex = getproductIndex(productID)

    // MARK: - get product price here
    productPrice = window.iapProducts[productIndex].price || '0￥';
    productTeaser = window.iapProducts[productIndex].teaser || '';
    productName = window.iapProducts[productIndex].title || '';

    // MARK: - Get product type based on its identifiers
    var productType = '';
    if (/premium$|standard$|trial$/.test(productID)) {
        productType = 'membership';
    }else {
        productType = 'eBook';
    }
    if (/premium$/.test(productID)) {
        memberNum = '010';
    }else if (/standard$/.test(productID)){
        memberNum = '100';
    }
    var orderNum = getOrderNum(memberNum);
    postPayState(productID, productPrice, gUserId, orderNum, actionType);
    // MARK: - iapHTMLCode is used for home and channel page, iapRailHTML is used for product detail page
    switch (actionType) { 
        case 'success':
            if (productType === 'membership') {
                productExpire = expireDate || '未知';
                iapHTMLCode = '<a><button class="iap-move-left">已订阅</button></a><p class="iap-teaser">'+ productPrice + '/年' + '</p>';
                
            } 
            updateProductStatus(productIndex, true, true);
            break;
        case 'fail':
            if (productType === 'membership') {  
                // alert('交易失败，您的钱还在口袋里');
                turnonOverlay('iap-hint');
                iapHTMLCode = '<a'+getBuyCode(productID, productPrice, gUserId, productName)+'><button class="iap-move-left">订阅</button></a><p class="iap-teaser">' + productPrice + '/年' + '</p>'; 
            } 
            updateProductStatus(productIndex, false, false); 
            break;
        default:
    }
    // MARK: - for each of the iap button containers that fit the criteria, update its innerHTML
    if (iapButtons.length>0){
        for (var i = 0,len=iapButtons.length; i < len; i++) {
            if (productID === iapButtons[i].getAttribute('product-id')) {
                iapButtons[i].innerHTML = iapHTMLCode; 
            } else if (productID === '') {
                iapHTMLCode = '<a'+getBuyCode(iapButtons[i].getAttribute('product-id'), iapButtons[i].getAttribute('product-price'), gUserId, iapButtons[i].getAttribute('product-title'))+'><button class="iap-move-left">' + productPrice + '</button></a>';
                iapButtons[i].innerHTML = iapHTMLCode;
            }
        }
    }
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
function getBuyCode(productId, productPrice, userId, productName) {
    
    var buyCode = ''; 
    var priceForAndroid = '';
    if (productId==='com.ft.ftchinese.mobile.subscription.premium'){
        priceForAndroid = '0.01';
    }else{
        priceForAndroid = '0.02';
    }
    
    if(osVersion.indexOf('Android')<0){
        buyCode = ' href="buy://' + productId + '"';
    } else {
        buyCode = ' onclick="ftjavacriptapp.payzfb(\''+ productId +'\',\''+ priceForAndroid +'\',\''+ userId +'\',\''+ productName +'\')"';
    }

    return buyCode;
}

// MARK: - Test paywall for Android
function postPayState(productId, productPrice, userId, orderNum, actionType){
    if (!!userId){
        var xhrpw = new XMLHttpRequest();
        xhrpw.open('post', 'http://www.ftacademy.cn/index.php/pay/app');
        xhrpw.setRequestHeader('Content-Type', 'application/text');
        var payInfo = {
            productId:productId,
            productPrice:productPrice,
            userId:userId,
            orderNum:orderNum,
            actionType:actionType
        }
        xhrpw.onload = function() {
            if (xhrpw.status === 200) {
                var data = xhrpw.responseText;
                var dataObj = JSON.parse(data); 
                // console.log('get data:'+data);
    
            } else {
                console.log('fail to get st');
            }
        };
        xhrpw.send(payInfo);
    }

}


$('body').on('click', '#iap-know', function(){
    $('#iap-hint').removeClass('on');
});

// MARK: - Open the product detail page so that user can buy, download and use the product
// Not for membership
// function showProductDetail(productId) {
//     // MARK: - Get current product information
//     var currentProduct;
//     if (typeof iapProducts === 'object' && iapProducts.length > 0) {
//         for (var i = 0; i < iapProducts.length; i++) {
//             if (iapProducts[i].id === productId) {
//                 currentProduct = iapProducts[i];
//                 break;
//             }
//         }
//     }
//     // MARK: - Display the story view
//     if (typeof currentProduct === 'object') {
//         // MARK: - Calculate Product Information
//         var storyView = document.getElementById('storyview');
//         var imageHTML = '<div class="leftPic imageloaded"><img src="https://www.ft.com/__origami/service/image/v2/images/raw/' + currentProduct.image + '?source=ftchinese&width=414"></div>';

//         // MARK: - Get iap-rail Dom innerHTML to display two buttons at the bottom of product detail 
//         var iapRailHTML = '';


//         // MARK: - Update Dom here
//         storyView.querySelector('.storydate').innerHTML = '';
//         storyView.querySelector('.storybyline').innerHTML = '';
//         storyView.querySelector('.storytitle').innerHTML = currentProduct.title;
//         document.getElementById('bodytext').innerHTML = imageHTML + currentProduct.description;
//         document.getElementById('header-title').innerHTML = currentProduct.groupTitle || '';

//         // MARK: - Update the iap-rail Button
//         document.getElementById('iap-rail').innerHTML = iapRailHTML;
//         document.getElementById('iap-rail').setAttribute('data-id', productId);
//         document.getElementById('iap-rail').setAttribute('data-price', currentProduct.price);

//         // MARK: - Display the storyview by changing the className of body
//         document.body.className = 'storyview story-iap';
//         gNowView = 'storyview';
//         addStoryScroller();

//         // MARK: - Send Traffic Data so that this can be tracked
//         httpspv(gDeviceType + '/storypage/iap' + productId);

//         // MARK: update the hist array so that it can be swiped back
//         if (hist && ((hist[0] && hist[0].url != 'story/' + productId) || hist.length == 0)) {
//             hist.unshift({ 'url': 'story/' + productId, 'title': currentProduct.title });
//         }
//     }
// }