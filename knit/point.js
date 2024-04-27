class Point {
    constructor(letter_index, posX, posY) {
        this.oldPos = createVector(posX, posY);
        this.pos = createVector(posX, posY);
        this.forces = createVector(0, 0);
        this.letter_index = letter_index;
        this.snappable = true;
        this.snap = false;
        this.select = false; // Used for debugging to color selected vertices
        this.drawSize = 5.0;
    }

    applyForce(force) {
        this.forces.add(force);
    }

    sim() {
        if (!this.snap) {
            // Add gravity
            const gravity = createVector(0, 0.01);
            this.applyForce(gravity);

            // Move point
            let velocity = p5.Vector.sub(this.pos, this.oldPos);
            velocity.add(this.forces);
            const friction = 0.995;
            velocity.mult(friction);
            this.oldPos.set(this.pos);
            this.pos.add(velocity);
            this.forces.mult(0);
        }
    }

    collideToWindow() {
        const border = 10.0;

        let vx = this.pos.x - this.oldPos.x;
        let vy = this.pos.y - this.oldPos.y;

        if (this.pos.y > height - border) {
            // Bottom screen
            const bounce = 0.5;
            this.pos.y = height - border;
            this.oldPos.y = this.pos.y + vy * bounce;
        } else if (this.pos.y < border) {
            // Top screen
            this.pos.y = border;
            this.oldPos.y = this.pos.y + vy;
        }
        if (this.pos.x < border) {
            // Left screen
            this.pos.x = border;
            this.oldPos.x = this.pos.x + vx;
        } else if (this.pos.x > width - border) {
            // Right screen
            this.pos.x = width - border;
            this.oldPos.x = this.pos.x + vx;
        }
    }

    draw() {
        if (this.letter_index < poem.length) {
            if (mouseIsPressed) { text(poem.charAt(this.letter_index), this.pos.x, this.pos.y); } else { circle(this.pos.x, this.pos.y, 3); }
        }
    }
}