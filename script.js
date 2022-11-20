function and(a, b) {
    return a & b;
}
function or(a, b) {
    return a | b;
}
function nor(a, b) {
    return 1-(a | b);
}
function not(a) {
    return Math.abs(~-Math.abs(a));
}
function xor(a, b) {
    return a ^ b;
}
function xnor(a, b) {
    return 1-(a ^ b);
}
function nand(a, b) {
    return 1 - a * b
}

// 
const inputWidth = () => {
    let w = parseInt(prompt('10, 20, 40'));
    if (w == 10 || w == 20 || w == 40) {
        return w;
    } else {
        return 20;
    }
}; // 10, 20, 40 only

// creates layers to draw on the canvas
// layer is sorted bottom to top, from the order of creation
Renderer.createLayer('Wires');
Renderer.createLayer('Gates');
Renderer.createLayer('Foreground');
Renderer.createLayer('Mouse');
Renderer.createLayer('Trace');

Renderer.layers['Trace'][0] = [{x:-10, y:-10}, {x: -20, y: -20}, {x: -30, y: -30}]

// stores keys pressed
const keyMap = new Map();
const mouse = [{x: 0, y: 0}, {x: 0, y: 0}];
let gridCellWidth = 10;
const grid = document.getElementById('grid');
const canvas = document.getElementById('canvas');
const canvas_holder = document.getElementById('canvas_holder');
const ctx = canvas.getContext('2d');
canvas.width = round(canvas_holder.clientWidth, gridCellWidth);
canvas.height = round(canvas_holder.clientHeight, gridCellWidth);


const background = generate_background('grid');
background.onload = function() {
    ctx.drawImage(background, 0, 0);
}

let selectedItem = null;
let lSelItem = null;
let mouseDown = false;
let start_cord = null;
let sOverConnector = [false];
sOverConnector[2] = {update: false, _gateId:[null], _wireId:null}
let cords = [];
let dir = '';

// console.log(document.documentElement.clientHeight - (canvas_holder.offsetTop + canvas_holder.clientHeight))

