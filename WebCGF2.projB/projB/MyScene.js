/**
* MyScene
* @constructor
*/
class MyScene extends CGFscene {
    constructor() {
        super();
    }

    init(application) {
        super.init(application);
        this.initCameras();
        this.initLights();

        //Background color
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.enableTextures(true);

        //Initializes some scene objects
        this.axis = new CGFaxis(this);
        //this.plane = new Plane(this, 32);
        this.terrain = new MyTerrain(this);
        this.bird = new MyBird(this);
        
        this.nest = new MyNest(this);
		this.nestPosition = [-5, 4.5, 8];

        this.house = new MyHouse(this);
        this.cube_map = new MyCubeMap(this);
        this.sphere = new MySphere(this, 1, 15, 15);
        this.tree = new MyLSPlant(this);

        //Initializes the tree branches
        this.treeBranch = new MyTreeBranch(this);
		const numBranches = 4;
        this.treeBranches = [];
        for(var i = 0; i < numBranches; i++){
        	this.treeBranches.push(this.treeBranch);
        }
        this.branchesTranslates = [];
		this.branchesTranslates.push([-5, 0, 3]);
		this.branchesTranslates.push([-1, 0, 3]);
		this.branchesTranslates.push([-5, 0, -4]);
		this.branchesTranslates.push([1, 0, -3]);
		this.branchesRotates = [false, true, false, true];

        //Initializes the lightning 
        this.lightning = new MyLightning(this);

		//Initializes the materials
		this.initMaterials();

        //Objects connected to MyInterface
        this.scaleFactor = 10.0;
        this.catchingError = 1.0;
        this.retro = false;

		this.shadersDiv = document.getElementById("shaders");
		this.vShaderDiv = document.getElementById("vshader");
		this.fShaderDiv = document.getElementById("fshader");

		this.retroCamera = new CGFcamera(0.7, 0.1, 500, vec3.fromValues(this.bird.x, this.bird.y + 40, this.bird.z), vec3.fromValues(this.bird.x + Math.sin(this.bird.yy_angle), this.bird.y, this.bird.z + Math.cos(this.bird.yy_angle)));
		
        this.setUpdatePeriod(50);
    }

    initLights() {
        this.lights[0].setPosition(15, 2, 5, 1);
        this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.lights[0].enable();
        this.lights[0].update();
    }

   	/*onScaleFactorChanged(v) {
    	//this.terrain.onScaleFactorChanged(v);
	}*/

    initMaterials(){
    	//CubeMap Material
        this.cubeMap_material = new CGFappearance(this);
        this.cubeMap_material.setAmbient(0.9, 0.9, 0.9, 1);
        this.cubeMap_material.setDiffuse(0.9, 0.9, 0.9, 1);
        this.cubeMap_material.setSpecular(0.1, 0.1, 0.1, 1);
        this.cubeMap_material.setShininess(10.0);
        this.cubeMap_material.loadTexture('images/cube_map_day.jpg');   //daytime is default
        this.cubeMap_material.setTextureWrap('REPEAT', 'REPEAT');
    }

    initCameras() {
        this.defaultCamera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(-75, 50, 60), vec3.fromValues(0, 0, 0));

