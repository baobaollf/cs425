// Linfeng Li
// lli201
// 10/29/2020
// CS 425
// University of Illinois at Chicago

let gl;				// WebGL graphics environment
let program;		// The shader program
let aspectRatio;	// Aspect ratio of viewport
let view;

// camera starting location
let x = 6;
let y = 3;
let z = 6;

// seed for increment change
let delta = 0.01;
// starting angle
let angle = 0;

// location of the camara
let eye = vec3(x, y, z);
// where to look at
let up = vec3(0, 1, 0);

// location of merry go around
let mga_x = 2;
let mga_y = 0;
let mga_z = 3;

// merry go around location
let MGA_location = [mga_x, mga_y, mga_z];
// distance between camara and merry go around
let distance = Math.sqrt(Math.pow(x - mga_x, 2) + Math.pow(z - mga_z, 2));
// where the camera should look at
let at = vec3(mga_x, mga_y, mga_z);

// ran when window first loaded
window.onload = function init() {
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

    let projection = perspective(60, aspectRatio, 0.1, 100.0);
    let vProjection = gl.getUniformLocation(program, "vProjection");
    gl.uniformMatrix4fv(vProjection, false, flatten(projection));

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    view = new MGA(gl, program, MGA_location);
    gl.enable(gl.DEPTH_TEST);

    render();
}

// render merry go around and it's horses.
// read from keyboard in put to move camera.
// 'w' and 's' move the camera closer and further to the
// merry go around.
// 'a' and 'd' make the camera rotate around the
// merry go around
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    let modelView = lookAt(eye, at, up);
    let vModelView = gl.getUniformLocation(program, "vModelView");
    gl.uniformMatrix4fv(vModelView, false, flatten(modelView));

    let transformation = mat4();
    let vTransformation = gl.getUniformLocation(program, "vTransformation");
    gl.uniformMatrix4fv(vTransformation, false, flatten(transformation));


    let normalTransformation = mat4();
    let vNormalTransformation = gl.getUniformLocation(program, "vTransformation");
    gl.uniformMatrix4fv(vNormalTransformation, false, flatten(normalTransformation));
    view.render();
    document.addEventListener('keydown', onDocumentKeyDown, false);

    // handle key presses
    function onDocumentKeyDown(event) {
        event = event || window.event;
        let keycode = event.keyCode;
        switch (keycode) {
            case 68 : //d -> right
                angle += delta;
                break;
            case 83 : // s -> down
                distance += delta;
                break;
            case 65 : // a -> left
                angle -= delta;
                break;
            case 87 : // w -> up
                distance -= delta;
                break;
            case 82: // r -> reload page
                location.reload();
                break;
            case 81: // q -> quit program
                close_window();
                break;
            default: // other keys: bring up prompt window
                promptWindow();
                break;
        }
        if (x >= 10) {
            x = 10;
        } else if (x <= 0) {
            x = 0;
        }
        x = distance * Math.cos(radians(angle));
        z = distance * Math.sin(radians(angle));
        eye = vec3(x, y, z);

        document.addEventListener('keyup', onDocumentKeyUp, false);
    }

    function onDocumentKeyUp(event) {
        document.removeEventListener('keydown', onDocumentKeyDown, false);
    }

    requestAnimFrame(render);
}

// bring up prompt window
async function promptWindow() {
    let x = document.getElementById("myDIV");
    x.style.display = "block";
}

// close the prompt window button
function closeDiv() {
    let x = document.getElementById("myDIV");
    x.style.display = "none";

}

// when close the program,
// redirect to google.com
function close_window() {
    if (confirm("Quit?")) {
        window.location.href = "https://www.google.com/";
    }
}