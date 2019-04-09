/**
 * MyUnitCubeInverted
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyUnitCubeInverted extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}
	initBuffers() {	
		this.vertices = [

		    -0.5, -0.5, -0.5, 	//0
            -0.5, -0.5, -0.5,
            -0.5, -0.5, -0.5,

            0.5, -0.5, -0.5,  	//3
            0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,

            -0.5, 0.5, -0.5,  	//6
            -0.5, 0.5, -0.5,
            -0.5, 0.5, -0.5,

            0.5, 0.5, -0.5,  	//9
            0.5, 0.5, -0.5,
            0.5, 0.5, -0.5,		
            
            -0.5, -0.5, 0.5,	//12
            -0.5, -0.5, 0.5,	
            -0.5, -0.5, 0.5,	

            0.5, -0.5, 0.5,		//15
            0.5, -0.5, 0.5,		
            0.5, -0.5, 0.5,		

            -0.5, 0.5, 0.5,		//18
            -0.5, 0.5, 0.5,		
            -0.5, 0.5, 0.5,

            0.5, 0.5, 0.5,		//21
            0.5, 0.5, 0.5,
            0.5, 0.5, 0.5
		];

		this.normals = [

			0, 0, -1,
			0, -1, 0,
			-1, 0, 0,

			0, 0, -1,
			0, -1, 0,
			1, 0, 0,

			0, 0, -1,
			0, 1, 0,
			-1, 0, 0, 

			0, 0, -1,
			0, 1, 0,
			1, 0, 0, 

			0, 0, 1,
			0, -1, 0,
			-1, 0, 0,

			0, 0, 1,
			0, -1, 0,
			1, 0, 0,

			0, 0, 1,
			0, 1, 0,
			-1, 0, 0, 

			0, 0, 1,
			0, 1, 0,
			1, 0, 0,
		];

		//Counter-clockwise reference of vertices	(inverted)
		this.indices = [

		    3, 6, 0, 
            3, 9, 6,

            18, 15, 12, 
            18, 21, 15, 
            
            16, 4, 1,
            12, 16, 1,

            10, 22, 7,
            22, 19, 7,

            5, 17, 11,
            23, 11, 17,

            20, 14, 2,
            20, 2, 8,
		];

		//Texture coordinates
		this.texCoords = [
			
			0, 2/3,
			1/4, 1,
			1, 2/3,

			3/4, 2/3,
			2/4, 1,
			3/4, 2/3,

			0, 1/3,
			1/4, 0,
			1, 1/3,

			3/4, 1/3,
			2/4, 0,
			3/4, 1/3,

			1/4, 2/3,
			1/4, 2/3,
			1/4, 2/3,

			2/4, 2/3,
			2/4, 2/3,
			2/4, 2/3,

			1/4, 1/3,
			1/4, 1/3,
			1/4, 1/3,

			2/4, 1/3,
			2/4, 1/3,
			2/4, 1/3,
		];
		
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();

	}

	updateBuffers() {};
}