var acceptInput = false;

var waitingNotifierBlinkTime = 200;
var lastBlinkStartTime = Date.now()-waitingNotifierBlinkTime*4;

function setAcceptInput(value)
{
        acceptInput = value;
        if(value==true)
            $("#waiting_notifier").fadeOut(3000);
        else
            $("#waiting_notifier".fadeIn(3000));
}

$(document).ready(function()
{
    writeLine("Wake up, Neo.", false);

    $("form").submit(function()
    {
        if(acceptInput==true)
        {
            var input = cleanInput($("#console_input").val());
            writeLine(input, true);
            
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
        writeLine("The Matrix has you.");
        setTimeout(function()
        {
            writeLine("Follow the white rabbit.");
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
        writeLine("Help yourself, smoochie", false);
    else if(input=="cls" || input=="clear")
        clearConsole();
}

function writeLine(text, isByUser)
{
    var c = isByUser ? "user_output" : "console_output"
    $("#message_template").clone()
        .text(text)
        .removeAttr("id")
        .attr("class", c)
        .insertBefore("#placeholder")
        .fadeIn(1400);
}