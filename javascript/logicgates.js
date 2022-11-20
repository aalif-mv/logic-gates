class Gates {
    constructor(src, gridCellWidth, x, y) {
        this.id = '';
        this.position = {x: x, y: y};
        this.connector_radius = 20;
        this.image = new Image();
        this.image.src = src;
        this.height = (gridCellWidth * 80.32) / 20;
        this.width = (this.height * this.image.width) / this.image.height;
        this._connector = [
            {x: this.width, y: (gridCellWidth * 2), input: false, wireId: null},
            {x: 0, y: gridCellWidth, input: true, wireId: null},
            {x: 0, y: (gridCellWidth * 3), input: true, wireId: null}
        ];
    }
    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        // for (let i = 0; i < this._connector.length; i++) {
        //     ctx.beginPath();
        //     ctx.arc(this._connector[i].x, this._connector[i].y, 4, 0, Math.PI * 2);
        //     ctx.stroke();
        // }
    }
    updateState() {
        // 
    }
    validate3con() {
        if (Objects.wires[this._connector[0].wireId] != undefined && Objects.wires[this._connector[2].wireId] != undefined && Objects.wires[this._connector[1].wireId] != undefined && this._connector[0].wireId != null && this._connector[1].wireId != null && this._connector[2].wireId != null) {
            return true;
        }
        return false;
    }
}
class And extends Gates {
    constructor(src, gridCellWidth, x, y) {
        super(src, gridCellWidth, x, y);
    }
    updateState() {
        if (super.validate3con()) {
            let input1 = Objects.wires[this._connector[1].wireId].state;
            let input2 = Objects.wires[this._connector[2].wireId].state;
            Objects.wires[this._connector[0].wireId].state = and(input1, input2);
        }
    }
}
class Nand extends Gates {
    constructor(src, gridCellWidth, x, y) {
        super(src, gridCellWidth, x, y);
    }
    updateState() {
        if (super.validate3con()) {
            let input1 = Objects.wires[this._connector[1].wireId].state;
            let input2 = Objects.wires[this._connector[2].wireId].state;
            Objects.wires[this._connector[0].wireId].state = nand(input1, input2);
        }
    }
}
class Or extends Gates {
    constructor(src, gridCellWidth, x, y) {
        super(src, gridCellWidth, x, y);
    }
    updateState() {
        if (super.validate3con()) {
            let input1 = Objects.wires[this._connector[1].wireId].state;
            let input2 = Objects.wires[this._connector[2].wireId].state;
            Objects.wires[this._connector[0].wireId].state = or(input1, input2);
        }
    }
}
class Nor extends Gates {
    constructor(src, gridCellWidth, x, y) {
        super(src, gridCellWidth, x, y);
    }
    updateState() {
        if (super.validate3con()) {
            let input1 = Objects.wires[this._connector[1].wireId].state;
            let input2 = Objects.wires[this._connector[2].wireId].state;
            Objects.wires[this._connector[0].wireId].state = nor(input1, input2);
        }
    }
}
class Buffer extends Gates {
    constructor(src, gridCellWidth, x, y) {
        super(src, gridCellWidth, x, y);
        this._connector = [
            {x: this.width, y: (gridCellWidth * 2), input: false, wireId: null},
            {x: 0, y: (gridCellWidth*2), input: true, wireId: null},
        ];
    }
    updateState() {
        if (this._connector[0].wireId != null && this._connector[1].wireId != null && Objects.wires[this._connector[0].wireId] != undefined && Objects.wires[this._connector[1].wireId] != undefined) {
            let input = Objects.wires[this._connector[1].wireId].state;
            Objects.wires[this._connector[0].wireId].state = input;
        }
    }
}
class Not extends Gates {
    constructor(src, gridCellWidth, x, y) {
        super(src, gridCellWidth, x, y);
        this._connector = [
            {x: this.width, y: (gridCellWidth * 2), input: false, wireId: null},
            {x: 0, y: (gridCellWidth*2), input: true, wireId: null},
        ];
    }
    updateState() {
        if (this._connector[0].wireId != null && this._connector[1].wireId != null) {
            let input = Objects.wires[this._connector[1].wireId].state;
            Objects.wires[this._connector[0].wireId].state = xor(input, 1); // or use not !! might be slower
        }
    }
}
class Xor extends Gates {
    constructor(src, gridCellWidth, x, y) {
        super(src, gridCellWidth, x, y);
    }
    updateState() {
        if (super.validate3con()) {
            let input1 = Objects.wires[this._connector[1].wireId].state;
            let input2 = Objects.wires[this._connector[2].wireId].state;
            Objects.wires[this._connector[0].wireId].state = xor(input1, input2);
        }
    }
}
class Xnor extends Gates {
    constructor(src, gridCellWidth, x, y) {
        super(src, gridCellWidth, x, y);
    }
    updateState() {
        if (super.validate3con()) {
            let input1 = Objects.wires[this._connector[1].wireId].state;
            let input2 = Objects.wires[this._connector[2].wireId].state;
            Objects.wires[this._connector[0].wireId].state = xnor(input1, input2);
        }
    }
}

class Input extends Gates {
    constructor(src, gridCellWidth, x, y) {
        super(src, gridCellWidth, x, y);
        this.height = (gridCellWidth * 40) / 20;
        this.width = (this.height * this.image.width) / this.image.height;
        this.state = 0;
        this.src = 'assets/graphics/input';
        this.image.src = this.src + this.state + '.svg';
        this._connector = [
            {x: (gridCellWidth*3), y: gridCellWidth, input: false, wireId: null},
        ];
    }
    changeState() {
        this.state = 1^this.state;
        if (this._connector[0].wireId != null && Objects.wires[this._connector[0].wireId] != undefined) {
            Objects.wires[this._connector[0].wireId].state = this.state;
            // console.log('Wire state',Objects.wires[this._connector[0].wireId].state)
        }
        this.image.src = this.src + this.state + '.svg';
    }
}

class Output extends Gates {
    constructor(src, gridCellWidth, x, y) {
        super(src, gridCellWidth, x, y);
        this.height = (gridCellWidth * 40) / 20;
        this.width = (this.height * this.image.width) / this.image.height;
        this.state = 0;
        this.src = 'assets/graphics/output'
        this.image.src = this.src + this.state + '.svg';
        this._connector = [
            {x: 0, y: gridCellWidth, input: true, wireId: null},
        ];
    }
    updateState() {
        if (this._connector[0].wireId != null && Objects.wires[this._connector[0].wireId] != undefined) {
            let input = Objects.wires[this._connector[0].wireId].state;
            this.state = input;
            this.image.src = this.src + this.state + '.svg';
        }
    }
}