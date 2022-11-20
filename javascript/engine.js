const fps = 1000/30;
let then = 0;
let elapsed = 0;
let animation = null;
function engineLoop(now) {
    elapsed = now - then;
    let delta = elapsed;
    if (elapsed >= fps) {
        then = now;
        mainLoop(delta);
    }
    animation = requestAnimationFrame(engineLoop);
}

function start() {
    animation = requestAnimationFrame(engineLoop);
}

function stop() {
    setTimeout(() => {cancelAnimationFrame(animation);},
    0)
}