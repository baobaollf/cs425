// Linfeng Li
// lli201
// 8/31/2020
// CS 425
// University of Illinois at Chicago 

// environment
var gl;
// points to render
var vertices;
// colors to assign
var colors = [];

/**
  * this program will randomly generate six different sets of 
  * triangles
  *
  * each triangle set has 8 randomly generated triangles
  * each trangle is assigned to a verying color and rendered
  @ input: none
  @ output: none
**/

window.onload = function init() {
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
 
    
    vertices = eightTriangleGenerator();

    for (var i = 0; i < 5; i++) {
        vertices = vertices.concat(eightTriangleGenerator());
    }
    
    for (var i = 0; i < vertices.length; i++) {
        colors.push(randomNumberGenerator());
        colors.push(randomNumberGenerator());
        colors.push(randomNumberGenerator());
        colors.push(1);
    }

    vertices = new Float32Array(vertices);


    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.294, 0.211, 0.886, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Load the color data into the GPU
    var colorBufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colorBufferId );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var colorPosition = gl.getAttribLocation( program, "colors" );
    gl.vertexAttribPointer( colorPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( colorPosition );
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    render();
};

// render the data
/**
    @ input: none
    @ output: none
**/
function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, vertices.length);
}

// generate random points between 0 to 45 degrees
/**
    @ input: none
    @ output: a pair points
**/
function randomPointGenerator() {
    var x = randomNumberGenerator();
    var y = randomNumberGenerator();
    while (y > x) {
        y =  randomNumberGenerator();
    }
    return [x, y];
}

// swap index i and j on triangle
/**
    @ input: 
        - triangle: an array
        - i: left index to swap
        - j: right index to swap
    @ output: swapped triangle array
**/
function swap(triangle, i , j) {
    var temp = triangle[i];
    triangle[i] = triangle[j];
    triangle[j] = temp;
    return triangle;
}


// generate random numbers between [0, 1)
/**
    @ input: none
    @ output: a random between [0, 1)
**/
function randomNumberGenerator() {
    return Math.random();
}

// generate eight different triagles
/**
    @ input: none
    @ output: an array of the coordinates of eight triangles
**/
function eightTriangleGenerator() {

    // step 1
    // generate 3 three random points between 0 to 45 degree
    var pointOne = randomPointGenerator();
    var pointTwo = randomPointGenerator();
    var pointThree = randomPointGenerator();

    var triOne = pointOne.concat(pointTwo, pointThree);
    var triTwo = triOne.slice();

    // step 2
    // flip each point (x, y) to (y, x)
    for (var i = 0; i < triOne.length; i += 2) {
        triTwo = swap(triTwo, i, i + 1);
    }

    triTwo = triOne.concat(triTwo);

    // step 3
    // flip each point (x, y) to (-x, y)
    var triFour = triTwo.slice()
    for (var i = 0; i < triFour.length; i += 2) {
        triFour[i] = -triFour[i];
    }

    triFour = triTwo.concat(triFour);

    // step 3
    // flip each point (x, y) to (x, -y)
    var triEight = triFour.slice()
    for (var i = 1; i < triEight.length; i += 2) {
        triFour[i] = -triFour[i];
    }

    triEight = triFour.concat(triEight);
    return triEight;
}