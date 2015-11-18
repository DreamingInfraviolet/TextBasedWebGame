var acceptInput = false;

var waitingNotifierBlinkTime = 200;
var waitingNotifierFadeTime = 1000;
var lastBlinkStartTime = Date.now()-waitingNotifierBlinkTime*4;
var userWriteDelay = 50;
var systemWriteDelay = 200;
var textFadeInTime = 500;

//Not that slowWritingCharDelay must be greater than 2*slowWritingTimeJitter!
//Otherwise the jitter can result in an incorrect sequence of characters.
var slowWritingCharDelay = 140;
var slowWritingTimeJitter = 30;

//\u200c is an invisible character. Use it to make slow printing pause for a little bit.

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
            $("#console_input").val("");
            writeFade(input, true);
            handleInput(input);
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

        $("#console_text").scrollTop(2000000000);
    }) (text, isByUser), isByUser==true ? userWriteDelay:systemWriteDelay);
}

/* Writes an array of words, one letter at a time. The letter '|' means a pause. */
function writeSlowly(text, isByUser)
{
    var inputDisabledAtStart = !acceptInput;
        setTimeout((function(text, isByUser)
    {
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
                    $("#console_text").scrollTop(2000000000);
                }, slowWritingCharDelay*i + Math.floor((Math.random()-0.5)*2*slowWritingTimeJitter));
            })(i); //Currying!
        }

        //When done,
        if(!inputDisabledAtStart)
            setTimeout(function()
            {
                setAcceptInput(true);            
            }, (text.length+1)*slowWritingCharDelay);

    }) (text, isByUser), isByUser==true ? userWriteDelay:systemWriteDelay);
}