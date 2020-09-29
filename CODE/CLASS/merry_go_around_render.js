// Linfeng Li
// lli201
// 8/31/2020
// CS 425
// University of Illinois at Chicago

var points = [];	// Vertex location data
var colors = [];	// Vertex color data
var up = 0.1;
var down = -0.1;
var counter = 0.5;

// Globals are evil.  We won't use any here. :-)

function createCone(nSectors, gl) {

    for (let i = 0; i < nSectors + 2; i++) {
        colors.push(vec3(Math.random(), Math.random(), Math.random()));
        // Push a random color here, as a vec3
    }

    points.push(vec3(0, 1, 0));
    // Then the base points
    dTheta = radians(360 / nSectors);
    for (i = 1; i <= nSectors + 1; i++) { // Duplicate ( 1, 0, 0 ) to close loop.
        var theta = i * dTheta;
        points.push(vec3(Math.cos(theta), 0, Math.sin(theta)));
        // push a vertex here, using Math.cos( theta ) for X and Math.sin( theta ) for Z
    }

    nPoints = nSectors + 2;

    console.log(points)

    vbufferID = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbufferID);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Push Vertex Color Data to GPU
    // Hold off on connecting the data to the shader variables

    // TODO2: Add calls to createBuffer, bindBuffer, and bufferData to push the color data to the GPU
    cbufferID = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cbufferID);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    // Unbind the buffer, for safety sake.

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return [vbufferID, cbufferID];

}

function renderCone(buffers, nSectors, gl, program, x, z, count) {

    // Okay.  All transformaation matrices sent to uniform variables.
    // Time to attach vertex shader variables to the buffers created in init( )

    // Connect the vertex data to the shader variables - First positions
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[0]);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[1]);
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    // Unbind the array buffer, for safety sake.

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var transformation = mat4();
    var vTransformation = gl.getUniformLocation( program, "vTransformation" );
    var loop = function () {
        gl.clearColor(1.0, 1.0, 0.5, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        var today = new Date();
        transformation = mult(translate(x, 0.5 * Math.sin(today.getTime() / 1000 / 6 * 2 * Math.PI), z), scalem(0.2, 0.5, 0.2));
        gl.uniformMatrix4fv(vTransformation, false, flatten(transformation));
        gl.enableVertexAttribArray(vTransformation);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, (nSectors + 2));	// Sides
        requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);

}