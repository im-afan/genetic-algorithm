var keydown = false;//added user control (for now to verify things work)
var numBots = 20; //number of bots to spawn
var generationTicks = 500; //number of ticks per generation

//these two variables (reproduceAmount and reproduceChance) arent used yet btw
var reproduceAmount = numBots/2; //amount of bots chosen to reproduce
var reproduceChance = 0.5; //reproduceAmount = reproduceChance*numBots 


var botSize = 0.2; //size of the bot on screen

function sigmoid(x){ //not being used atm
	return 1/(1+Math.exp(-x+numBots*reproduceChance));
}

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

var ground = Bodies.rectangle(400, 600, 1600, 100, {isStatic:true, friction:0.001});

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

var ticksPerAction = 25; //in how many ticks does the bot take one action

Events.on(runner, "afterTick", function(){
	tickNum++;
	
	if(tickNum % ticksPerAction == 0){ //make bots move every ticksPerAction ticks
		for(var i = 0; i < numBots; i++){
			bots[i].action(true);
		}
	}

	if(tickNum % generationTicks == 0){
		console.log("new generation");
		bots.sort((botA, botB) => {
			return botB.body.position.x < botA.body.position.x; //sort bots by distance travelled (fitness function)
		});

		console.log(bots[0].body.position.x);
		console.log(bots[bots.length-1].body.position.x);

		var botslength = bots.length
		
		var newGeneration = [];
		
		for(var i = 0; i < botslength/2; i++){ //choose bots to reproduce; the better the bot, the more likely it will reproduce
			//if(Math.random() > sigmoid(i)){
				var child_model = bots[i].makeChild(0.3); //every bot above 50th percentile makes 2 children
				var childBot = new Bot(botSize);
				childBot.model = child_model;
				
				newGeneration.push(childBot);
			
				var child_model = bots[i].makeChild(0.3);
				var childBot = new Bot(botSize);
				childBot.model = child_model;
				
				newGeneration.push(childBot);

			//}
		}

		var a = newGeneration.length;

		for(var i = 0; i <= numBots-a; i++){ //introduce new bots to environment (not using this atm)
			newGeneration.push(new Bot(botSize));
		}

		Composite.clear(world, true);
		
		bots = newGeneration;
		console.log(bots.length);

		for(var i = 0; i < bots.length; i++){
			Composite.add(world, [bots[i].body, bots[i].thigh, bots[i].shin, bots[i].bodyToThigh, bots[i].thighToShin]);
		}
	}
});
