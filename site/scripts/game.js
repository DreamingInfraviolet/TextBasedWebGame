been_to_corridor=true;

$(document).ready(function() {

    writeLine("Wake up, Neo.", false);

    $("form").submit(function() {
        var input = $("#console_input").val();
        if(input=="help")
        {
            writeLine("Help yourself, smoochie", false);
        }
        else
        {
           writeLine(input, true);
        }

        //Scroll down. Setting this to a big value, as it seems to designate the limit of scrolling.
        $("#console_text").scrollTop(2000000000);
        $("#console_input").val("");
    });

    setTimeout(function()
    {
        writeLine("The Matrix has you.");
        setTimeout(function()
        {
            writeLine("Follow the white rabbit.");
        }, 5000);
    }, 5000);
});

function writeLine(text, isByUser)
{
    var c = isByUser ? "user_output" : "console_output"
    $("#message_template").clone()
        .text(text)
        .removeAttr("id")
        .attr("class", c)
        .insertBefore("#placeholder")
        .fadeIn(1000);
}