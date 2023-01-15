let maxSpeed = 1;
let l = 0;
class Element {
  constructor(w, p, clickable, poem, conjunctWord) {
    l++;
    this.word = w;
    this.pos = p;
    this.clickable = clickable;
    this.isPoem = poem;
    this.appeared = false;
    this.landPos = -l / 10 - 5;
    this.crtAngle = 0;
    this.sz = 19;
    //-----------------------------------
    if (RiTa.isPunct(this.word)) {
      this.weight = random(15, 45);
    } else {
      this.weight = map(this.word.length, 1, 15, 1, 5);
      this.weight = constrain(this.weight, 1, 5);

    }
    this.isTouched = false;
    this.switch = false;
    this.speed = createVector(0, 0);
    this.acc = createVector(0, this.weight / 5);

    //transparency
    if (conjunctWord) {
      this.c = 40;
      this.solidSpeed = 8;
    } else {
      this.c = 0;
      this.solidSpeed = random(2, 5);
    }
    this.lineTrans = 100;
    this.crtLife = 0;
    this.maxLife = RiTa.isPunct(this.word) ? random(200, 600) : random(2500, 3500);
  }

  //-----------------------------------
  applyForce(force) {
    this.acc.add(force);
    if (RiTa.isPunct(this.word)) {
      this.pos.y -= 17 /this.weight;
    } else {
      this.speed.y += this.weight / random(100, 300);
      this.speed.add(this.acc.div(this.weight));
      this.speed.limit(maxSpeed);
      this.pos.add(this.speed);

    }
  }

  newWord() {
    if (!RiTa.isPunct(this.word)) {
      this.word = random(localizedWords);
      this.sz = random(13, 23);
    } else {
      this.word = "。";
      this.sz = this.weight;
    }
  }

  follow(vector) {
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);
    var index = x + y * cols;
    var force = vector[index];
    this.applyForce(force);
  }

  move() {
    if (this.pos.x > width + 30 || this.pos.x < -30 || this.pos.y < -30) {
      this.crtLife = this.maxLife;
      this.isTouched = false;
    } else if (this.pos.y >= height + this.landPos) {
      this.maxLife++;
      this.follow(flowfield);
      this.acc.limit(0.05);
      this.speed.limit(0.05);
      this.speed.y = 0;
    } else if (this.isTouched && this.c >= 50) {
      this.follow(flowfield);
    }
  }

  update() {
    if (this.crtLife >= this.maxLife) {
      this.c -= 2;
    } else {
      this.crtLife++;
    }

    if (this.switch) {
      this.move();
      if (this.c < 60) {
        this.c += 10;
      }
    } else if (this.isTouched) {
      if (this.c <= 50) {
        this.newWord();
        this.switch = true;
      } else {
        this.c -= 10;
      }
    } else {
      if (this.crtLife >= this.maxLife * 0.65) {
        this.isTouched = true;
      }
    }
  }

  render() {
    if (!this.appeared && this.c >= 250) {
      this.appeared = true;
    } else if (!this.appeared) {
      this.c += this.solidSpeed;
    }

    if (this.clickable) {
      stroke(this.lineTrans, 255);
      this.lineTrans += (this.lineTrans < 255) ? 3 : 0;
      strokeWeight(1);
      line(this.pos.x, this.pos.y + 1.2 * textDescent(), this.pos.x + textWidth(this.word + " "), this.pos.y + 1.2 * textDescent());
      fill(255, this.c);
    } else {
      fill(220, this.c);
      if (!this.isPoem) {
        this.update();
      }
    }

    push();
    translate(this.pos.x, this.pos.y);
    this.crtAngle = lerp(this.crtAngle, this.speed.heading() / 10, 0.1);
    rotate(this.crtAngle);
    noStroke();
    textSize(this.sz);
    text(this.word, 0, 0);
    pop();
  }

  mouseInsideText() {
    let top = this.pos.y - textAscent();
    let bottom = this.pos.y + textDescent();
    return (mouseX > this.pos.x && mouseX < this.pos.x + textWidth(this.word) &&
      mouseY > top && mouseY < bottom);
  }

}
