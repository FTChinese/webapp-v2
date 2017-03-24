function socialLogin(socialName, socialInfo) {
	var socialLoginUrl = '/index.php/users/socialLogin/' + socialName;
    $('#yourDevice .padding').html(socialLoginUrl);
    $.ajax({
        type: 'POST',
        url: socialLoginUrl,
        data: {'socialInfo': socialInfo},
        success: function(data) {
            if (data === 'yes') {
                // show this in the interface so that users know login is successful
                username = getCookie('USER_NAME') || '';
                checkLogin();
            // print the result for review
            $('#yourDevice .overlay-header p').html('登录成功');
            $('#yourDevice .padding').html('亲爱的用户，您已经成功登录。');
                // send an even to GA
                return;
            }
            // if return data is not correct
            $('#yourDevice .overlay-header p').html('登录失败');
            $('#yourDevice .padding').html(data + '亲爱的用户，由于FT中文网的服务器未能正确响应，所以您未能成功登录。请稍后再试，或尝试其他登录方式。');
        },
        error: function() {
            // show this in the interface so that users know login failed
            $('#yourDevice .overlay-header p').html('登录失败');
            $('#yourDevice .padding').html('亲爱的用户，由于FT中文网的服务器未能响应，所以你未能成功登录。请稍后再试，或尝试其他登录方式。');
            // track the event on GA

            return;
        }
    });

    // print it some where for review
    turnonOverlay('yourDevice');
    //$('#yourDevice .overlay-header p').html(socialName);
    //$('#yourDevice .padding').html(socialInfo);
}