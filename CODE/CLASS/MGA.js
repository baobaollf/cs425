class MGA {
    constructor(gl, program, x, y, z) {
        this.gl = gl;
        this.program = program;
        this.cones = [];
        this.cone = new Cone(6, this.gl, this.program);
        this.x = x;
        this.y = y;
        this.z = z;
        this.coneCount = 4;
        this.nSectors = 15;
        this.today = new Date();

        let coneSize = scalem(0, 0, 0);
        let coneTranslations = [
            [4, 2.5, 1],
            [1, 2.5, -4],
            [-4, 2.5, -1],
            [-1, 2.5, 4]
        ];
        let coneAxes = [
            [-1, 0, 0],
            [0, 0, 1],
            [1, 0, 0],
            [0, 0, 0]
        ];
        this.coneShapes = [];
        for (let i = 0; i < coneCount; i++) {
            let coneTranslation = translate(coneTranslations[i][0], coneTranslations[i][1],coneTranslations[i][2]);
            this.cones[i] = new Cone(this.nSectors, gl, program);

        }
    }

    render() {
        let rotation = rotateY(this.today.getTime() / 5);
        let MGA_translation = translate(this.x, this.y, this.z);
        let MGA_move = mult(rotation, MGA_translation);
        var vTransformation = gl.getUniformLocation(program, "vTransformation");

        var transformation = mult(MGA_move, vec3(0, 0.1, 0));
        gl.uniformMatrix4fv(vTransformation, false, flatten(transformation));
        this.cone.render();

        transformation = mult(MGA_move, vec3(0, 2, 0));
        gl.uniformMatrix4fv(vTransformation, false, flatten(transformation));
        this.cone.render();

        for (let i = 0; i < this.coneCount; i++) {
            transformation = mult(translate(x, 0.5 * Math.sin(this.today.getTime() / 1000 / 6 * 2 * Math.PI), z), scalem(0.2, 0.5, 0.2));
            transformation = mult(transformation, MGA_move);
            gl.uniformMatrix4fv(vTransformation, false, flatten(transformation));
            this.cones[i].render();
        }
    }
}