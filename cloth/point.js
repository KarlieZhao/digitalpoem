class Point {
    constructor(posX, posY) {
        this.oldPos = createVector(posX, posY, 0.0);
        this.pos = createVector(posX, posY, 0.0);
        this.forces = createVector(0.0, 0.0, 0.0);
        this.snap = false;
        this.select = false; // Used for debugging to color selected verts
        this.drawSize = 5.0;
    }

    applyForce(force) {
        this.forces.add(force);
    }

    sim() {
        if (!this.snap) {
            // Add gravitys
            let gravity = createVector(0, 0.1, 0);
            this.applyForce(gravity);

            // Move point
            let velocity = createVector(this.pos.x, this.pos.y, this.pos.z);
            velocity.sub(this.oldPos);
            velocity.add(this.forces);
            let friction = 0.995;
            velocity.mult(friction);
            this.oldPos.set(this.pos);
            this.pos.add(velocity);
            this.forces.mult(0);
        }
    }

    // Limit position to window boundaries
    collideToWindow() {
        let border = 10.0;

        let vx = this.pos.x - this.oldPos.x;
        let vy = this.pos.y - this.oldPos.y;

        if (this.pos.y > height - border) {
            // Bottom screen
            let bounce = 0.8;
            this.pos.y = height - border;
            this.oldPos.y = this.pos.y + vy * bounce;
        } else if (this.pos.y < 0 + border) {
            // Top screen
            this.pos.y = 0 + border;
            this.oldPos.y = this.pos.y + vy;
        }
        if (this.pos.x < 0 + border) {
            // Left screen
            this.pos.x = 0 + border;
            this.oldPos.x = this.pos.x + vx;
        } else if (this.pos.x > width - border) {
            // Right screen
            this.pos.x = width - border;
            this.oldPos.x = this.pos.x + vx;
        }
    }

    draw(letter_index) {
        fill(0);
        stroke(0);
        strokeWeight(0);
        // ellipse(this.pos.x, this.pos.y, this.drawSize, this.drawSize);
        text(poem[letter_index], this.pos.x, this.pos.y);
    }
}