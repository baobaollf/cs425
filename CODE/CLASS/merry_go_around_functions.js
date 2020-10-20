// Linfeng Li
// lli201
// 8/31/2020
// CS 425
// University of Illinois at Chicago

var points = [];	// Vertex location data
var colors = [];	// Vertex color data
var nSectors = 15;	// Number of sectors in first cone
var coneBuffers;		// Array of buffer IDs used by the randomly colored cone
var coneBuffers2;
var cone_one_location = [];
var cone_two_location = [];

function createCone(gl) {
    colors = [];
    points = [];
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
    return [vbufferID, cbufferID];
}

function renderCone(buffers, gl, program, x, z) {

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
    var vTransformation = gl.getUniformLocation(program, "vTransformation");

    var today = new Date();
    transformation = mult(translate(x, 0.5 * Math.sin(today.getTime() / 1000 / 6 * 2 * Math.PI), z), scalem(0.2, 0.5, 0.2));
    gl.uniformMatrix4fv(vTransformation, false, flatten(transformation));
    gl.enableVertexAttribArray(vTransformation);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, (nSectors + 2));	// Sides

}

function createMGA(gl) {
    coneBuffers = createCone(gl);
    coneBuffers2 = createCone(gl);
    return createCone(gl);
}

function renderMGA(buffers, gl, program, x, y, z) {
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
    var vTransformation = gl.getUniformLocation(program, "vTransformation");

    // MGA top
    var today = new Date();
    transformation = mult(rotateY(today.getTime() / 5), translate(x, y, z), );
    gl.uniformMatrix4fv(vTransformation, false, flatten(transformation));
    gl.enableVertexAttribArray(vTransformation);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, (nSectors + 2));

    // MGA bottom
    transformation = mult(rotateY(today.getTime() / 5), translate(x, y - 1.6, z));
    gl.uniformMatrix4fv(vTransformation, false, flatten(transformation));
    gl.enableVertexAttribArray(vTransformation);
    gl.drawArrays(gl.TRIANGLE_FAN, 1, (nSectors + 1));

    // horses
    renderCone(coneBuffers, gl, program, 0, 0);
    renderCone(coneBuffers2, gl, program, 0, 1);

}