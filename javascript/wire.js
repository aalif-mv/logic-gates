class Wire {
    constructor() {
        this.id = '';
        this.lines = [];
        this.state = 0;
        this.color = ['black', 'rgb(14, 181, 14)'];
    }
    draw() {
        ctx.beginPath()
        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].draw(this.color[this.state], '3.6',' square');
        }
    }
    addLines(lines) {
        for (let i = 0; i < lines.length; i++) {
            this.lines.push(new Line({x: lines[i][0].x, y: lines[i][0].y}, {x: lines[i][1].x, y: lines[i][1].y}, lines[i][2]))
        }
    }
}

class Line {
    constructor(v1, v2, dir) {
        this.v1 = v1;
        this.v2 = v2;
        this.direction = dir;
        // console.log(this.direction)
    }
    draw(color, lineWidth, lineCap) {
        ctx.beginPath()
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = lineCap;
        ctx.moveTo(this.v1.x, this.v1.y);
        ctx.lineTo(this.v2.x, this.v2.y);
        ctx.stroke();
    }
    mouseOver(x, y) {
        switch (this.direction) {
            case 'H':
                if (y === this.v1.y && y === this.v2.y && hypotenuse(Math.abs(mouse[1].x - x), Math.abs(mouse[1].y - y)) <= 4 && ((this.v1.x < this.v2.x && x >= this.v1.x && x <= this.v2.x) || (this.v1.x > this.v2.x && x <= this.v1.x && x >= this.v2.x))) {
                    return true;
                }
                break;
            case 'V':
                if (x === this.v1.x && x === this.v2.x && hypotenuse(Math.abs(mouse[1].x - x), Math.abs(mouse[1].y - y)) <= 4 && ((this.v1.y < this.v2.y && y >= this.v1.y && y <= this.v2.y) || (this.v1.y > this.v2.y && y <= this.v1.y && y >= this.v2.y))) {
                    return true;
                }
                break;
            default:
                break;
        }
        return false;
    }
}