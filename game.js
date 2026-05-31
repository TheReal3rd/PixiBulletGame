// PixiJS Emulator
// Use: app, PIXI

console.log("Game running");

texturesPath = { 
    "player" : "/assets/spaceShips/ship1.png",
    "bullet1" : "/assets/bullets/bullet1.png",
    "bullet2" : "/assets/bullets/bullet2.png",
    "bullet3" : "/assets/bullets/bullet3.png",
    "bullet4" : "/assets/bullets/bullet4.png",
    "bullet5" : "/assets/bullets/bullet5.png",
};
textureDict = {};

//Texture loading...
for(const [key, value] of Object.entries(texturesPath)) {
    let texture = PIXI.Assets.cache.get(value) || await PIXI.Assets.load(value);
    texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    textureDict[key] = texture
}

// Keyboard input
// Reused from Src: https://github.com/TheReal3rd/ResenforGame/blob/main/game.js
const keys = {
    arrowup: false,
    arrowdown: false,
    arrowleft: false,
    arrowright: false,
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
    shift: false,
    r: false,
    q: false,
};

window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (e.code === 'Space') keys.space = true;
    if (key in keys) keys[key] = true;
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (e.code === 'Space') keys.space = false;
    if (key in keys) keys[key] = false;
});

//Utility / Math functions.
// Src for these functions: https://github.com/TheReal3rd/PixelUtilsArcade/blob/master/custom.ts
const getRandInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const calcDistance = (posX, posY, posX1, posY1) => {
    const xDiff = posX - posX1;
    const yDiff = posY - posY1;
    return Math.hypot(xDiff, yDiff);
}

const calcAngle = (posX, posY, posX1, posY1) => {
    const xDiff = posX - posX1;
    const yDiff = posY - posY1;
    return toDegrees(Math.atan2(yDiff, xDiff));
}

const toRadians = (degrees) => {
    return (degrees * Math.PI) / 180;
}

const toDegrees = (radians) => {
    return radians * 57.29577951308232;
}

const calcAngularPosition = (posX, posY, angle, distance) => {
    const sin = Math.sin(toRadians(angle));
    const cos = Math.cos(toRadians(angle));
    return [posX + (distance * cos), posY + (distance * sin)];
}

const BULLET_SIZE = 9;

let bulletID = 0;
let enemyID = 0;
let projDict = {};
let enemyDict = {}

// Player Variables.

let pHealth = 3;
let pShootDelay = Date.now();
let pSpecialDelay = Date.now();
let pPowerLevel = 0;

let pInvincible = false;
let pDamageDelay = Date.now();

const playerObj = new PIXI.Sprite(textureDict["player"]);
playerObj.anchor.set(0.5);
playerObj.scale.set(-2, 2);
playerObj.tint = 0x0000ff;
playerObj.angle = 90;
playerObj.x = 25;
playerObj.y = app.screen.height / 2;
app.stage.addChild(playerObj);

function spawnEnemy(x, y, enemyType, strengthLevel) {
    
}

function shootSpiral(x, y, speed, angleOffset, amount, radius, bulletType, teamID) {
    for(let angle = 0; angle != 360; angle += 360 / amount) {
        const sin = Math.sin(toRadians(angle + angleOffset));
        const cos = Math.cos(toRadians(angle + angleOffset));
        
        const posX = x + (radius * cos);
        const posY = y + (radius * sin);
        const vx = cos * speed;
        const vy = sin * speed;
        shootProjectile(posX, posY, vx, vy, teamID, bulletType);
    }
}

/* Test code to remove.
for(let x = 0; x != 6; x++) {
    shootSpiral(app.screen.width / 2, app.screen.height / 2, 1, 4 * x, 6, 4 * x, 4, 0);
}
*/

function shootPattern(x, y, speed, angle, amount, attackType, bulletType, teamID) {
    switch(attackType) {
        case 0: // Spiral Wall shot
            for(let x1 = -(amount / 2); x1 != amount / 2; x1++) {
                const sin = Math.sin(toRadians(angle + (x1 * BULLET_SIZE)));
                const cos = Math.cos(toRadians(angle + (x1 * BULLET_SIZE)));
                const vx = cos * speed;
                const vy = sin * speed;
                const posX = x + ((x1 * BULLET_SIZE) * cos);
                const posY = y + ((x1 * BULLET_SIZE) * sin);
                shootProjectile(posX, posY, vx, vy, teamID, bulletType);
            }
            break;
        case 1: // Star wall shot. bascially an explosion of bullets. :3
            const sin = Math.sin(toRadians(angle));
            const cos = Math.cos(toRadians(angle));
            const vx = cos * speed;
            const vy = sin * speed;
            for(let x1 = -(amount / 2); x1 != amount / 2; x1++) {
                const posX = x + ((x1 * BULLET_SIZE) * cos);
                const posY = y + ((x1 * BULLET_SIZE) * sin);
                shootProjectile(posX, posY, vx, vy, teamID, bulletType);
            }
            break;
        case 2: // Wall shot
            for(let x1 = -(amount / 2); x1 != amount / 2; x1++) {
                const sin = Math.sin(toRadians(angle + (x1 * BULLET_SIZE)));
                const cos = Math.cos(toRadians(angle + (x1 * BULLET_SIZE)));
                const vx = cos * speed;
                const vy = sin * speed;
                const posX = x + (x1 * cos);
                const posY = y + (x1 * sin);
                shootProjectile(posX, posY, vx, vy, teamID, bulletType);
            }
            break;
    }
}

