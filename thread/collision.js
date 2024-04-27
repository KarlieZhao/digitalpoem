function collision() {
  for (let i = 0; i < pointArray.length; i++) {
    let point = pointArray[i];
    let pX = point.prevX;
    let pY = point.prevY;
    let vx = point.x - pX;
    let vy = point.y - pY;
    let p = createVector(point.x, point.y);

    if (!point.locked) {
      if (point.y >= height) {
        point.x -= vx * friction;
        point.y = ground - textS / 2;
        point.prevY = point.y + (vy * bounce);
      }
      if (point.y <= 0) {
        point.y = 0;
        point.prevY = point.y + (vy * bounce);
      }
      if (point.x <= 0) {
        point.x = 0;
        point.prevX = point.x + (vx * bounce);
      }
      if (point.x >= width) {
        point.x = width;
        point.prevX = point.x - (vx * bounce);
      }
    }

    for (let j = 0; j < objectArray.length; j++) {
      let obj = objectArray[j];
      if (p.dist(createVector(obj.x, obj.y)) < obj.r) {
        let s = createVector(obj.x, obj.y);
        let dir = p5.Vector.sub(p, s).normalize();
        p = p5.Vector.add(s, p5.Vector.mult(dir, obj.r));
        point.x = p.x;
        point.y = p.y;
      }
    }

    if (point.y > ground - textS / 2) {
      point.y = ground - textS / 2;
    }
  }
}
