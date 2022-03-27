var keydown = false;//added user control (for now to verify things work)
var numBots = 1; //number of bots to spawn
var generationTicks = 200; //number of ticks per generation
var reproduceAmount = numBots/2; //amount of bots chosen to reproduce
var reproduceChance = 0.5; //reproduceAmount = reproduceChance*numBots
var botSize = 0.5; //size of the bot on screen

// create engine
var engine = Engine.create(),
		world = engine.world;

// create renderer
var render = Render.create({
		element: document.body,
		engine: engine,
		options: {
				width: 800,
				height: 600,
				showVelocity: false
		}
});

Render.run(render); //automatically renders for us :D

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

//make bots!
var bots = []

for(var i = 0; i < numBots; i++){
	bots.push(new Bot(botSize));
}

var ground = Bodies.rectangle(400, 600, 1600, 100, {isStatic:true});

//add things to the world
Composite.add(world, [ground]);

for(var i = 0; i < numBots; i++){
	Composite.add(world, [bots[i].body, bots[i].thigh, bots[i].shin, bots[i].bodyToThigh, bots[i].thighToShin]);
}

// fit the render viewport to the scene
Render.lookAt(render, {
		min: { x: 0, y: 0 },
		max: { x: 800, y: 600 }
});

var tickNum = 0;
//var cur_action = bot.action(false);

var ticksPerAction = 100; //in how many ticks does the bot take one action

Events.on(runner, "afterTick", function(){
	tickNum++;
	
	if(tickNum % ticksPerAction == 0){ //make bots move every ticksPerAction ticks
		for(var i = 0; i < numBots; i++){
			console.log("action!");
			console.log(bots[i].body.position)
			bots[i].action(true);
		}
	}

	if(tickNum % generationTicks == 0){
		console.log("new generation");
		bots.sort((botA, botB) => {
			return botB.body.position.x > botA.body.position.x; //sort bots by distance travelled (fitness function)
		});

		var newGeneration = [];
		
		for(var i = 0; i < bots.length; i++){ //choose bots to reproduce; the better the bot, the more likely it will reproduce
			if(Math.random() < reproduceChance){
				//console.log("aaaa");
				var child_model = bots[i].makeChild(0.1);
				//console.log(child_model);
				var childBot = new Bot(botSize);
				childBot.model = child_model;
				console.log("child position");
				console.log(childBot.body.position);
				
				newGeneration.push(childBot)

				//console.log(childBot.body.position);
			}
		}

		for(var i = 0; i < numBots-newGeneration.length; i++){ //introduce new bots to environment
			newGeneration.push(new Bot(botSize));
		}

		for(var i = 0; i < bots.length; i++){
			Composite.remove(world, [bots[i].body, bots[i].thigh, bots[i].shin, bots[i].bodyToThigh, bots[i].thighToShin]);
		}
		
		//console.log(newGeneration);
		bots = newGeneration;
		//console.log(bots);

		for(var i = 0; i < numBots; i++){
			Composite.add(world, [bots[i].body, bots[i].thigh, bots[i].shin, bots[i].bodyToThigh, bots[i].thighToShin]);
		}
	}
});