
var worldRoot = new Node("Computer Room", "You find yourself looking at a dark console window, unsure of what to do. Naturally you grow bored and wish to leave. East of you is the kitchen, while north is the exit from the house. Where will you go?", "Back here, huh.");

var kitchen = worldRoot.addNode(new Node("Kitchen", "Having entered the kitchen, you realise that you're kinda bored here as well. All that you can really do is go back. What now, pumpkin?"), "e");

kitchen.addNode(worldRoot, "w");

var outside = worldRoot.addNode(new Node("Outside", "As you step outside, the frigid air assaults your lungs, making you want to go back inside. But lo! You locked yourself out! How typical! Now you're stuck there. GOOD JOB -.-"), "n");
