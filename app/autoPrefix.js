function autoPrefix(){
    var _vendorCSSPrefix;
    var _vendorStylePropertyPrefix;
    var _vendorTransformLookup;
    var _transformProperty;
    var _transitionProperty;
    if (document.createElement('div').style.transform !== undefined) {
        _vendorCSSPrefix = '';
        _vendorStylePropertyPrefix = '';
        _vendorTransformLookup = 'transform';
    } else if (window.opera && Object.prototype.toString.call(window.opera) === '[object Opera]') {
        _vendorCSSPrefix = '-o-';
        _vendorStylePropertyPrefix = 'O';
        _vendorTransformLookup = 'OTransform';
    } else if (document.documentElement.style.MozTransform !== undefined) {
        _vendorCSSPrefix = '-moz-';
        _vendorStylePropertyPrefix = 'Moz';
        _vendorTransformLookup = 'MozTransform';
    } else if (document.documentElement.style.webkitTransform !== undefined) {
        _vendorCSSPrefix = '-webkit-';
        _vendorStylePropertyPrefix = 'webkit';
        _vendorTransformLookup = '-webkit-transform';
    } else if (typeof navigator.cpuClass === 'string') {
        _vendorCSSPrefix = '-ms-';
        _vendorStylePropertyPrefix = 'ms';
        _vendorTransformLookup = '-ms-transform';
    } 
    _transformProperty = _vendorStylePropertyPrefix + (_vendorStylePropertyPrefix ? 'T' : 't') + 'ransform';
    _transitionProperty = _vendorStylePropertyPrefix + (_vendorStylePropertyPrefix ? 'T' : 't') + 'ransition';


    var stylesheetContainerNode = document.getElementsByTagName('head')[0] || document.documentElement;

    var newStyleNode = document.createElement('style');
    newStyleNode.type = 'text/css';  

    /// Add our rules
    var _styleText = [
        '#navOverlay {' + _vendorCSSPrefix + 'transform:translate3d(-100%,0,0);' + _vendorCSSPrefix + 'transition:all 0.5s ease-out; }', 
        '#navOverlay.on {' + _vendorCSSPrefix + 'transform: translate3d(0, 0, 0); }',
        '#fullbody,#storyview,#channelview,#adview,div.fullbody{' + _vendorCSSPrefix + 'transition: all 0.5s ease-out;}',
        '.hasScroller #fullbody,.hasScroller .storyview #channelview{'+_vendorCSSPrefix+'transform:translate3d(-100%,0,0);}',
        '.hasScroller #storyview,.hasScroller .fullbody #channelview,.hasScroller #channelview {'+_vendorCSSPrefix+'transform: translate3d(100%, 0, 0); }',
        '.hasScroller .fullbody #fullbody,.hasScroller .storyview #storyview,.hasScroller .channelview #channelview {'+ _vendorCSSPrefix +'transform: translate3d(0, 0, 0); }'
    ];

    if (newStyleNode.styleSheet) {
        newStyleNode.styleSheet.cssText = _styleText.join('\n');
    } else {
        newStyleNode.appendChild(document.createTextNode(_styleText.join('\n')));
    }

    // Add the stylesheet
    stylesheetContainerNode.insertBefore(newStyleNode, stylesheetContainerNode.firstChild);

    gPrefix = {
         verdorCSSPrefix:_vendorCSSPrefix,
         vendorStylePropertyPrefix:_vendorStylePropertyPrefix,
         vendorTransformLookup:_vendorTransformLookup,
         transformProperty:_transformProperty,
         transitionProperty:_transitionProperty
    };

    //console.log(gPrefix);

 }

 