/* Cool spiral effect example. Code (Test code to remove.)
for(let angle = 0; angle != 360; angle += 360 / 4) {
    shootPattern(app.screen.width / 2, app.screen.height / 2, 2, angle, angle, 2, 1, 0);
}

for(let angle = 0; angle != 360; angle += 360 / 10) {
    shootPattern(app.screen.width / 2, app.screen.height / 2, 2, 0, angle, 2, 1, 0);
}

*/

function shootProjectile(x ,y, vx, vy, teamID, bulletType) {
    let textureName = "bullet1";
    let scale = -1.5;
    let projAngle = 0;
    const predX = (x + vx);
    const predY = (y + vy);
    const predAngle = calcAngle(x, y, predX, predY);
    switch (bulletType) {
        case 1: //Spinning style projectile... Deals 2 hearts of damage.
            textureName = "bullet2";
            break;
        case 2: //Health steal projectile... Steal health from target and give to sender.
            textureName = "bullet3";
            scale = -2;
            projAngle = predAngle + 90;
            break;
        case 3: //Flower projectile spins... Wavy movement.
            textureName = "bullet4";
            break;
        case 4: //Homing missles.
            textureName = "bullet5";
            projAngle = predAngle + 90;
            break;
    }
    let projTemp = new PIXI.Sprite(textureDict[textureName]);
    projTemp.anchor.set(0.5);
    projTemp.scale.set(scale, scale);
    projTemp.tint = 0xff0000;
    projTemp.angle = projAngle;

    projTemp.x = x;
    projTemp.y = y;
    app.stage.addChild(projTemp);
    projDict[bulletID] = [projTemp, vx, vy, teamID, bulletType];
    bulletID += 1;
}

function updateProjectiles(elapsed) {
    let removeList = []
    for(const [key, value] of Object.entries(projDict)) {
        let obj = value[0];
        let vx = value[1];
        let vy = value[2];
        let teamID = value[3];
        let bulletType = value[4];

        switch (bulletType) {
            case 1:
                obj.angle += 6.5;
                break;
            case 2:
                // TODO Add health stealing + shooter.
                break;
            case 3:
                obj.angle += 15;
                const tempElapsed = elapsed / 6
                obj.x += Math.cos(obj.y * (tempElapsed)) * (tempElapsed);
                obj.y += Math.sin(obj.x * (tempElapsed)) * (tempElapsed);
                obj.x += vx
                obj.y += vy
                break;
            case 4:
                // TODO Homing code here.
                break;
        }

        if(bulletType != 3) {
            obj.x += vx;
            obj.y += vy;
        }

        if(obj.x <= 0 || obj.x >= app.screen.width && obj.y <= 0 || obj.y >= app.screen.height) {
            removeList.push(key)
            app.stage.removeChild(obj)
        }
    }
    if(removeList.length != 0) {
        for(const key of removeList) {
            delete projDict[key];
        }
    }
}

function updatePlayer() {

    let playerSpeed = 3.4;
    if(keys.shift) {
        playerSpeed = 2.0;
    }

    if(keys.a || keys.arrowleft) {
        playerObj.x -= playerSpeed;
    } else if (keys.d || keys.arrowright) {
        playerObj.x += playerSpeed;
    }

    if(keys.w || keys.arrowup) {
        playerObj.y -= playerSpeed;
    } else if (keys.s || keys.arrowdown) {
        playerObj.y += playerSpeed;
    }

    if(Date.now() - pShootDelay > 240) {
        if(keys.space) {
            shootProjectile(playerObj.x, playerObj.y, 10, 0, 0, 3);
            pShootDelay = Date.now();
        }
    }

    if(Date.now() - pSpecialDelay > 1000) {
        if(keys.q) {
            shootProjectile(playerObj.x, playerObj.y, 10, 0, 0, 1);
            pSpecialDelay = Date.now();
        }
    }
}

let lastTime = Date.now();
app.ticker.add(() => {
    let currentTime = Date.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    updateProjectiles(deltaTime);
    updatePlayer();
});

