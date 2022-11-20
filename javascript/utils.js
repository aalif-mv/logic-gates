function random_text(length) {
    var result = '';
    var characters = 'ABCDEGHJKMNOPQRSTUVWXYZabcdefghijkmnopqrstvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function includes_key(obj, key){
    for(let k in obj){
       if (k == key) {
        return true;
       }
    }
    return false;
}

function generate_background(id) {
    for (let y = 0; y < round(canvas.height, gridCellWidth)+ gridCellWidth; y += gridCellWidth) {
        grid.innerHTML += '<line x1="'+ (gridCellWidth * 3) +'" y1="' + y + '" x2="'+ (round(canvas.width, gridCellWidth) - gridCellWidth*2) +'" y2="' + y +  '"stroke-dasharray="0,'+ (gridCellWidth) +'" stroke-linecap="round" style="stroke: rgb(0, 0, 0); stroke-width: 1; opacity:0.8;" clip-path="url(#grid-clip)" />'
    }
    grid.innerHTML += '<line x1="'+ (gridCellWidth * 2) +'" y1="0" x2="'+ (gridCellWidth*2) +'" y2="' + (round(canvas.height, gridCellWidth) +gridCellWidth) +  '" stroke-linecap="round" style="stroke: rgb(0, 0, 0); stroke-width: 2; opacity:0.5;" clip-path="url(#grid-clip)" />'
    grid.innerHTML += '<line x1="'+ (round(canvas.width, gridCellWidth) - gridCellWidth*2) +'" y1="0" x2="'+ (round(canvas.width, gridCellWidth) - gridCellWidth*2) +'" y2="' + (round(canvas.height, gridCellWidth) +gridCellWidth) +  '" stroke-linecap="round" style="stroke: rgb(0, 0, 0); stroke-width: 2; opacity:0.5;" clip-path="url(#grid-clip)" />'
    let svgElement = document.getElementById(id);
    let svgURL = new XMLSerializer().serializeToString(svgElement);
    const image = new Image();
    image.src = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(svgURL);
    return image;
}

function round(num, place) {
    return Math.round(num / place)*place;
}

function hypotenuse(op, aj) {
    return Math.sqrt(Math.pow((op), 2) + Math.pow((aj), 2));
}

function crossMultiply(h, ph, oa) {
    return (oa * h) / ph;
}

function random(min, max) {
    return Math.floor((Math.random() * (max - min))+ min);
}

function createGate(key, x = null, y = null) {
    // based on the key a gate is added to the static Objects() class
    switch (key) {
        case '1':
            Objects.addGates(new And('assets/graphics/and-gate.svg', gridCellWidth, x, y));
            break;
        case '2':
            Objects.addGates(new Nand('assets/graphics/nand-gate.svg', gridCellWidth, x, y));
            break
        case '3':
            Objects.addGates(new Not('assets/graphics/not-gate.svg', gridCellWidth, x, y));
            break
        case '4':
            Objects.addGates(new Buffer('assets/graphics/buffer-gate.svg', gridCellWidth, x, y));
            break;
        case '5':
            Objects.addGates(new Or('assets/graphics/or-gate.svg', gridCellWidth, x, y));
            break
        case '6':
            Objects.addGates(new Nor('assets/graphics/nor-gate.svg', gridCellWidth, x, y));
            break
        case '7':
            Objects.addGates(new Xor('assets/graphics/xor-gate.svg', gridCellWidth, x, y));
            break
        case '8':
            Objects.addGates(new Xnor('assets/graphics/xnor-gate.svg', gridCellWidth, x, y));
            break
        case '9':
            Objects.addGates(new Input('assets/graphics/input0.svg', gridCellWidth, 0, y));
            break
        case '0':
            Objects.addGates(new Output('assets/graphics/output0.svg', gridCellWidth, ((round(canvas.width, gridCellWidth) - gridCellWidth*3)+1), y));
            break
        default:
            break;
    }
    Renderer.render()
}