/* coneFunctions.js
	
	Written by John Bell for CS 425, Fall 2020
    
    This file contains code to create and draw a unit cone, centered at the origin.
    
*/

// Globals are evil.  We won't use any here. :-)

function createCone( nSectors, gl, color ) {
	
	// Accept a color as a second argument.  If invalid, assign colors
	
	var points = [ ];	// Vertex location data
	var colors = [ ];	// Vertex color data
	
	// Generate Points and Colors
	
	// Colors first.  Use passed color if it is value
	
	var validColor = false;
	
	if ( Array.isArray( color ) && color.length == 3 
		&& color[0] >= 0 && color[1] >= 0 && color[2] >=0
		&& color[0] <= 1 && color[1] <= 1 && color[2] <=1 ) {
        
		validColor = true;
															 
    }

	// colors
	for( var i = 0; i < nSectors + 2; i++ ) {
		if( validColor )
			colors.push(vec3(0.1, 0.20, 0.3));
		else
			colors.push(1, 1, 1);
			// Push a random color here, as a vec3 
	}


	// TODO 1 - push vertex positions  into the points array
	// Then the vertex locations, starting with the apex
	
	// push ( 0, 1, 0 ) into the points array as a vec3
	points.push(vec3(0, 1, 0));
	// Then the base points
	dTheta = radians( 360 / nSectors );
	for( i = 0; i < nSectors + 1; i++ ) { // Duplicate ( 1, 0, 0 ) to close loop.
		var theta = i * dTheta;
		points.push(vec3(Math.cos(theta), 0, Math.sin(theta)));
		// push a vertex here, using Math.cos( theta ) for X and Math.sin( theta ) for Z
	}	
	
	nPoints = nSectors + 2;
	
	// No need for drawElements here.  drawArrays will suit just fine.
	
	// Okay.  All data calculated.  Time to put it all in GPU buffers
	
	// Push Vertex Location Data to GPU
	// Hold off on connecting the data to the shader variables
	
	vbufferID = gl.createBuffer( );
	gl.bindBuffer( gl.ARRAY_BUFFER, vbufferID );
	gl.bufferData( gl.ARRAY_BUFFER, flatten( points ), gl.STATIC_DRAW );
	
	// Push Vertex Color Data to GPU
	// Hold off on connecting the data to the shader variables
	
	// TODO2: Add calls to createBuffer, bindBuffer, and bufferData to push the color data to the GPU
	cbufferID = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cbufferID);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
	
	// Unbind the buffer, for safety sake.
	
	gl.bindBuffer( gl.ARRAY_BUFFER, null );
	
	return [ vbufferID, cbufferID ];

}

function renderCone( buffers, nSectors, gl, program ) {
	
	// Okay.  All transformaation matrices sent to uniform variables.
	// Time to attach vertex shader variables to the buffers created in init( )
	
	// Connect the vertex data to the shader variables - First positions
	gl.bindBuffer( gl.ARRAY_BUFFER, buffers[ 0 ] );
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );
	
	// Then the colors
	// TODO3 - Insert the code to connect the color data ( buffers[ 1 ] ) to the vertex shader variable "vColor"
	// using bindBuffer, getAttribLocation, vertexAttribPointer, and enableVertexAttribArray
	
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers[1]);
	var vColor = gl.getAttribLocation( program, "vColor" );

	gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vColor );
	
	// Unbind the array buffer, for safety sake.
	
	gl.bindBuffer( gl.ARRAY_BUFFER, null );

	
	// And finally to draw the cone
	
	// TODO3 - use drawArrays to draw a TRIANGLE FAN using all the data points ( nSectors + 2 points )
	
	gl.drawArrays(gl.TRIANGLE_FAN, 0, nSectors + 2  );	// Sides
	
	// TODO later - Draw the bottom.  Could possibly make this controlled by an extra passed parameter.
	
}