//const {Engine,Composite,Render,World,Bodies,Body,Detector,Constraint,Runner} = Matter;

//document.addEventListener("keydown", function(a){
//	alert("key down !");
	//Body.rotate(bot.body, 0.1, Vector.create(bot.bodyX, bot.bodyY));
//});

var keydown = false;//added user control (for now to verify things work)

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
				showVelocity: true
		}
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

//make a bot!
var bot = new Bot();
//var bot2 = new Bot();
console.log(bot.model.getWeights());
var ground = Bodies.rectangle(400, 600, 800, 100, {isStatic:true});

//add things to the world
Composite.add(world, [ground]);
//console.log(bot.getParts());

Composite.add(world, [bot.body, bot.thigh, bot.shin, bot.bodyToThigh, bot.thighToShin]);
//Composite.add(world, [bot2.body, bot2.thigh, bot2.shin, bot2.bodyToThigh, bot2.thighToShin]);

// fit the render viewport to the scene
Render.lookAt(render, {
		min: { x: 0, y: 0 },
		max: { x: 800, y: 600 }
});

var tickNum = 0;
var cur_action = bot.action(false);

var ticksPerAction = 50; //in how many ticks does the bot take one action

Events.on(runner, "afterTick", function(){
	tickNum++;
	
	//Body.rotate(bot.thigh, cur_action[0]/ticksPerAction);
	//Body.rotate(bot.shin, cur_action[1]/ticksPerAction);
	
	if(tickNum % ticksPerAction == 0){
		cur_action = bot.action(true);
		//console.log(cur_action);
	}
});