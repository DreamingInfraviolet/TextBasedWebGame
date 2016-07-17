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