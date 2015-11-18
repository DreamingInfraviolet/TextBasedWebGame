var acceptInput = false;

var waitingNotifierBlinkTime = 200;
var waitingNotifierFadeTime = 1000;
var lastBlinkStartTime = Date.now()-waitingNotifierBlinkTime*4;
var userWriteDelay = 50;
var systemWriteDelay = 200;
var textFadeInTime = 500;

//Not that slowWritingCharDelay must be greater than 2*slowWritingTimeJitter!
//Otherwise the jitter can result in an incorrect sequence of characters.
var slowWritingCharDelay = 150;
var slowWritingTimeJitter = 40;

function setAcceptInput(value)
{
        acceptInput = value;
        if(value==true)
            $("#waiting_notifier").fadeOut(waitingNotifierFadeTime);
        else
            $("#waiting_notifier").fadeIn(waitingNotifierFadeTime);
}

$(document).ready(function()
{
    writeSlowly("Wake up, N\u200C\u200C\u200C\u200C\u200Ceo.", false);

    $("form").submit(function()
    {
        if(acceptInput==true)
        {
            var input = cleanInput($("#console_input").val());
            writeFade(input, true);
            
            setTimeout(function() {handleInput(input)}, 500);

            //Scroll down. Setting this to a big value, as it seems to designate the limit of scrolling.
            $("#console_text").scrollTop(2000000000);
            $("#console_input").val("");
        }
        else
        {
            if(Date.now()>lastBlinkStartTime+waitingNotifierBlinkTime*4)
            {
                    $("#waiting_notifier").fadeOut(waitingNotifierBlinkTime)
                                          .fadeIn(waitingNotifierBlinkTime)
                                          .fadeOut(waitingNotifierBlinkTime)
                                          .fadeIn(waitingNotifierBlinkTime);
                lastBlinkStartTime = Date.now();
            }
        }
    });

    setTimeout(function()
    {
        writeSlowly("The Matrix has you.");
        setTimeout(function()
        {
            writeSlowly("Follow the white rabbit.");
            setAcceptInput(true);
        }, 5000);
    }, 5000);
});

function cleanInput(input)
{
    return input.trim();
}

function handleInput(input)
{
    if(input=="help")
        writeSlowly("Help yourself, smoochie", false);
    else if(input=="cls" || input=="clear")
        clearConsole();
}

function writeFade(text, isByUser)
{
    setTimeout((function(text, isByUser)
    {
        var c = isByUser ? "user_output" : "console_output";
        $("#message_template").clone()
            .text(text)
            .removeAttr("id")
            .attr("class", c)
            .insertBefore("#placeholder")
            .fadeIn(textFadeInTime);
    }) (text, isByUser), isByUser==true ? userWriteDelay:systemWriteDelay);
}

/* Writes an array of words, one letter at a time. The letter '|' means a pause. */
function writeSlowly(text, isByUser)
{
        setTimeout((function(text, isByUser)
    {
        var inputDisabledAtStart = !acceptInput;
        //Disable input so that it would not disturb subsequent writing.
        setAcceptInput(false);

        var c = isByUser ? "user_output" : "console_output";
        var component = $("#message_template").clone()
            .text("")
            .removeAttr("id")
            .attr("class", c)
            .insertBefore("#placeholder")
            .attr("style", "display:visible");


        for(var i = 0; i < text.length; ++i)
        {
            (function(index)
            {
                setTimeout(function()
                {
                    component.text(component.text()+text[index]);
                }, slowWritingCharDelay*i + Math.floor((Math.random()-0.5)*2*slowWritingTimeJitter));
            })(i); //Currying!
        }

        //Restore input when done
        if(!inputDisabledAtStart)
            setTimeout(function() { setAcceptInput(true); }, (text.length+1)*slowWritingCharDelay);

    }) (text, isByUser), isByUser==true ? userWriteDelay:systemWriteDelay);
}