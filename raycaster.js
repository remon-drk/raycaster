const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// #region settings
const RENDER_DELAY = 30;

const WIDTH = 640;
const HEIGHT = 480;
const MAP_WIDTH = 10;
const MAP_HEIGHT = 10;
const BLUEST_DIST = 50;
const STEP_DIST = 0.1;

const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let fov = 90;
let playerMovSpeed = 0.125; // !
let playerRotSpeed = 15;
// #endregion

// #region vars
const playerPos = {
    x: MAP_WIDTH / 2,
    y: MAP_HEIGHT / 2
};

let playerAngle = 90;
// #endregion

window.addEventListener('load', () => {
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
});

function MovePlayer(dir) {
    const rad = degToRad(playerAngle);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const newX = playerPos.x + cos * playerMovSpeed * dir;
    const newY = playerPos.y + sin * playerMovSpeed * dir;

    console.log(Math.floor(newX), Math.floor(newY));
    if (map[Math.floor(newY)][Math.floor(newX)] == 0) {
        playerPos.x = newX;
        playerPos.y = newY;
    }
}

document.addEventListener('keydown', (e) => {
    const keyCode = e.code;

    if (keyCode == 'KeyW') {
        MovePlayer(1);
    }
    else if (keyCode == 'KeyS') {
        MovePlayer(-1);
    }
    else if (keyCode == 'KeyA') {
        playerAngle -= playerRotSpeed;
    }
    else if (keyCode == 'KeyD') {
        playerAngle += playerRotSpeed;
    }
});

function degToRad(angle) {
    return Math.PI / 180 * angle;
}

function drawCol(x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function rayCast() {
    let rayAngle = playerAngle - (fov / 2);

    for (let x = 0; x < WIDTH; x++) {
        const rad = degToRad(rayAngle);
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        let dist = 0;
        let curBlock = 0;

        while (curBlock == 0) {
            dist += STEP_DIST;
            curBlock = map[Math.floor(playerPos.y + dist * sin)]
                          [Math.floor(playerPos.x + dist * cos)];
        }

        const wallHeight = Math.floor(HEIGHT / 2 / dist);

        drawCol(x, 0, x, HEIGHT / 2 - wallHeight / 2, '#87CEEB');
        drawCol(x, HEIGHT / 2 + wallHeight / 2, x, HEIGHT, '#00F400');
        drawCol(x, HEIGHT / 2 - wallHeight / 2, x, HEIGHT / 2 + wallHeight / 2,
                     `rgb(0, 128, ${Math.min(255, dist / BLUEST_DIST * 255)})`);

        rayAngle += fov / WIDTH;
    }
}

function main() {
    setInterval(() => {
        rayCast();
    }, RENDER_DELAY);
}

main();