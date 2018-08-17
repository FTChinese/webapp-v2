// function ecommerceTrack(id,affiliation,price,productName){
//     ga('ecommerce:addTransaction', {
//     'id': id,                     // Transaction ID. Required.
//     'affiliation': affiliation,   // Affiliation or store name.
//     'revenue': price,               // Grand Total.
//     'shipping': '0',                  // Shipping.
//     'tax': '0' ,
//     'currency': 'CNY'                     // Tax.
//     });

//     ga('ecommerce:addItem', {
//     'id': id,                     // Transaction ID. Required.
//     'name': productName,    // Product name. Required.
//     'sku': productName,                 // SKU/code.
//     'category': 'Android Subscription',         // Category or variation.
//     'price': price,                 // Unit price.
//     'quantity': '1'                   // Quantity.
//     });

//     ga('ecommerce:send');
// }


// Mark:使用增强型ecommerce跟踪

var listName = 'androidMembership';
var category = 'membership';


// 把交易号放在cookie里，这样buy success能获取到此交易号，把成功页面现有的代码暂时隐藏
// 生成交易号，交易号为全局的，这样display和
// 放入订阅页面
function productImpression(){ 
    ga('ec:addImpression', { // Provide product details in an impressionFieldObject
    'id': 'ftc_standard',                   // Product ID (string).
    'name': 'ftc_standard',  // Product name (string)
    'category': category,  // Product category (string)
    'brand': 'FTC',    // Product brand (string)
    'list': listName,   // Product list (string)
    'position': 1                    
    });

    ga('ec:addImpression', {
    'id': 'ftc_premium',
    'name': 'ftc_premium',
    'category': category,
    'brand': 'FTC',
    'list': listName,
    'position': 2
    });

    addProduct();
    ga('send', 'pageview');  // Send product impressions with initial pageview.

}

function addProduct(){
    ga('ec:addProduct', {     // Provide product details in a productFieldObject.
    'id': 'ftc_standard',                   // Product ID (string).
    'name': 'ftc_standard', // Product name (string).
    'category': listName,            // Product category (string).
    'brand': 'FTC',                // Product brand (string).
    'position': 1                    // Product position (number).
    });
    ga('ec:addProduct', {     // Provide product details in a productFieldObject.
    'id': 'ftc_premium',                   // Product ID (string).
    'name': 'ftc_premium', // Product name (string).
    'category': listName,            // Product category (string).
    'brand': 'FTC',                // Product brand (string).
    'position': 2                    // Product position (number).
    });

    ga('ec:setAction', 'detail');
}


// 出来订阅页面，可以addPromotion，放入订阅页面
function addPromotion(id,name){
    ga('ec:addPromo', {               // Promo details provided in a promoFieldObject.
    'id': id,             // Promotion ID. Required (string).
    'name': name,          // Promotion name (string).
    'creative': category,   // Creative (string).
    'position': 'android side'      // Position  (string).
    });
}

function onProductClick(name,position) {
  ga('ec:addProduct', {
    'id': name,
    'name': name,
    'category': listName,
    'brand': 'FTC',
    'position': position
  });
  ga('ec:setAction', 'click', {list: listName});
  ga('send', 'event', 'UX', 'click', 'Results');
}


// 当点击立即订阅时，调用此
function onPromoClick(id,name) {
  ga('ec:addPromo', {
    'id': id,
    'name': name,
    'creative': category,
    'position': 'android side'
  });

  // Send the promo_click action with an event.
  ga('ec:setAction', 'promo_click');
  ga('send', 'event', 'Internal Promotions', 'click', name);
}

function addTransaction(tradeId, name, price, affiliation){
    ga('set', 'currencyCode', 'CNY'); // Set tracker currency to Euros.
    ga('ec:addProduct', {
    'id': name,
    'name': name,
    'category': category,
    'brand': 'FTC',
    'price': price,
    'quantity': 1
    });

    // Transaction level information is provided via an actionFieldObject.
    ga('ec:setAction', 'purchase', {
    'id': tradeId,
    'affiliation': affiliation,
    'revenue': price,
    'tax': 0,
    'shipping': 0,
    'list': listName
    });

    ga('send', 'pageview');     // Send transaction data with initial pageview.
}