Renderer.layers['Mouse'][0] = {x: 0, y: 0, r: 0}
window.addEventListener('resize', (e) => {
    canvas.width = round(document.documentElement.clientWidth-58, gridCellWidth);
    generate_background('grid');
});
canvas.addEventListener('mousemove', (e) => {
    // mouse x position - canvas offset - 4 (padding of the canvas) + document scroll
    // document scroll is added to make it work when it is scrolled
    let x = (e.x - canvas.offsetLeft - 4) + document.documentElement.scrollLeft;
    let y = (e.y - canvas.offsetTop - 4) + document.documentElement.scrollTop;
    let grid_pos = {
        x: round(x, gridCellWidth),
        y: round(y, gridCellWidth)
    }
    mouse[0].x = grid_pos.x;
    mouse[0].y = grid_pos.y;

    mouse[1].x = x;
    mouse[1].y = y;

    if (mouseDown && selectedItem == null && start_cord != null && sOverConnector[0]) {
        ctx.beginPath();
        let dist = {
            x: Math.abs(start_cord.x - grid_pos.x),
            y: Math.abs(start_cord.y - grid_pos.y)
        }
        // console.log(dist.x , dist.y)
        if (dist.x == 0 || dist.y == 0) {
            if (dist.x == 0) {
                dir = 'V';
            } else if (dist.y == 0) {
                dir = 'H';
            }
        }
        switch (dir) {
            case 'H':
                cords = [{x: grid_pos.x, y: start_cord.y}, {x: grid_pos.x, y: grid_pos.y}, 'H', 'V'];
                break;
            case 'V':
                cords = [{x: start_cord.x, y: grid_pos.y}, {x: grid_pos.x, y: grid_pos.y}, 'V', 'H'];
                break;
            default:
                break;
        }
        Renderer.layers['Trace'][0] = [{x:start_cord.x, y:start_cord.y}, {x: cords[0].x, y: cords[0].y}, {x: cords[1].x, y: cords[1].y}]
    }
});
canvas.addEventListener('mousedown', (e) => {
    let x = (e.x - canvas.offsetLeft - 4) + document.documentElement.scrollLeft;
    let y = (e.y - canvas.offsetTop - 4) + document.documentElement.scrollTop;
    let grid_pos = {
        x: round(x, gridCellWidth),
        y: round(y, gridCellWidth)
    }
    for (const id in Objects.gates) {
        if (Object.hasOwnProperty.call(Objects.gates, id)) {
            const gate = Objects.gates[id];
            for (let i = 0; i < gate._connector.length; i++) {
                if (hypotenuse(mouse[1].x - (gate.position.x + gate._connector[i].x), mouse[1].y - (gate.position.y + gate._connector[i].y)) <= 4) {
                    sOverConnector[0] = true;
                    sOverConnector[1] = {x: round((gate.position.x + gate._connector[i].x), gridCellWidth), y: round((gate.position.y + gate._connector[i].y),gridCellWidth)};
                    sOverConnector[2] = {update: false, _gateId:[id, i], _wireId:null};
                }
            }
        }
    }
    for (const id in Objects.wires) {
        if (Object.hasOwnProperty.call(Objects.wires, id) && sOverConnector[0] == false) {
            const wire = Objects.wires[id];
            for (let i = 0; i < wire.lines.length; i++) {
                if (wire.lines[i].mouseOver(mouse[0].x, mouse[0].y)) {
                    Renderer.layers['Mouse'][0] = {x: (mouse[0].x), y: (mouse[0].y), r: 4};
                    sOverConnector[0] = true;
                    sOverConnector[1] = {x: mouse[0].x, y: mouse[0].y};
                    sOverConnector[2] = {update: true, _gateId:[null], _wireId:id} // the true here means the line is being updated
                    break;
                }
            }
        }
    }
    mouseDown = true;
    if (sOverConnector[0]) {
        start_cord = sOverConnector[1];
    } else {
        start_cord = null;
        selectedItem = select(x, y);
        lSelItem = selectedItem;
        if (selectedItem != null && Objects.gates[selectedItem].constructor.name == 'Input') {
            Objects.gates[selectedItem].changeState()
        }
    }
    if (selectedItem == null) {
        lSelItem = null;
        Renderer.layers['Foreground'][0] = {x: -200, y: -200, width: 0, height: 0};
    }
    // console.log('down');
    dir = null;
});
window.addEventListener('mouseup', (e) => {
    let x = (e.x - canvas.offsetLeft - 4) + document.documentElement.scrollLeft;
    let y = (e.y - canvas.offsetTop - 4) + document.documentElement.scrollTop;
    let grid_pos = {
        x: round(x, gridCellWidth),
        y: round(y, gridCellWidth)
    }
    for (const id in Objects.wires) {
        if (Object.hasOwnProperty.call(Objects.wires, id)) {
            const wire = Objects.wires[id];
            for (let i = 0; i < wire.lines.length; i++) {
                if (wire.lines[i].mouseOver(mouse[0].x, mouse[0].y)) {
                    Renderer.layers['Mouse'][0] = {x: (mouse[0].x), y: (mouse[0].y), r: 4};
                    sOverConnector[2] = {update: true, _gateId:[sOverConnector[2]._gateId[0], sOverConnector[2]._gateId[1]], _wireId:id} // the true here means the line is being updated
                    // console.log('join to line')
                    break;
                }
            }
        }
    }
    if (start_cord != null && cords != null) {
        cords.unshift(start_cord);
        const lines = [[{x: cords[0].x, y: cords[0].y}, {x: cords[1].x, y: cords[1].y}, cords[3]],[{x: cords[1].x, y: cords[1].y}, {x: cords[2].x, y: cords[2].y}, cords[4]]]
        if (sOverConnector[2].update) {
            Objects.wires[sOverConnector[2]._wireId].addLines(lines);
            // console.log(Objects.wires[sOverConnector[2]._wireId].lines);
        } else {
            const wire = new Wire(cords);
            wire.addLines(lines);
            sOverConnector[2]._wireId = Objects.addWires(wire); 
            // console.log(sOverConnector[2]._wireId);
        }
        Renderer.layers['Trace'][0] = [{x:-10, y:-10}, {x: -20, y: -20}, {x: -30, y: -30}]
    }
    for (const id in Objects.gates) {
        if (Object.hasOwnProperty.call(Objects.gates, id)) {
            const gate = Objects.gates[id];
            for (let i = 0; i < gate._connector.length; i++) {
                if (hypotenuse(mouse[1].x - (gate.position.x + gate._connector[i].x), mouse[1].y - (gate.position.y + gate._connector[i].y)) <= 5) {
                    Objects.gates[id]._connector[i].wireId = sOverConnector[2]._wireId; // end gate id
                    if (sOverConnector[2]._gateId[0] != null) {
                        // console.log(Objects.gates[sOverConnector[2]._gateId]);
                        Objects.gates[sOverConnector[2]._gateId[0]]._connector[sOverConnector[2]._gateId[1]].wireId = sOverConnector[2]._wireId; // start gate id
                    }
                    // console.log('WIRE ID: ',sOverConnector[2]._wireId)
                    // needs wire id
                }
            }
            // console.log(sOverConnector[2])
            if (sOverConnector[2]._gateId[0] != null) {
                // console.log(Objects.gates[sOverConnector[2]._gateId]);
                Objects.gates[sOverConnector[2]._gateId[0]]._connector[sOverConnector[2]._gateId[1]].wireId = sOverConnector[2]._wireId; // start gate id
            }
            // console.log('\n\n'+Objects.gates[id].constructor.name);
            console.table(Objects.gates[id]._connector);
        }
    }
    sOverConnector[0] = false;
    sOverConnector[2] = {update: false, _gateId:[null], _wireId:null}
    cords = null;
    selectedItem = null;
    mouseDown = false;
    // console.log('up');
    Renderer.render();
});
window.addEventListener('keydown', (e) => {
    keyMap.set(e.key, e.type === "keydown");
});
window.addEventListener('keyup', (e) => {
    keyMap.set(e.key, !(e.type === "keyup"));
});
window.addEventListener('keypress', (e) => {
    // based on the key a gate is added to the static Objects() class
    // createGate function is located in the utils file
    createGate(e.key, mouse[0].x, mouse[0].y);
});


