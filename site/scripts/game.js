/* globals $: false */
/* globals Console: false */
/* globals setTimeout: false */
/* jslint node: true */


//A node class to represent a graph.
function Node(txt)
{
    this.text = txt;
    this.branches={}; //Every object is a hash table......... .__.
}

//Add a node that can be reached if followed by the given transition.
Node.prototype.addNode = function(node, transition)
{
    return (this.branches[transition]=node);
};

//Return the node when taking a transition.
//Undefined if no such node exists.
Node.prototype.follow = function(transition)
{
    return this.branches[transition];
};

//Change the text of a particular node
Node.prototype.setText = function(txt)
{
    this.text=txt;
    return this;
};


//When ready
$(function ()
{
    Console.setAcceptInput(true);

    $("form").submit(function()
    {
        var input;
        if((input=Console.grabInput())!=="")
        {
            if(Console.acceptInput===true)
            {
                $("#console_input").val("");
                Console.writeFade(input, true);
                handleInput(input);
            }
            else
                Console.blinkWaitingNotifier();
        }
    });
});



function handleInput(input)
{
    var words = input.split(" ");
    var matched = false;

    switch(words.length)
    {
        case 1:
            if(words[0]=="help")
                matched = Console.writeSlowly("Help yourself, smoochie", false);
            else if(words[0]=="west" || words[0]=="w" || words[0]=="left")
            {
                matched = Console.writeSlowly("Moving west.", false);
            }
            else if(words[0]=="east" || words[0]=="e" || words[0]=="right")
            {
                matched = Console.writeSlowly("Moving east.", false);        
            }
            else if(words[0]=="south" || words[0]=="s" || words[0]=="down")
            {
                matched = Console.writeSlowly("Moving south.", false);
            }
            else if(words[0]=="north" || words[0]=="n" || words[0]=="up")
            {
                matched = Console.writeSlowly("Moving north.", false);
            }
            
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
        Console.writeSlowly("Unrecognised input.", false);
    }
}