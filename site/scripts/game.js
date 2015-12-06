/* globals $: false */
/* globals Console: false */
/* globals setTimeout: false */
/* jslint node: true */


//A node class to represent a graph.
function Node(name, txt, secondVisitTxt)
{
    this.name = name;
    this.text = txt;
    this.secondVisitTxt = secondVisitTxt;
    this.branches={}; //Every object is a hash table......... .__.
    this.visited = false;
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
    if(transition in this.branches)
        return this.branches[transition];
    else
        return null;
};

//Change the text of a particular node
Node.prototype.setText = function(txt)
{
    this.text=txt;
    return this;
};

Node.prototype.print = function()
{
    Console.writeSlowly(this.name, false);
    
    if(!this.visited)
    {
        Console.writeSlowly(this.text, false);
    }
    else
    {
        if(this.secondVisitTxt!==undefined)
        {
            Console.writeSlowly(this.secondVisitTxt);
        }
    }
};



function initGraph()
{
    var root = new Node("Computer Room", "You find yourself looking at a dark console window, unsure of what to do. Naturally you grow bored and wish to leave. East of you is the kitchen, while north is the exit from the house. Where will you go?", "Back here, huh.");
    
    var kitchen = root.addNode(new Node("Kitchen", "Having entered the kitchen, you realise that you're kinda bored here as well. All that you can really do is go back. What now, pumpkin?"), "e");
    
    kitchen.addNode(root, "w");
    
    var outside = root.addNode(new Node("Outside", "As you step outside, the frigid air assaults your lungs, making you want to go back inside. But lo! You locked yourself out! How typical! Now you're stuck there. GOOD JOB -.-"), "n");
    
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