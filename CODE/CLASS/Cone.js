// Linfeng Li
// lli201
// 10/1/2020
// CS 425
// University of Illinois at Chicago

// cone class
class Cone {
    /*
     * @pram:
     *      nSectors: number of sectors to render
     *      color: RGB color of the cone
     */
    constructor(nSectors, gl, program, color) {
        this.nSectors = nSectors;
        this.gl = gl;
        this.program = program;

        let points = [];
        let colors = color;

        points.push(vec3(0, 1, 0));
        // Then the base points
        let dTheta = radians(360 / this.nSectors);
        for (let i = 1; i <= nSectors + 1; i++) {
            let theta = i * dTheta;
            points.push(vec3(Math.cos(theta), 0, Math.sin(theta)));
        }
        this.vbufferID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufferID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

        this.cbufferID = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cbufferID);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    // render basic cone
    render() {
        let gl = this.gl;
        // Connect the vertex data to the shader variables - First positions
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbufferID);
        let vPosition = gl.getAttribLocation(this.program, "vPosition");
        gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.cbufferID);
        let vColor = gl.getAttribLocation(program, "vColor");
        gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);

        // Unbind the array buffer, for safety sake.

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, (this.nSectors + 2));	// Sides
    }
}