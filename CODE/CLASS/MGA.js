// Linfeng Li
// lli201
// 10/1/2020
// CS 425
// University of Illinois at Chicago

// merry go around class
// handle render of cones and merry go around base and top
class MGA {
    /*
     * @pram:
     *      x: location on x axis
     *      y: location on y axis
     *      z: location on z axis
     */
    constructor(gl, program, x, y, z) {
        this.gl = gl;
        this.program = program;
        // cone coordinates
        this.cones = [];
        this.cone = new Cone(6, this.gl, this.program, [0.5, 0.3, 0.9]);
        this.x = x;
        this.y = y;
        this.z = z;
        // number of cones
        this.coneCount = 4;
        this.nSectors = 15;
        let coneOffset = 0.59;
        this.baseMove = mult(translate(0, 0.1, 0), scalem(1.5, 0, 1.5));
        this.topMove = mult(translate(0, 2, 0), scalem(1.5, 0.8, 1.5));
        let coneSize = scalem(0.3, 0.5, 0.3);
        // cone relative location
        let coneTranslations = [
            [0.1 + coneOffset, 1, 0.1 + coneOffset],
            [0.1 + coneOffset, 1, -0.1 - coneOffset],
            [0.1 - coneOffset, 1, -0.1 - coneOffset],
            [0.1 - coneOffset, 1, 0.1 + coneOffset]
        ];
        // cone axes
        let coneAxes = [
            [-1, 0, 0],
            [0, 0, 1],
            [1, 0, 0],
            [0, 0, -1]
        ];
        // cone colors
        let colors = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
            [1, 1, 0.1]
        ]
        // initialize each cone
        this.coneMoves = [];
        for (let i = 0; i < this.coneCount; i++) {
            let coneTranslation = translate(coneTranslations[i][0], coneTranslations[i][1], coneTranslations[i][2]);
            let rotation = rotate(-60, coneAxes[i]);
            let form = mult(rotation, coneSize);
            this.coneMoves[i] = mult(coneTranslation, form);
            this.cones[i] = new Cone(this.nSectors, gl, program, colors[i]);
        }
    }

    // render entire merry go around with actions
    render() {
        // get time seed
        let today = new Date();
        let rotation = rotateY(today.getTime() / 8);
        let MGA_translation = translate(this.x, this.y, this.z);
        let MGA_move = mult(MGA_translation, rotation);

        // apply move for top and bottom
        let vTransformation = this.gl.getUniformLocation(this.program, "vTransformation");
        let transformation = mult(MGA_move, this.baseMove);
        this.gl.uniformMatrix4fv(vTransformation, false, flatten(transformation));
        this.cone.render();


        transformation = mult(MGA_move, this.topMove);
        this.gl.uniformMatrix4fv(vTransformation, false, flatten(transformation));
        this.cone.render();

        // apply move for each cone
        for (let i = 0; i < this.coneCount; i++) {
            transformation = mult(translate(0, 0.5 * Math.sin(today.getTime() / 1000 / 6 * 5 * Math.PI), 0), this.coneMoves[i]);
            transformation = mult(MGA_move, transformation);
            this.gl.uniformMatrix4fv(vTransformation, false, flatten(transformation));
            this.cones[i].render();
        }
    }
}