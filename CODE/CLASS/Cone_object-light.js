// Linfeng Li
// lli201
// 10/29/2020
// CS 425
// University of Illinois at Chicago

// cone class
class Cone {
    constructor(nSectors, gl, program, color) {

        this.nSectors = nSectors;
        this.gl = gl;
        this.program = program;

        var points = [] // vertex location data
        var colors = [] // vertex color data

// generate colors
        var validColor = false;

        if (Array.isArray(color) && color.length == 3
            && color[0] >= 0 && color[1] >= 0 && color[2] >= 0
            && color[0] <= 1 && color[1] <= 1 && color[2] <= 1) {
            validColor = true
        }

        for (var i = 0; i < nSectors + 2; i++) {
            if (validColor) {
                colors.push(vec3(color));
            } else {
                colors.push(vec3(Math.random(), Math.random(), Math.random()));
            }
        }

// then the vertex locations
        points.push(vec3(0, 1, 0));

// then the base points
        var dTheta = radians(360 / nSectors);

        for (i = 0; i < nSectors + 1; i++) {
            var theta = i * dTheta;
            points.push(vec3(Math.cos(theta), 0, Math.sin(theta)));
        }


// all data is now calculated, time to insert into buffers
// first the location data to the GPU
        this.vbufferID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufferID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

// then the color data to the GPU
        this.cbufferID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cbufferID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

// unbind buffers for safety
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        return;
    }

    render() {
// attach vertex shader variables to the buffers created above
        var gl = this.gl;

// connect the vertex data to the shader variables -> first position
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufferID);
        var vPosition = gl.getAttribLocation(this.program, "vPosition");
        gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

// then the colors
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cbufferID);
        var vColor = gl.getAttribLocation(this.program, "vColor");
        gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);

// unbind the array buffer for safety
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

// and then draw the cones
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.nSectors + 2); // sides
        gl.drawArrays(gl.TRIANGLE_FAN, 1, this.nSectors + 1); // bottom

        return;
    } // render()
} // class Cone