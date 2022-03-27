const {Engine,Composite,Render,World,Bodies,Body,Detector,Constraint,Runner, Vector, Events} = Matter;

//const canvas = document.getElementById("canvas");
//const ctx = canvas.getContext("2d");

class Bot{
	constructor(){
		var params = {
			collisionFilter: { //allow bot to collide with itself (the engine breaks if we allow self-collisions lol)
				category: 2,
				group: -1,
				mask: 1
			},
			friction: 1,
			frictionAir: 0,
			restitution: 0.5, //bounciness
		}

		//just for creation, just use this.body.position to get live positioning
		
		this.x = 400;
		this.y = 100;

		//locations for each bone (also just for creation)
		this.bodyX = this.x;
		this.bodyY = this.y

		this.thighX = this.x;
		this.thighY = this.y+100;

		this.shinX = this.x;
		this.shinY = this.y+200;

		//bones
		this.body = Bodies.rectangle(this.bodyX, this.bodyY, 100, 100, params);
		this.thigh = Bodies.rectangle(this.thighX, this.thighY+100, 50, 100, params); 
		this.shin = Bodies.rectangle(this.thighX, this.thighY+200, 50, 100, params);

		//joints
		this.bodyToThigh = Constraint.create({
			bodyA: this.body,
			bodyB: this.thigh, 
			pointA: Matter.Vector.create(0, 50),
			pointB: Matter.Vector.create(0, -50),
			stiffness:1,
			length:0,
			damping:0.1
		});

		this.thighToShin = Constraint.create({
			bodyA: this.thigh,
			bodyB: this.shin, 
			pointA: Vector.create(0,50),
			pointB: Vector.create(0,-50),
			stiffness:1,
			length:0,
			damping:0.1
		});

		//ML
		this.model = tf.sequential();
		
		this.model.add(tf.layers.dense({ //no hidden layers
			units: 2, //rotation of thigh, rotation of shin
			activation: 'tanh',
			inputDim: 6 //current x, current y, x velocity, y velocity, thigh angle, shin angle
		}));
	}

	//TODO; this doesn't work yet idk why
	getParts(){
		console.log("getting parts");
		return [
			this.body,
			this.thigh,
			this.shin,
			this.bodyToThigh,
			this.thighToShin
		];
	}

	//not using this, just use default matterjs render engine
	draw(color){
		appearRect(this.body.vertices, color);
		appearRect(this.thigh.vertices, color);
		appearRect(this.shin.vertices, color);
	}

	action(doActions){
		//we need to truncate the input to somewhere between -1 and 1, which is why we take cosine of the angles and normalise the velocity, etc.
		
		var velocity = Vector.create(this.body.velocity.x, this.body.velocity.y); //make a copy of velocity vector
		Vector.normalise(velocity); //this makes it so that the vector only shows the direction

//console.log([this.body.position.x/800, this.body.position.y/600, velocity.x, velocity.y, Math.cos(this.thigh.angle), Math.cos(this.shin.angle)])
		
		var input = tf.tensor([[this.body.position.x/800, this.body.position.y/600, velocity.x, velocity.y, Math.cos(this.thigh.angle), Math.cos(this.shin.angle)]]);
		
		var action = this.model.predict(input); //get model prediction of the best action

		var action_array = action.arraySync()[0]; // turn action (a tf.tensor) into an array

		//do actions
		if(doActions){ //doActions tells us whether to do the predicted actions immediately or just return them
			Body.rotate(this.thigh, action_array[0]);
			Body.rotate(this.shin, action_array[1]);
		}
		//console.log(action_array);
		return action_array[0];
	}

	makeChildren(mutationAmount){
		var mutation = tf.randomUniform(this.model.getWeights.shape, -mutationAmount, mutationAmount); //mutations in the shape of model weights, with random minimum -mutationAmount and maximum mutationAmount

		var newWeights = this.model.getWeights.add(mutation); // weights of child

		var newModel = tf.sequential();
		
		newModel.add(tf.layers.dense({ //no hidden layers
			units: 2, //rotation of thigh, rotation of shin
			activation: 'tanh',
			inputDim: 6 //current x, current y, x velocity, y velocity, thigh angle, shin angle
		}));

		newModel.setWeights(newWeights);

		return newModel;
	}
}

//not using this
function appearRect(verts,col){
	ctx.fillStyle = col;
	ctx.beginPath();
	ctx.moveTo(verts[0].x, verts[0].y)// go to the first vertex
	for (var i = 1; i < verts.length; i++) {
		ctx.lineTo(verts[i].x, verts[i].y); // draw each of the next verticies
	}
	ctx.lineTo(verts[0].x, verts[0].y); //go back to the first one
	ctx.fill(); // fill it
	ctx.stroke(); // add a border
}