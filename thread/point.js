class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.prevX = x;
      this.prevY = y;
      this.locked = false;
      this.selected = false;
    }
  }

  class Stick {
    constructor(a, b) {
      this.a = a;
      this.b = b;
      this.length = dist(a.x, a.y, b.x, b.y);
    }
  }


  class Obj {
    constructor(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
    }
  }
  