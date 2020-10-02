// Linfeng Li
// lli201
// 8/31/2020
// CS 425
// University of Illinois at Chicago


// Globals are evil, but necessary when callback functions are used

// Object-independent variables
let gl;				// WebGL graphics environment
let program;		// The shader program
let aspectRatio;	// Aspect ratio of viewport
let view;

// Initialization function runs whenever the page is loaded

window.onload = function init() {
    // Set up the canvas, viewport, and clear color

    let canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("No WebGL");
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    aspectRatio = canvas.width / canvas.height;
    gl.clearColor(1.0, 1.0, 0.8, 1.0);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var projection = perspective(60, aspectRatio, 0.1, 10.0);
    var vProjection = gl.getUniformLocation(program, "vProjection");
    gl.uniformMatrix4fv(vProjection, false, flatten(projection));

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    view = new MGA(gl, program, 0, 0.2, 0);
    gl.enable(gl.DEPTH_TEST);	// Note:  This line had an error in the exercise template.

    // Initialization is done.  Now initiate first rendering
    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var modelView = lookAt(vec3(4.0, 1, 1.5), vec3(0, 0, 0), vec3(0, 1, 0));
    var vModelView = gl.getUniformLocation(program, "vModelView");
    gl.uniformMatrix4fv(vModelView, false, flatten(modelView));

    var transformation = mat4();
    var vTransformation = gl.getUniformLocation(program, "vTransformation");
    gl.uniformMatrix4fv(vTransformation, false, flatten(transformation));


    view.render();
    requestAnimFrame(render);
}