function select(gx, gy) {
    let x = gx;
    let y = gy;
    for (const key in Objects.gates) {
        if (Object.hasOwnProperty.call(Objects.gates, key)) {
            let ox = Objects.gates[key].position.x;
            let oy = Objects.gates[key].position.y;
            let width = Objects.gates[key].width;
            let height = Objects.gates[key].height;
            if (x >= ox && x <= ox + width && y >= oy && y <= oy + height) {
                // console.log('found')
                Renderer.layers['Foreground'][0] = {x: ox, y: oy, width: width, height: height};
                return key;
            }
        }
    }
    return null;
}