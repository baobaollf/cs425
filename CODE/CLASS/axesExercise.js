// boilerplate.js
//	
//	Written by John Bell for CS 425, Fall 2020

// Globals are evil, but necessary when callback functions are used

var gl;				// WebGL graphics environment
var nPoints = 0;	// Number of points in the vertex arrays
var program;		// The shader program
var aspectRatio;	// Aspect ratio of viewport

// Initialization function runs whenever the page is loaded

window.onload = function init( ) {
	
	// Establish arrays to hold vertex data
	var points = [ ];	// Vertex location data
	var colors = [ ];	// Vertex color data
	
	// Set up the canvas, viewport, and clear color

	var canvas = document.getElementById( "gl-canvas" );
	gl=WebGLUtils.setupWebGL( canvas );
	if( !gl ) {
		alert( "No WebGL" );
	}
	
	gl.viewport( 0, 0, canvas.width, canvas.height );
	aspectRatio = canvas.width / canvas.height
	gl.clearColor( 1.0, 1.0, 0.5, 1.0 );
	
	// Load the shaders, create a GLSL program, and use it.
	program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	
	// Generate Points
	
	// TODO 1
	// INSERT CODE HERE to fill points[ ] and colors[ ] with vec3s, for 
	// 3D position and RGB colors respectively of vertices, and set nPoints.
	// First point is red at the origin
	points.push( vec3( 0, 0, 0 ) );
	points.push( vec3( 1, 0, 0 ) );
	points.push( vec3( 0, 0, 0 ) );
	points.push( vec3( 0, 1, 0 ) );
	points.push( vec3( 0, 0, 0 ) );
	points.push( vec3( 0, 0, 1 ) );
	colors.push( vec3( 1.0, 0, 0 ) );
	colors.push( vec3( 1.0, 0, 0 ) );
	colors.push( vec3( 0, 1.0, 0 ) );
	colors.push( vec3( 0, 1.0, 0 ) );
	colors.push( vec3( 0, 0, 1.0 ) );
	colors.push( vec3( 0, 0, 1.0 ) );
	nPoints = 6; // Change this as points are added
	
	// Push Vertex Location Data to GPU
	
	var vbufferID = gl.createBuffer( );
	gl.bindBuffer( gl.ARRAY_BUFFER, vbufferID );
	gl.bufferData( gl.ARRAY_BUFFER, flatten( points ), gl.STATIC_DRAW );
	
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );
	
	// Push Vertex Color Data to GPU
	
	var cbufferID = gl.createBuffer( );
	gl.bindBuffer( gl.ARRAY_BUFFER, cbufferID );
	gl.bufferData( gl.ARRAY_BUFFER, flatten( colors ), gl.STATIC_DRAW );
	
	var vColor = gl.getAttribLocation( program, "vColor" );
	gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vColor );
	
	// Unbind the buffer, for safety sake.
	
	gl.bindBuffer( gl.ARRAY_BUFFER, null );

	gl.enable( gl.DEPTH_BUFFER_BIT );
	
	// Initialization is done.  Now initiate first rendering
	render( );
}

function render( ) {
	
	// Clear out the color buffers and the depth buffers.
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	
	// Create mat4 transformation matrices as needed to transform vertices.
	// May include object transformation, camera movelView, and camera projection
	
	// TODO 2 - Create modelView using lookAt( eye, at, up );
	
	var eye = vec3(1.5, 1.5, 1.5);
	var at = vec3(0, 0, 0);
	var up = vec3(0, 1, 0);
	var modelView = lookAt(eye, at, up);
	
	// Push the transformation matrices to the GPU as uniform variables
	
	var vModelView = gl.getUniformLocation( program, "vModelView" );
	gl.uniformMatrix4fv( vModelView, false, flatten( modelView ) );
	
	// TODO3 - Create another mat4 using perspective( ) and send it to the GPU
	
	var projection = perspective(60, aspectRatio, 0.1, 10);
	var vProjection = gl.getUniformLocation( program, "vProjection");
	gl.uniformMatrix4fv( vProjection, false, flatten(projection) );
	
	// TODO4 - Create another mat4 as an Identity matrix and send it to the GPU
	var transformation = vec4();

	// Do the drawing
	gl.drawArrays( gl.LINES, 0, nPoints );	// Or gl.TRIANGLES, or . . .
	
	// TODO4 - Modify the transformation matrix, send it to the GPU again, and draw the arrays again
	
	// transformation = . . . ;
	transformation = translate(0.2, 0.4, 0);
	console.log(transformation);
	var vTransformation = gl.getUniformLocation( program, "vTransformation");
	gl.uniformMatrix4fv( vTransformation, false, flatten(transformation) );
	//gl.uniformMatrix4fv( . . . );
	
	gl.drawArrays( gl.LINES, 0, nPoints );	// Or gl.TRIANGLES, or . . .

	
	// Schedule a redraw if appropriate
	//if( ??? ) 
	//	requestAnimFrame( render );
	
}