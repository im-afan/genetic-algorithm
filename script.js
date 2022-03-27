var keydown = false;//added user control (for now to verify things work)
var numBots = 5; //number of bots to spawn

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

//make a bots
var bots = []

for(var i = 0; i < numBots; i++){
	bots.push(new Bot());
}

var ground = Bodies.rectangle(400, 600, 800, 100, {isStatic:true});

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

var ticksPerAction = 50; //in how many ticks does the bot take one action

Events.on(runner, "afterTick", function(){
	tickNum++;
	
	//Body.rotate(bot.thigh, cur_action[0]/ticksPerAction);
	//Body.rotate(bot.shin, cur_action[1]/ticksPerAction);
	
	if(tickNum % ticksPerAction == 0){
		for(var i = 0; i < numBots; i++){
			bots[i].action(true);
		}
	}
});