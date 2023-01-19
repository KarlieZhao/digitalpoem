class Segment {
    constructor(input1, input2) {
        this.point1 = input1;
        this.point2 = input2;
        this.restLength = input1.pos.dist(input2.pos);
    }

    sim() {
        let currentLength = this.point1.pos.dist(this.point2.pos);
        let lengthDifference = this.restLength - currentLength;
        let offsetPercent = lengthDifference / currentLength / 2;

        let direction = createVector(this.point2.pos.x, this.point2.pos.y, this.point2.pos.z);
        
        direction.sub(this.point1.pos);
        direction.mult(offsetPercent);
      
        if (!this.point1.snap) {
            this.point1.pos.sub(direction);
        }

        if (!this.point2.snap) {
            this.point2.pos.add(direction);
        }

    }

    draw() {
        strokeWeight(1);
        stroke(0)
        line(this.point1.pos.x, this.point1.pos.y, this.point2.pos.x, this.point2.pos.y);
    }
}