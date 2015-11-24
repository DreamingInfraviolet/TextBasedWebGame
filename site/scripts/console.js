/* globals $: false */
/* globals setTimeout: false */
/* jslint node: true */

"use strict";

var Console =
{
    acceptInput              : false,
    waitingNotifierBlinkTime : 200,
    waitingNotifierFadeTime  : 1000,
    lastBlinkStartTime       : 0,
    userWriteDelay           : 50,
    systemWriteDelay         : 800,
    textFadeInTime           : 50,

    //Not that slowWritingCharDelay must be greater than 2*slowWritingTimeJitter!
    //Otherwise the jitter can result in an incorrect sequence of characters.
    slowWritingCharDelay     : 110,
    slowWritingTimeJitter    : 25,

    //\u200c is an invisible character. Use it to make slow printing pause for a little bit.

    setAcceptInput : function(value)
    {
            this.acceptInput = value;
            if(value===true)
                $("#waiting_notifier").fadeOut(this.waitingNotifierFadeTime);
            else
                $("#waiting_notifier").fadeIn(this.waitingNotifierFadeTime);
    },

    cleanInput : function(input)
    {
        return input.replace(/\s+/g, ' ').trim();
    },

    /** Always returns true. */
    writeFade : function(text, isByUser)
    {
        var that = this;
        
        setTimeout(function()
        {
            var c = isByUser ? "user_output" : "console_output";
            $("#message_template").clone()
                .text(text)
                .removeAttr("id")
                .attr("class", c)
                .insertBefore("#placeholder")
                .fadeIn(this.textFadeInTime);

            $("#console_text").scrollTop(2000000000);
        }, isByUser ? that.userWriteDelay:that.systemWriteDelay);
        return true;
    },

    /* Writes an array of words, one letter at a time. Always returns true. */
    writeSlowly : function(text, isByUser)
    {
        var inputDisabledAtStart = !this.acceptInput;
        //Disable input so that it would not disturb subsequent writing.
        this.setAcceptInput(false);

        var that = this;
        
        setTimeout(function()
        {
            var c = isByUser ? "user_output" : "console_output";
            var component = $("#message_template").clone()
                .text("")
                .removeAttr("id")
                .attr("class", c)
                .insertBefore("#placeholder")
                .attr("style", "display:visible");

            
            $.each(text.split(''), function(i, txt)
            {
                setTimeout(function()
                {
                    component.text(component.text()+txt);
                    $("#console_text").scrollTop(2000000000);
                }, that.slowWritingCharDelay*i + Math.floor((Math.random()-0.5)*2*that.slowWritingTimeJitter));
            });

            //When done,
            if(!inputDisabledAtStart)
            {
                setTimeout(function()
                {
                    Console.setAcceptInput(true);
                }, (text.length+1)*that.slowWritingCharDelay);
            }

        }, isByUser===true ? this.userWriteDelay:this.systemWriteDelay);

        return true;
    },
    
    blinkWaitingNotifier : function()
    {
        if(Date.now()>this.lastBlinkStartTime+this.waitingNotifierBlinkTime*4)
        {
            $("#waiting_notifier").fadeOut(this.waitingNotifierBlinkTime)
                          .fadeIn(this.waitingNotifierBlinkTime)
                          .fadeOut(this.waitingNotifierBlinkTime)
                          .fadeIn(this.waitingNotifierBlinkTime);
            Console.lastBlinkStartTime = Date.now();
        }
    },
    grabInput : function() 
    {
        var input = this.cleanInput($("#console_input").val());
        return input;
    },
};
