class Renderer {
    // stores things to be rendered in the drawing order
    static layers = {};
    static createLayer(name) {
        Renderer.layers[name] = [];
        // console.log(Renderer.layers);
    }
    static addTo(name, data) {
        try {
            Renderer.layers[name].push(data);
        } catch (error) {
            console.error("Error: can't find layer '" + name + "' \n Make sure that the layer '" + name + "' exists");
        }
        // console.log(Renderer.layers);
    }
    static render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(background, 0, 0);
        for (const key in Renderer.layers) {
            if (Object.hasOwnProperty.call(Renderer.layers, key)) {
                const layer = Renderer.layers[key];
                ctx.beginPath();
                switch (key) {
                    case 'Wires':
                        for (let i = 0; i < layer.length; i++) {
                            Objects.wires[layer[i]].draw();
                        }
                        break;
                    case 'Gates':
                        for (let i = 0; i < layer.length; i++) {
                            Objects.gates[layer[i]].draw();
                        }
                        break;
                    case 'Foreground':
                        ctx.strokeStyle = 'gray';
                        ctx.lineWidth = '1';
                        for (let i = 0; i < layer.length; i++) {
                            ctx.strokeRect(layer[i].x, layer[i].y, layer[i].width, layer[i].height);
                        }
                        break;
                    case 'Mouse':
                        ctx.arc(layer[0].x, layer[0].y, layer[0].r, 0, Math.PI * 2);
                        ctx.strokeStyle = 'green';
                        ctx.stroke();
                        break;
                    case 'Trace':
                        ctx.beginPath()
                        ctx.moveTo(layer[0][0].x, layer[0][0].y);
                        for (let i = 1; i < layer[0].length; i++) {
                            ctx.lineTo(layer[0][i].x, layer[0][i].y);
                        }
                        ctx.lineWidth = '2';
                        ctx.strokeStyle = 'gray';
                        ctx.lineCap = 'round';
                        ctx.stroke();
                    default:
                        break;
                }
            }
        }
    }
}

class Objects {
    // stores all gate objects
    static gates = {};
    // stores all wire objects
    static wires = {};
    // stores all ids of gates and wires
    // have the position of the gate or wires as the key
    static addGates(data) {
        // generate unique id
        let id = '';
        do {
            id = random_text(8).toUpperCase();
        } while (includes_key(Objects.gates, id));

        Objects.gates[id] = data;
        Objects.gates[id].id = id;
        // add the gates id to the Renderer class
        // which renders the gates in their layer
        Renderer.addTo('Gates', id);
        return id;
    }
    static addWires(data) {
        // generate unique id
        let id = '';
        do {
            id = random_text(8).toUpperCase();
        } while (includes_key(Objects.wires, id));
        Objects.wires[id] = data;
        Objects.wires[id].id = id;
        // add the Wires id to the Renderer class
        // which renders the Wires in their layer
        Renderer.addTo('Wires', id);
        return id;
    }
}