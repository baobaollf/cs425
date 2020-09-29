// Linfeng Li
// lli201
// 8/31/2020
// CS 425
// University of Illinois at Chicago


// Globals are evil, but necessary when callback functions are used

// Object-independent variables
var gl;				// WebGL graphics environment
var program;		// The shader program
var aspectRatio;	// Aspect ratio of viewport


// Cone-related variables - Only buffer IDs when using separate functions
var coneBuffers;		// Array of buffer IDs used by the randomly colored cone
var coneBuffers2;
var nConeSectors = 15;	// Number of sectors in first cone

// Initialization function runs whenever the page is loaded

window.onload = function init( ) {
	// Set up the canvas, viewport, and clear color

	var canvas = document.getElementById( "gl-canvas" );
	gl=WebGLUtils.setupWebGL( canvas );
	if( !gl ) {
		alert( "No WebGL" );
	}
	gl.viewport( 0, 0, canvas.width, canvas.height );
	aspectRatio = canvas.width / canvas.height ;
	gl.clearColor( 1.0, 1.0, 0.5, 1.0 );
	// Load the shaders, create a GLSL program, and use it.
	program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );
	// Generate Points and Colors
	// Unbind the buffer, for safety sake.
	
	gl.bindBuffer( gl.ARRAY_BUFFER, null );
	coneBuffers = createCone( nConeSectors, gl);
	coneBuffers2 = createCone( nConeSectors, gl);
	gl.enable( gl.DEPTH_TEST );	// Note:  This line had an error in the exercise template.
	
	// Initialization is done.  Now initiate first rendering
	render( );
}

function render( ) {
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	var modelView = lookAt(vec3(2.0, 1.5, 1.5), vec3(0, 0, 0), vec3(0, 1, 0));
	var vModelView = gl.getUniformLocation(program, "vModelView");
	gl.uniformMatrix4fv(vModelView, false, flatten(modelView));

	// Create another mat4 using perspective( ) and send it to the GPU

	var projection = perspective(60, aspectRatio, 0.1, 10.0);
	var vProjection = gl.getUniformLocation(program, "vProjection");
	gl.uniformMatrix4fv(vProjection, false, flatten(projection));
	
	gl.bindBuffer( gl.ARRAY_BUFFER, null );


	renderCone( coneBuffers,  nConeSectors, gl, program, 0, 0, 0 );

	renderCone( coneBuffers2,  nConeSectors, gl, program, 0, 1, 1 );
	console.log("got here");
}