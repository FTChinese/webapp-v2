//tracker start
!function(t){var e;e=function(){function t(t){i=t||i,i=encodeURIComponent(i),o=[].concat(JSON.parse(null==n()?"{}":n()))}var e,i,n,s,o,r,a,l,d,c,h;return o=[],s=!1,e=navigator.onLine,a=encodeURIComponent(window.parent.document.referrer||document.referrer),i="unspecific",c=0-(new Date).getTimezoneOffset()/60,d=screen.width+","+screen.height,r="offlinePageView",n=function(){try{return localStorage.getItem(r)}catch(t){return null}},l=function(){var t,e;if(t=n(),e=JSON.stringify(o),e!==t)try{localStorage.setItem(r,e)}catch(i){}s=!1},getQuery=function(t){return"//track.ftimg.net/log/new_log.php?adch="+i+"&tzone="+c+"&sSize="+d+"&refer="+a+"&vpage="+encodeURIComponent(t)+"&rnd="+Math.random().toFixed(5)},sendToGA=function(t){ga('require', 'displayfeatures');ga('send', 'pageview', t);/*fa('send', 'pageview', t);*/},h=function(){var t,i;if(o&&o.length&&!s){for(s=!0,t=o[0];!t||"undefined"===t||"null"===t;)o.shift(),t=o[0];i=new Image,i.onload=function(){e=!0,sendToGA(t),o.shift(),l(),o.length&&h()},i.onerror=function(){e=!1,l()},i.src=getQuery(t)}},t.prototype.isAccessible=function(){return e},t.prototype.valueOf=function(){return o},t.prototype.toString=function(){return n()},t.prototype.push=function(t){t&&(o.push(t),h())},t}(),"undefined"!=typeof this.module&&this.module.exports?this.module.exports=e:this[t]=e}.call(this,"FTCTracker");
//tracker end