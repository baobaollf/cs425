
class Wall {
    constructor(gl) {
        // Establish arrays to hold vertex data
        var points = [];	// Vertex location data
        var colors = [];	// Vertex color data
        var texCoords = [];	// Vertex texture coordinate data

        this.program = initShaders(gl, "vertex-shader-2", "fragment-shader-2");
        gl.useProgram(this.program);
        // Set up the canvas, viewport, and clear color
        var canvas = document.getElementById("gl-canvas");
        gl = WebGLUtils.setupWebGL(canvas);
        if (!gl) {
            alert("No WebGL");
        }

        gl.viewport(0, 0, canvas.width, canvas.height);
        aspectRatio = canvas.width / canvas.height;


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


        let nPoints = 4;

        // Push Vertex Location Data to GPU, and attach the buffer to the vPosition attribute

        var vbufferID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbufferID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

        var vPosition = gl.getAttribLocation(this.program, "vPosition");
        gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        // Push Vertex Color Data to GPU, and attach the buffer to the vColor attribute

        var cbufferID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cbufferID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

        var vColor = gl.getAttribLocation(this.program, "vColor");
        gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);

        // Push Vertex texture coordinate data to GPU, and attach the buffer to the vTexCoords attribute

        var tbufferID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, tbufferID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

        var vTex = gl.getAttribLocation(this.program, "vTexCoords");
        gl.vertexAttribPointer(vTex, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vTex);

        let image = document.getElementById("bricks");	// File loaded in html code, accessed here.
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        let texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.uniform1i(gl.getUniformLocation(this.program, "texMap"), 0);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);


        // Unbind the buffer, for safety sake.

        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.enable(gl.DEPTH_TEST);

        // Initialization is done.  Now initiate first rendering
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Create mat4 transformation matrices as needed to transform vertices.
        // May include object transformation, camera movelView, and camera projection

        // Create modelView using lookAt( eye, at, up );

        //var modelView = mat4( ); // Identity matrix unless changed otherwise.
        var modelView = lookAt(vec3(30, 2, 39), vec3(0, 0, 20), vec3(0, 1, 0));

        // Push the transformation matrices to the GPU as uniform variables

        var vModelView = gl.getUniformLocation(this.program, "vModelView");
        gl.uniformMatrix4fv(vModelView, false, flatten(modelView));

        // Create another mat4 using perspective( ) and send it to the GPU

        let projection = perspective(60, aspectRatio, 0.1, 100.0);
        var vProjection = gl.getUniformLocation(this.program, "vProjection");
        gl.uniformMatrix4fv(vProjection, false, flatten(projection));

        // Create another mat4 as an Identity matrix and send it to the GPU

        var transformation = mult(translate(0, 0, 0), scalem(15, 15, 10));
        var vTransformation = gl.getUniformLocation(this.program, "vTransformation");
        gl.uniformMatrix4fv(vTransformation, false, flatten(transformation));

        // Do the drawing
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, nPoints);	// Or gl.TRIANGLES, or . . .



    }
}

