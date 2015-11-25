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

Node.prototype.print = function()
{
    Console.writeSlowly(this.text+"\n", false);
};



function initGraph()
{
    var root = new Node("You find yourself looking at a dark console window, unsure of what to do. Naturally you grow bored and wish to leave. East of you is the kitchen, while north is the exit from the house. Where will you go?");
    
    var kitchen = root.addNode(new Node("Having entered the kitchen, you realise that you're kinda bored here as well. All that you can really do is go back. What now, pumpkin?"), "e");
    
    kitchen.addNode(root, "w");
    
    var outside = root.addNode(new Node("As you step outside, the frigid air assaults your lungs, making you want to go back inside. But lo! You locked yourself out! How typical! Now you're stuck there. GOOD JOB -.-"), "n");
    
    return root;
}


var graph = initGraph();

//When ready
$(function ()
{
    Console.setAcceptInput(true);
    
    graph.print();
    
    
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
    Console.writeFade(prefix,false);
    graph=graph.follow(transition);
    graph.print();
    return true;
}