        this.camera = this.defaultCamera;
    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }

    checkKeys(t) {
		var text="Keys pressed: ";
		var keysPressed=false;
		
		//Accelerates the bird
		if (this.gui.isKeyPressed("KeyW")) {
			this.bird.accelerate(0.001);
			text+=" W ";
			keysPressed=true;
		}
		
		//Decelerates the bird
		if (this.gui.isKeyPressed("KeyS")) {
			this.bird.accelerate(-0.001);			
			text+=" S ";
			keysPressed=true;
		}

		//Turns the bird to the right
		if (this.gui.isKeyPressed("KeyD")) {
			this.bird.turn(-Math.PI/20);
			text+=" D ";
			keysPressed =true;
		}

		//Turns the bird to the left
		if (this.gui.isKeyPressed("KeyA")) {
			this.bird.turn(Math.PI/20);
			text+=" A ";
			keysPressed =true;
		}

		//Resets the position and movement of the bird
		if (this.gui.isKeyPressed("KeyR")) {
			this.bird.reset();
			text+=" R ";
			keysPressed =true;
		}

		//Dives down
		if (this.gui.isKeyPressed("KeyP")) {
			this.bird.descending = true;
			text+=" P ";
			keysPressed =true;
		}

		//Displays a lightning strike
		if(this.gui.isKeyPressed("KeyL")){
			this.lightning.startAnimation(t);			
        	
			text+=" L ";
			keysPressed = true;
		}
		
		if (keysPressed)
		console.log(text);
	}

    update(t){
    	this.checkKeys(t);

		this.lastTime = this.lastTime || 0;
		this.deltaTime = t - this.lastTime;
		this.lastTime = t;
		this.bird.update(t, this.deltaTime);
		
		this.lightning.update(t);

		this.bird.checkCollisionsWithBranches(this.treeBranches, this.branchesTranslates, this.branchesRotates, this.catchingError);
		this.bird.checkCollisionsWithNest(this.nest, this.nestPosition, this.catchingError);
    }
    	


    display() {
        // ---- BEGIN Background, camera and axis setup
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();
        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        if(this.retro) {
        	this.camera = this.retroCamera;

        	this.retroCamera.setPosition(vec3.fromValues(this.bird.x, 40, this.bird.z));
        	this.retroCamera.setTarget(vec3.fromValues(this.bird.x + Math.sin(this.bird.yy_angle), this.bird.y, this.bird.z + Math.cos(this.bird.yy_angle)));

        	//this.retroCamera.setTarget(vec3.fromValues(this.bird.x, this.bird.y, this.bird.z));
        	//this.retroCamera.rotate(vec3.fromValues(0, 1, 0), this.bird.yy_angle);
        }
    	else
    		this.camera = this.defaultCamera;

        // Draw axis
        this.axis.display();

        //Apply default appearance
        this.setDefaultAppearance();

        //Some display variables
        var FPS = 40;
        this.setUpdatePeriod(1000/FPS);
        

        // ---- BEGIN Primitive drawing section

		//Drawing the cube map
		this.pushMatrix();
			this.scale(60, 60, 60);
			this.cubeMap_material.apply();
			this.cube_map.display();
		this.popMatrix();


		//Drawing the terrain
        this.pushMatrix();
        	this.rotate(-0.5*Math.PI, 1, 0, 0);
        	//this.plane.display();
        	this.terrain.display();
        this.popMatrix();
		

		//Drawing the bird
        this.pushMatrix();
        	this.translate(0, 5.5, 0);
        	this.bird.display();
        this.popMatrix();

		
        //Drawing the branches
        this.pushMatrix();
        	this.translate(0, 4.5, 0);
        	this.pushMatrix();
        		for(var i = 0; i < this.treeBranches.length; i++){
        			if(this.treeBranches[i] == undefined)
        				continue;
        			this.pushMatrix();
						this.translate(this.branchesTranslates[i][0], this.branchesTranslates[i][1], this.branchesTranslates[i][2]);
						this.pushMatrix();
							this.rotate(Math.PI/2, 0, 0, 1);
							if(this.branchesRotates[i]){
								this.rotate(Math.PI/2, 1, 0, 0);
							}
							this.treeBranches[i].display();
						this.popMatrix();
        			this.popMatrix();
        		}
        	this.popMatrix();
        this.popMatrix();

		
		//Drawing the nest
		this.pushMatrix();
			this.translate(this.nestPosition[0], this.nestPosition[1], this.nestPosition[2]);
			this.nest.display();
		this.popMatrix();


		//Drawing the house
		this.pushMatrix();
			this.translate(6, 4.5, 4);
			this.pushMatrix();
				this.scale(1.5, 1.5, 1.5);
				this.pushMatrix();
					this.rotate(-Math.PI/2, 0, 1, 0);
					this.house.display();
				this.popMatrix();
			this.popMatrix();
		this.popMatrix();


		//Drawing the lightning
		if(this.lightning.isDrawing){
			this.pushMatrix();
				this.translate(this.lightning.lightning_position[0], 30, this.lightning.lightning_position[1]);
				this.pushMatrix();
					this.scale(2, 2, 2);
					this.pushMatrix();
						this.rotate(Math.PI, 1, 0, 0);
						this.lightning.display();
					this.popMatrix();
				this.popMatrix();
			this.popMatrix();
		}


		//Drawing the trees
		this.pushMatrix();
			this.translate(0, 4, 0);
			this.scale(3, 3, 3);
			this.tree.display();
		this.popMatrix();
		
        // ---- END Primitive drawing section
    }
}