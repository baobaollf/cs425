// textureExerciseWorking.js
//	
//	Written by John Bell for CS 425, Fall 2020

// Globals are evil, but necessary when callback functions are used

var gl;				// WebGL graphics environment
var nPoints = 0;	// Number of points in the vertex arrays
var program;		// The shader program
var aspectRatio;	// Aspect ratio of viewport

// Initialization function runs whenever the page is loaded

window.onload = function init() {

    // Establish arrays to hold vertex data
    var points = [];	// Vertex location data
    var colors = [];	// Vertex color data
    var texCoords = [];	// Vertex texture coordinate data

    // Set up the canvas, viewport, and clear color

    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("No WebGL");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    aspectRatio = canvas.width / canvas.height;
    gl.clearColor(1.0, 1.0, 0.5, 1.0);	// Pale yellow

    // Load the shaders, create a GLSL program, and use it.
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);


    // Generate Points

    // INSERT CODE HERE to fill points[ ] and colors[ ] with vec3s, for
    // 3D position and RGB colors respectively of vertices, and set nPoints.
    // Four vertices make a quad with triangle strip

    points.push(vec3(1, 0, 0));	// Lower right
    colors.push(vec3(1.0, 0, 0));
    texCoords.push(vec2(1.0, 0.0));

    points.push(vec3(0, 0, 0));		// Lower left
    colors.push(vec3(0.0, 1, 0));
    texCoords.push(vec2(0.0, 0.0));

    points.push(vec3(1, 1, 0));		// Upper right
    colors.push(vec3(0.0, 0, 1));
    texCoords.push(vec2(1.0, 1.0));

    points.push(vec3(0, 1, 0));		// Upper left
    colors.push(vec3(1.0, 1, 1));
    texCoords.push(vec2(0, 1.0));


    nPoints = 4;

    // Push Vertex Location Data to GPU, and attach the buffer to the vPosition attribute

    var vbufferID = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbufferID);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Push Vertex Color Data to GPU, and attach the buffer to the vColor attribute

    var cbufferID = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cbufferID);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    // Push Vertex texture coordinate data to GPU, and attach the buffer to the vTexCoords attribute

    var tbufferID = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tbufferID);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

    var vTex = gl.getAttribLocation(program, "vTexCoords");
    gl.vertexAttribPointer(vTex, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTex);

    // Three Texture Map Blocks Follow.  Only one should be uncommented.

    //-------------------------------------------------------------------------------------- Block 1
    // TODO 1 - After running the program once, adjust texCoords above to wrap multiple copies of the
    //         texture onto the polygon.  Try different repetitions, including some fractional ones.
    // TODO 2 - change the texData array from 2 x 2 = 4 pixels to 4 x 4 = 16 pixels

    // This block just loads in constant color data
    // Create a texture image data array.  2 x 2 for now.
    // var texData = new Uint8Array([255, 0, 0, 255,
    //     0, 255, 0, 255,
    //     0, 0, 255, 255,
    //     127, 127, 127, 255]); // red, green, blue, gray
    //
    // var texture = gl.createTexture();
    // gl.activeTexture(gl.TEXTURE0);
    // gl.bindTexture(gl.TEXTURE_2D, texture);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, texData);
    // gl.uniform1i(gl.getUniformLocation(program, "texMap"), 0);
    //
    // gl.generateMipmap(gl.TEXTURE_2D);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    //-------------------------------------------------------------------------------------- Block 2

        // This block calls a function to build a 32 x 32 texture map.
        // DON'T TRY TO FIGURE OUT THE FUNCTION.  Run it and see what you get.
        // TODO 3 - Activate this block instead of block 1.  Report what you get.
        // TODO 4 - Modify the polygon dimensions to be a rectangle twice as wide as it is tall.
        //         Then adjust the texCoords to only use the bottom half of the texture map.

        // var texData = fillArray( ); // 32 x 32
        //
        // var texture = gl.createTexture( );
        // gl.activeTexture( gl.TEXTURE0 );
        // gl.bindTexture( gl.TEXTURE_2D, texture );
        // gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, 32, 32, 0, gl.RGBA, gl.UNSIGNED_BYTE, texData);
        // gl.uniform1i( gl.getUniformLocation( program, "texMap" ), 0 );
        //
        // gl.generateMipmap( gl.TEXTURE_2D );
        // gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
        // gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );


    //-------------------------------------------------------------------------------------- Block 3

        // Load an image texture from a file
        // This block only works for me under IE, not under Firefox or Chrome.  :-(
        // TODO 5 - Make this the active block, and try it in different web browsers.
        //         If it works anywhere, continue to TODO6.  Otherwise try to get it working.
        // TODO 6 - Change the source image in the HTML file to use bricks.jpg.  What happens?
        // TODO 7 - Change the source to bricksSquare.jpg.  Adjust vertex positions and texCoords
        //         to make a nice looking "wall" of some length.  ( Might need to adjust lookAt. )

        var image = new Image(  );
        //image.crossOrigin = "";
        //image.src = "bricksSquare.jpg";  // Loading file directly.
        var image = document.getElementById( "bricks" );	// File loaded in html code, accessed here.
        gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
        var texture = gl.createTexture( );
        gl.activeTexture( gl.TEXTURE0 );
        gl.bindTexture( gl.TEXTURE_2D, texture );
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );
        gl.uniform1i( gl.getUniformLocation( program, "texMap" ), 0 );
        gl.generateMipmap( gl.TEXTURE_2D );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );


    // Unbind the buffer, for safety sake.

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.enable(gl.DEPTH_TEST);

    // Initialization is done.  Now initiate first rendering
    render();
}

