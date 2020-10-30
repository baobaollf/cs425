/* coneFunctionsExercise.js
//	
//	Written by John Bell for CS 425, Fall 2020
    
    This file is an extension of multiObject.js, employing functions in cone.js
    
*/

// Globals are evil, but necessary when callback functions are used

// Object-independent variables
var gl;				// WebGL graphics environment
var program;		// The shader program
var aspectRatio;	// Aspect ratio of viewport

// Axes-related  variables
var nAxesPoints = 0;	// Number of points in the vertex arrays for the axes
var vbufferID_axes;		// ID of buffer holding axes positions
var cbufferID_axes;		// ID of buffer holding axes colors

// Cone-related variables - Only buffer IDs when using separate functions
var coneBuffers;		// Array of buffer IDs used by the randomly colored cone
var solidConeBuffers;	// Array of buffer IDs used by the solid color cone
var nConeSectors = 15;	// Number of sectors in first cone
var nConeSectors2 = 11;	// Number of sectors in second cone

// Initialization function runs whenever the page is loaded

window.onload = function init( ) {
	
	// Establish arrays to hold vertex data
	var axesPoints = [ ];	// Vertex location data for axes
	var axesColors = [ ];	// Vertex color data for axes
	
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
	
	// First the points and colors for the axes.
	axesPoints.push( vec3( 0, 0, 0 ) );
	axesColors.push( vec3( 1, 0, 0 ) );
	axesPoints.push( vec3( 1, 0, 0 ) );
	axesColors.push( vec3( 1, 0, 0 ) );
	
	axesPoints.push( vec3( 0, 0, 0 ) );
	axesColors.push( vec3( 0, 1, 0 ) );
	axesPoints.push( vec3( 0, 1, 0 ) );
	axesColors.push( vec3( 0, 1, 0 ) );
	
	axesPoints.push( vec3( 0, 0, 0 ) );
	axesColors.push( vec3( 0, 0, 1 ) );
	axesPoints.push( vec3( 0, 0, 1 ) );
	axesColors.push( vec3( 0, 0, 1 ) );
	nAxesPoints = 6;
	
	// Okay.  All axes data calculated.  Time to put it in GPU buffers
	
	// Push Axis Vertex Location Data to GPU
	// Hold off on connecting the data to the shader variables
	
	vbufferID_axes = gl.createBuffer( );	// Note:  All bufferIDs are globals
	gl.bindBuffer( gl.ARRAY_BUFFER, vbufferID_axes );
	gl.bufferData( gl.ARRAY_BUFFER, flatten( axesPoints ), gl.STATIC_DRAW );
	
	// Push Axis Vertex Color Data to GPU
	// Hold off on connecting the data to the shader variables
	
	cbufferID_axes = gl.createBuffer( );
	gl.bindBuffer( gl.ARRAY_BUFFER, cbufferID_axes );
	gl.bufferData( gl.ARRAY_BUFFER, flatten( axesColors ), gl.STATIC_DRAW );
	
	// Unbind the buffer, for safety sake.
	
	gl.bindBuffer( gl.ARRAY_BUFFER, null );

	// Next the cone.  Save buffer IDs for later use.
	// TODO4 - Pass parameters to create code, using "0" ( an invalid color ) for the color parameter
	coneBuffers = createCone( nConeSectors, gl, 0 );
	
	// TODO6 - Create a solid color cone passing [ r, g, b ] for the color parameter, 
	// where r, g, and b are valid color parameters.
	solidConeBuffers = createCone( nConeSectors2, gl, 0 );
	
	gl.enable( gl.DEPTH_TEST );	// Note:  This line had an error in the exercise template.
	
	// Initialization is done.  Now initiate first rendering
	render( );
}

function render( ) {
	
	// Clear out the color buffers and the depth buffers.
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

	// Create mat4 transformation matrices as needed to transform vertices.
	// May include object transformation, camera movelView, and camera projection
	
	// Create modelView using lookAt( eye, at, up );
	// Push it to the GPU as a uniform variable.
	//var modelView = mat4( ); // Identity matrix unless changed otherwise.
	let modelView = lookAt( vec3( 2.0, 1.5, 1.5 ), vec3( 0, 0, 0 ), vec3( 0, 1, 0 ) );
	let vModelView = gl.getUniformLocation( program, "vModelView" );
	gl.uniformMatrix4fv( vModelView, false, flatten( modelView ) );
	
	// Create another mat4 using perspective( ) and send it to the GPU
	
	let projection = perspective( 60, aspectRatio, 0.1, 10.0 );
	let vProjection = gl.getUniformLocation( program, "vProjection" );
	gl.uniformMatrix4fv( vProjection, false, flatten( projection ) );
	
	// Set the transformation matrix as a mat4 Identity matrix and send it to the GPU
	
	var transformation = mat4( );
	var vTransformation = gl.getUniformLocation( program, "vTransformation" );
	gl.uniformMatrix4fv( vTransformation, false, flatten( transformation ) );
	
	// Okay.  All transformaation matrices sent to uniform variables.
	// Time to attach vertex shader variables to the buffers created in init( )
	
	// Connect the axes vertex data to the shader variables - First positions
	gl.bindBuffer( gl.ARRAY_BUFFER, vbufferID_axes );
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );
	
	// Then the axes colors
	gl.bindBuffer( gl.ARRAY_BUFFER, cbufferID_axes );
	var vColor = gl.getAttribLocation( program, "vColor" );
	gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vColor );
	
	// Unbind the buffer, for safety sake.
	
	gl.bindBuffer( gl.ARRAY_BUFFER, null );

	// Draw the axes
	gl.drawArrays( gl.LINES, 0, nAxesPoints );	// Or gl.TRIANGLES, or . . .
	
	// Now to draw the cone, using a different set of buffers and Indices
	
	// Reset the transformation to scale down the cone so the axes are visible.
	// ( Note that the cone is centered on the origin, standing on the Y = 0 plane. )
	// TODO5 - Insert correct parameters in the following three functions.
	// The sample image scales Y by 0.75 and X and Z by 0.5 each
	transformation = scalem(0.5, 0.75, 0.5); //mat4( );
	gl.uniformMatrix4fv( vTransformation, false, flatten( transformation ) );
	
	// And finally to draw the cone
	
	renderCone( coneBuffers,  nConeSectors, gl, program );
	
	// And the second Cone a few times in different places and sizes
	
	// TODO 7 - complete the following 3 calls to make another solid cone.
	// Then duplicate them a time or two with different parameters to make more
	
	transformation = mult( translate( 0.9, 0, 0 ), scalem(0.2, 0.5, 0.2 ) );
	gl.uniformMatrix4fv( vTransformation, false, flatten( transformation ) );
	renderCone( solidConeBuffers, nConeSectors2, gl, program );
	

	// Schedule a redraw if appropriate
	//if( ??? ) 
	//	requestAnimFrame( render );
	
}