function mainLoop(delta) {

    if (mouseDown && selectedItem != null ) {
        if (Objects.gates[selectedItem].constructor.name == 'Input') {
            Objects.gates[selectedItem].position.x = 0;
            Objects.gates[selectedItem].position.y = mouse[0].y - Objects.gates[selectedItem].height / 2;
        } else if (Objects.gates[selectedItem].constructor.name == 'Output') {
            (round(canvas.width, gridCellWidth) - gridCellWidth*3)
            Objects.gates[selectedItem].position.x = (round(canvas.width, gridCellWidth) - gridCellWidth*3) + 1;
            Objects.gates[selectedItem].position.y = mouse[0].y - Objects.gates[selectedItem].height / 2;
        } else {
            Objects.gates[selectedItem].position.x = (mouse[0].x - Objects.gates[selectedItem].width / 2) - 5;
            Objects.gates[selectedItem].position.y = mouse[0].y - Objects.gates[selectedItem].height / 2;
        }
        Renderer.layers['Foreground'][0] = {x: Objects.gates[selectedItem].position.x, y: Objects.gates[selectedItem].position.y, width: Objects.gates[selectedItem].width, height: Objects.gates[selectedItem].height};
    }

    let delWire = null;
    Renderer.layers['Mouse'][0] = {x: -100, y: -100, r: 0};
    for (const id in Objects.wires) {
        if (Object.hasOwnProperty.call(Objects.wires, id)) {
            const wire = Objects.wires[id];
            for (let i = 0; i < wire.lines.length; i++) {
                if (wire.lines[i].mouseOver(mouse[0].x, mouse[0].y)) {
                    if (keyMap.get('Delete')) {
                        // Objects.wires[id].lines.splice(i, 1);
                        // if (wire.lines.length == 0) {
                            delWire = id;
                            delete Objects.wires[id];
                            const index = Renderer.layers['Wires'].indexOf(id);
                            if (index > -1) {
                                Renderer.layers['Wires'].splice(index, 1);
                            }
                        // }
                    }
                    Renderer.layers['Mouse'][0] = {x: (mouse[0].x), y: (mouse[0].y), r: 4};
                }
            }
        }
    }
    for (const id in Objects.gates) {
        if (Object.hasOwnProperty.call(Objects.gates, id)) {
            Objects.gates[id].updateState();
            const gate = Objects.gates[id];
            for (let i = 0; i < gate._connector.length; i++) {
                if (hypotenuse(mouse[1].x - (gate.position.x + gate._connector[i].x), mouse[1].y - (gate.position.y + gate._connector[i].y)) <= 5) {
                    Renderer.layers['Mouse'][0] = {x: (gate.position.x + gate._connector[i].x), y: (gate.position.y + gate._connector[i].y), r: 5};
                }
                if (gate._connector[i].wireId == delWire) {
                    Objects.gates[id]._connector[i].wireId = null;
                }
            }
        }
    }

    if (lSelItem != null) {
        if (keyMap.get('Delete')) {
            // console.log(true)
            delete Objects.gates[lSelItem];
            const index = Renderer.layers['Gates'].indexOf(lSelItem);
            if (index > -1) {
                Renderer.layers['Gates'].splice(index, 1);
            }                
            lSelItem = null;
            selectedItem = null;
            Renderer.layers['Foreground'][0] = {x: -200, y: -200, width: 0, height: 0};
        }
    }

    Renderer.render();
}

start();