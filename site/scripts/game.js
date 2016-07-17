/* globals $: false */
/* globals Console: false */
/* globals setTimeout: false */
/* jslint node: true */

function initGraph()
{
    return worldRoot;
    return root;
}


var graph = initGraph();

//When ready
$(function ()
{
    Console.setAcceptInput(true);
    
    graph.print();
    graph.visited=true;
    
    
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
                matched = takeTransition("Moving west.", "w");
            }
            else if(words[0]=="east" || words[0]=="e" || words[0]=="right")
            {
                matched = takeTransition("Moving east.", "e");
            }
            else if(words[0]=="south" || words[0]=="s" || words[0]=="down")
            {
                matched = takeTransition("Moving south.", "s");
            }
            else if(words[0]=="north" || words[0]=="n" || words[0]=="up")
            {
                matched = takeTransition("Moving north.", "n");
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

function takeTransition(prefix, transition)
{
    if(graph.follow(transition)!==null)
    {    
        Console.writeFade(prefix,false);
        graph=graph.follow(transition);
        graph.print();
        graph.visited = true;
    }
    else
        Console.writeFade("Can't go there!");
    
    return true;
}