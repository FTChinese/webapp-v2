



<div id="quiz-container">
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

