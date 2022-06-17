function and(a, b) {
    return a & b;
}
function or(a, b) {
    return a | b;
}
function not(a) {
    return ~a;
}
function xor(a, b) {
    return a ^ b;
}

// utils
function round(num, place) {
    return Math.round(num / place)*place;
}
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
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
const keyMap = new Map();
const mouse = {x: 0, y: 0};
let gridCellWidth = inputWidth();
const grid = document.getElementById('grid');
const editor = document.getElementById('editor');
const canvas = document.getElementById('canvas');
const images = document.getElementsByTagName('img');
const ctx = canvas.getContext('2d');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

for (let i = 0; i < images.length; i++) {
    images[i].height = (gridCellWidth * 82.019) / 20;
}
// width="69.972" height="41.0095"

// for (let x = gridCellWidth*2; x < document.documentElement.clientWidth - gridCellWidth*2; x += gridCellWidth) {
//     editor.innerHTML += '<line x1="' + x + '" y1="40" x2="' + x + '" y2="' + (document.documentElement.clientHeight-gridCellWidth*2) + '"stroke-dasharray="0,'+ (gridCellWidth) +'" stroke-linecap="round" style="stroke: rgb(190, 190, 190); stroke-width: 2; opacity:0.4;" clip-path="url(#grid-clip)" />'
// }
for (let y = gridCellWidth*2; y < document.documentElement.clientHeight - gridCellWidth*2; y += gridCellWidth) {
    grid.innerHTML += '<line x1="40" y1="' + y + '" x2="'+ (document.documentElement.clientWidth-gridCellWidth*2) +'" y2="' + y +  '"stroke-dasharray="0,'+ (gridCellWidth) +'" stroke-linecap="round" style="stroke: rgb(190, 190, 190); stroke-width: 2; opacity:0.4;" clip-path="url(#grid-clip)" />'
}

let selectedItem = null;
let mouseDown = false;
let cords = [];
let dir = '';
let shiftControlCount = 1;
let shiftControlSameCord = null;

function remove(e, self) {
    if (keyMap.get('Alt')) {
        let d = self.getAttribute('d');
        d = d.replace('L' + round(e.x, gridCellWidth) + ' ' + round(e.y, gridCellWidth), '');
        self.setAttribute('d', d);
    }
}
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
    if (selectedItem != null) {
        selectedItem.style.left = round(e.x - images[0].width/2, gridCellWidth) + 'px';
        selectedItem.style.top = round(e.y - images[0].height/2, gridCellWidth) + 'px';
    }
});
editor.addEventListener('mousemove', (e) => {
    // console.log(e.movementX, e.movementY)
    if (mouseDown && ! keyMap.get('Alt') && (cords[cords.length-1].x != round(e.x, gridCellWidth) || cords[cords.length-1].y != round(e.y, gridCellWidth))) {
        if (keyMap.get('Control')) {
            if (shiftControlCount == 1) {
                if (Math.abs(e.movementX) > Math.abs(e.movementY)) {
                    dir = 'h';
                    shiftControlSameCord = round(e.y, gridCellWidth);
                }
                if (Math.abs(e.movementX) < Math.abs(e.movementY)) {
                    dir = 'v';
                    shiftControlSameCord = round(e.x, gridCellWidth);
                }
                shiftControlCount = 0;
            }
        } else if (! keyMap.get('Control')) {
            shiftControlCount = 1;
            dir = null;
        }
        if (dir == 'h') {
            cords.push({x:round(e.x, gridCellWidth), y:shiftControlSameCord});
            ctx.lineTo(round(e.x, gridCellWidth), shiftControlSameCord);
            ctx.stroke();
        } else if (dir == 'v') {
            cords.push({x:shiftControlSameCord, y:round(e.y, gridCellWidth)});
            ctx.lineTo(shiftControlSameCord, round(e.y, gridCellWidth));
            ctx.stroke();
        } else {
            cords.push({x:round(e.x, gridCellWidth), y:round(e.y, gridCellWidth)});
            ctx.lineTo(round(e.x, gridCellWidth), round(e.y, gridCellWidth));
            ctx.stroke();
        }
    }
});
editor.addEventListener('mousedown', (e) => {
    mouseDown = true;
    selectedItem = null;
    cords.push({x:round(e.x, gridCellWidth), y:round(e.y, gridCellWidth)});
    console.log('down')
    shiftControlCount = 1;
    dir = null;
    ctx.beginPath();
    ctx.moveTo(round(e.x, gridCellWidth), round(e.y, gridCellWidth));
});
window.addEventListener('mouseup', (e) => {
    if (cords.length != 0) {
        mouseDown = false;
        console.log('up')
        // cords = cords.reduce((unique, o) => {
        //     if(!unique.some(obj => obj.x === o.x && obj.y === o.y)) {
        //       unique.push(o);
        //     }
        //     return unique;
        // },[]);
        console.table(cords)
        let d = '';
        shiftControlCount = 1;
        d += 'M' + cords[0].x + ' ' + cords[0].y;
        for (let i = 1; i < cords.length; i++) {
            d += ' L' + cords[i].x + ' ' + cords[i].y;
        }
        let path = document.createElement('path');
        // path.setAttribute('fill', "none");
        // path.setAttribute('onclick', "remove(e, this);");
        // path.setAttribute('stroke-width', "10");
        // path.setAttribute('stroke-linejoin', "round");
        // path.setAttribute('stroke-linecap', "round");
        // path.setAttribute('stroke', "red");
        // path.setAttribute('d', d);
        editor.append(path);
        path.outerHTML = '<path fill="none" onmouseover="remove(event, this)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke="red" d="'+ d +'" />'
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cords = [];
    }
});
window.addEventListener('keydown', (e) => {
    keyMap.set(e.key, e.type === "keydown");
});
window.addEventListener('keyup', (e) => {
    keyMap.set(e.key, !(e.type === "keyup"));
});
window.addEventListener('keypress', (e) => {
    let src = '';
    switch (e.key) {
        case '1':
            src = 'assets/graphics/and-gate.svg';
            break;

        case '2':
            src = 'assets/graphics/or-gate.svg'
            break
        
        case '3':
            src = 'assets/graphics/not-gate.svg'
            break
        default:
            break;
    }
    if (src != '') {
        let img = document.createElement('img');
        img.src = src;
        img.setAttribute('draggable','true');
        img.setAttribute('onmousedown', 'selectedItem = this;');
        img.setAttribute('onmouseup', 'selectedItem = null');
        document.body.append(img);
        img.height = (gridCellWidth * 82.019) / 20;
        img.style.left = round(mouse.x - img.width/2, gridCellWidth) + 'px';
        img.style.top = round(mouse.y - img.height/2, gridCellWidth) + 'px';
    }
});