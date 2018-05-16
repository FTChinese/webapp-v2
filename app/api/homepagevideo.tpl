



<div id="quiz-container">
                                        <a class="section" onclick="showchannel('/index.php/ft/channel/phonetemplate.html?channel=newsquiz','智趣问答')"><span>FT商学院</span></a>
                        <div class="oneStory first-child track-click" eventLabel="quiz: 0" onclick='showSlide("/index.php/ft/interactive/11835?i=2","今日新闻大事件速览（5.15）", 0)'>
                <div class="headline">今日新闻大事件速览（5.15）</div>
                <img src="http://i.ftimg.net/picture/0/000077640_piclink.jpg" class=leftimage width="167">
                <div class=lead>5.15 最新财经大事知多少：滴滴出行获准在美国哪个州进行自动驾驶汽车测试？	Def Con黑客大会首次在中国哪个城市举办？小测带你快速梳理当日财经新闻大事件。</div>
                <div class=clearfloat></div>
            </div>
                                                    </div>



<div id="special-container">
    </div>


<div id="speedread-container">
                            </div>


<div id="video-container">
    </div>

                    
<script>
    //Move the Quiz to under the news section
    if ($("#middle-quiz").length === 0 ) {
        $("#newsanchor").after("<div id='middle-quiz'></div>");
    }
    $( "#quiz-container" ).appendTo($( "#middle-quiz" ));
    //Move the Special to Cover
    if ($("#special-cover").length === 0 ) {
        $("#coveranchor").after("<div id='special-cover'></div>");
    }
    $( "#special-container" ).appendTo($( "#special-cover" ));

</script>

