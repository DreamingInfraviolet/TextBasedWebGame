var acceptInput = false;

var waitingNotifierBlinkTime = 200;
var waitingNotifierFadeTime = 1000;
var lastBlinkStartTime = Date.now()-waitingNotifierBlinkTime*4;
var userWriteDelay = 50;
var systemWriteDelay = 800;
var textFadeInTime = 50;

//Not that slowWritingCharDelay must be greater than 2*slowWritingTimeJitter!
//Otherwise the jitter can result in an incorrect sequence of characters.
var slowWritingCharDelay = 110;
var slowWritingTimeJitter = 25;

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
    setAcceptInput(true);
    writeSlowly("Wake up, Neo.", false);
    writeSlowly("The Matrix has you.");
    writeSlowly("Follow the white rabbit.");

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
});

function cleanInput(input)
{
    return input.replace(/\s+/g, ' ').trim();
}

function handleInput(input)
{
    words = input.split(" ");
    var matched = false;

    switch(words.length)
    {
        case 1:
            if(words[0]=="help")
                matched = writeSlowly("Help yourself, smoochie", false);
        break;
        case 2:
        break;
        case 3:
        break;
        case 0:
        break;
    }

    if(!matched)
    {
        //If we got here, the input was not recognised.
        writeSlowly("Unrecognised input.", false);
    }
}

/** Always returns true. */
function writeFade(text, isByUser)
{
    setTimeout(function()
    {
        var c = isByUser ? "user_output" : "console_output";
        $("#message_template").clone()
            .text(text)
            .removeAttr("id")
            .attr("class", c)
            .insertBefore("#placeholder")
            .fadeIn(textFadeInTime);

        $("#console_text").scrollTop(2000000000);
    }, isByUser ? userWriteDelay:systemWriteDelay);
    return true;
}

/* Writes an array of words, one letter at a time. The letter '|' means a pause. Always returns true. */
function writeSlowly(text, isByUser)
{
    var inputDisabledAtStart = !acceptInput;
    //Disable input so that it would not disturb subsequent writing.
    setAcceptInput(false);

    setTimeout(function()
    {

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

    }, isByUser==true ? userWriteDelay:systemWriteDelay);

    return true;
}