function render() {

    // Clear out the color buffers and the depth buffers.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create mat4 transformation matrices as needed to transform vertices.
    // May include object transformation, camera movelView, and camera projection

    // Create modelView using lookAt( eye, at, up );

    //var modelView = mat4( ); // Identity matrix unless changed otherwise.
    var modelView = lookAt(vec3(0.8, 0.5, 1.5), vec3(1, 0.5, 0), vec3(0, 1, 0));

    // Push the transformation matrices to the GPU as uniform variables

    var vModelView = gl.getUniformLocation(program, "vModelView");
    gl.uniformMatrix4fv(vModelView, false, flatten(modelView));

    // Create another mat4 using perspective( ) and send it to the GPU

    var projection = perspective(60, aspectRatio, 0.1, 10.0);
    var vProjection = gl.getUniformLocation(program, "vProjection");
    gl.uniformMatrix4fv(vProjection, false, flatten(projection));

    // Create another mat4 as an Identity matrix and send it to the GPU

    var transformation = mat4();
    var vTransformation = gl.getUniformLocation(program, "vTransformation");
    gl.uniformMatrix4fv(vTransformation, false, flatten(transformation));

    // Do the drawing
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, nPoints);	// Or gl.TRIANGLES, or . . .

    // Modify the transformation matrix, send it to the GPU again, and draw the arrays again

    transformation = mult(translate(.2, .5, 0), scalem(0.5, 0.5, 0.5));
    transformation = mult(rotate(45, vec3(1, 1, 1)), transformation);
    gl.uniformMatrix4fv(vTransformation, false, flatten(transformation));
    //gl.drawArrays( gl.QUADS, 0, nPoints );	// Or gl.TRIANGLES, or . . .


    // Schedule a redraw if appropriate
    //if( ??? )
    //	requestAnimFrame( render );

}

function fillArray() {

    // This function returns a 32 x 32 RGBA texture image.

    var result = new Uint8Array(32 * 32 * 4);

    // The remainder of this function is intentionally obscure.
    // Please do not try to figure out what it does ( until you have seen the result. )

    for (r = 0; r < 32; r++)
        for (c = 0; c < 32; c++) {
            result[r * 128 + c * 4] = 255;
            result[r * 128 + c * 4 + 1] = 0;
            result[r * 128 + c * 4 + 2] = 0;
            result[r * 128 + c * 4 + 3] = 255;
        }

    for (r = 2; r < 13; r++)
        for (c = 0; c < 9; c++) {
            result[r * 128 + c * 4 + 13] = 255;
            result[r * 128 + c * 4 + 14] = 255;
            result[r * 128 + c * 4 + 81] = 255;
            result[r * 128 + c * 4 + 82] = 255;
            if (c > 3) continue;
            result[r * 128 + c * 4 + 57] = 255;
            result[r * 128 + c * 4 + 58] = 255;
        }

    for (r = 0; r < 9; r++)
        for (c = 0; c < 2; c++) {
            result[r * 128 + c * 4 + 400] = 0;
            result[r * 128 + c * 4 + 401] = 0;
            result[r * 128 + c * 4 + 402] = 255;
            result[r * 128 + c * 4 + 420] = 0;
            result[r * 128 + c * 4 + 421] = 0;
            result[r * 128 + c * 4 + 422] = 255;
            result[r * 128 + c * 4 + 444] = 0;
            result[r * 128 + c * 4 + 445] = 0;
            result[r * 128 + c * 4 + 446] = 255;
            result[r * 128 + c * 4 + 468] = 0;
            result[r * 128 + c * 4 + 469] = 0;
            result[r * 128 + c * 4 + 470] = 255;
            if (r < 3 || r > 5) {
                result[r * 128 + c * 4 + 488] = 0;
                result[r * 128 + c * 4 + 489] = 0;
                result[r * 128 + c * 4 + 490] = 255;
            }
            if (r > 6) continue;
            result[c * 128 + r * 4 + 400] = 0;
            result[c * 128 + r * 4 + 401] = 0;
            result[c * 128 + r * 4 + 402] = 255;
            result[c * 128 + r * 4 + 468] = 0;
            result[c * 128 + r * 4 + 469] = 0;
            result[c * 128 + r * 4 + 470] = 255;
            result[c * 128 + r * 4 + 1364] = 0;
            result[c * 128 + r * 4 + 1365] = 0;
            result[c * 128 + r * 4 + 1366] = 255;
        }
    for (r = 0; r < 16; r++)
        for (c = 0; c < 32; c++) {
            result[r * 128 + c * 4 + 2048] = 255 - result[r * 128 + c * 4];
            result[r * 128 + c * 4 + 2049] = 255 - result[r * 128 + c * 4 + 1];
            result[r * 128 + c * 4 + 2050] = 255 - result[r * 128 + c * 4 + 2];
        }
    return result;
}