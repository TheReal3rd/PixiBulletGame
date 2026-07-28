// PixiJS Emulator
// Use: app, PIXI

console.log("Game running");

texturesPath = { 
    "player" : "https://simple.rip/assets/spaceShips/ship1.png",
    "bullet1" : "https://simple.rip/assets/bullets/bullet1.png",
    "bullet2" : "https://simple.rip/assets/bullets/bullet2.png",
    "bullet3" : "https://simple.rip/assets/bullets/bullet3.png",
    "bullet4" : "https://simple.rip/assets/bullets/bullet4.png",
    "bullet5" : "https://simple.rip/assets/bullets/bullet5.png",
    "enemy1" : "https://simple.rip/assets/spaceShips/ship2.png",
    "enemy2" : "https://simple.rip/assets/spaceShips/ship3.png",
    "enemy3" : "https://simple.rip/assets/spaceShips/ship4.png",
};
textureDict = {};

//Texture loading...
for(const [key, value] of Object.entries(texturesPath)) {
    let texture = PIXI.Assets.cache.get(value) || await PIXI.Assets.load(value);
    texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    textureDict[key] = texture
}
delete texturesPath

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

//Consts ID's
const NORMAL_BULLET_ID = 0;
const SPIN_STAR_BULLET_ID = 1;
const HEART_SHAPED_BULLET_ID = 2;
const SPORES_BULLET_ID = 3;
const HOMING_BULLET_ID = 4;

const SPIRAL_PATTERN_ID = 0;
const STAR_PATTERN_ID = 1;
const WALL_PATTERN_ID = 2;

const GRUNT_SHIP_ID = 0;
const GRUNT_SPIN_ENEMY_ID = 1;
const GRUNT_HEAVY_SHIP_ENEMY_ID = 2;

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
const PLAYER_TEAM = 0;

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

function spawnEnemy(x, y, enemyType, strengthLevel, rotation=0) {
    let textureName = "enemy1";
    let health = 0;
    let maxShootDelay = 0;
    let spinDir = NaN;
    switch(enemyType) {
        case GRUNT_SPIN_ENEMY_ID:
            textureName = "enemy2";
            spinDir = getRandInt(0, 1) == 1 ? -1 : 1; 
            break;

        case GRUNT_HEAVY_SHIP_ENEMY_ID:
            textureName = "enemy3";
            health = 40 * (strengthLevel < 1 ? 2 : strengthLevel);
            maxShootDelay = 250;
            break;
        default:
            health = 20 * (strengthLevel < 1 ? 2 : strengthLevel);
            maxShootDelay = 400;
            break;
    }

    const enemyObj = new PIXI.Sprite(textureDict[textureName]);
    enemyObj.anchor.set(0.5);
    enemyObj.scale.set(-2, 2);
    enemyObj.tint = 0xff0000;
    enemyObj.angle = rotation;
    enemyObj.x = x;
    enemyObj.y = y;
    app.stage.addChild(enemyObj);

    enemyDataDict = {
        "object" : enemyObj, 
        "type" : enemyType, 
        "strength" : strengthLevel, 
        "health" : health,
        "shootDelay" : 0,
        "maxShootDelay" : maxShootDelay,
    }

    if (spinDir != NaN) {
        enemyDataDict["spinDir"] = spinDir;
    }
    
    enemyDict[enemyID] = enemyDataDict;
    enemyID += 1;
}

let yOffset = 0
for(let x = 0;x != 5;x++) {
    spawnEnemy(app.screen.width / 2, app.screen.height / 2 + yOffset, 2, 0, rotation = -90);
    yOffset += 30
}

function enemyUpdate() {
    let removeList = []
    for(const [key, value] of Object.entries(enemyDict)) {
        const obj = value["object"];
        const type = value["type"];
        const strength = value["strength"];
        const health = value["health"];
        const shootDelay = value["shootDelay"];
        const maxShootDelay = value["maxShootDelay"];


        switch(type) {
            case GRUNT_SPIN_ENEMY_ID:
                const spinDir = value["spinDir"];
                obj.angle += 4 * spinDir;
                break;
        }

        if (health <= 0) {
            removeList.push(key);
            app.stage.removeChild(obj);
        }
    }
    if(removeList.length != 0) {
        for(const key of removeList) {
            delete enemyDict[key];
        }
    }
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
        case SPIRAL_PATTERN_ID: // Spiral Wall shot
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
        case STAR_PATTERN_ID: // Star wall shot. bascially an explosion of bullets. :3
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
        case WALL_PATTERN_ID: // Wall shot
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
    let spinDir = NaN;
    const predX = (x + vx);
    const predY = (y + vy);
    const predAngle = calcAngle(x, y, predX, predY);
    switch (bulletType) {
        case SPIN_STAR_BULLET_ID: //Spinning style projectile... Deals 2 hearts of damage.
            textureName = "bullet2";
            spinDir = getRandInt(0, 1) == 1 ? -1 : 1;
            break;
        case HEART_SHAPED_BULLET_ID: //Health steal projectile... Steal health from target and give to sender.
            textureName = "bullet3";
            scale = -2;
            projAngle = predAngle + 90;
            break;
        case SPORES_BULLET_ID: //Flower projectile spins... Wavy movement.
            textureName = "bullet4";
            spinDir = getRandInt(0, 1) == 1 ? -1 : 1;
            break;
        case HOMING_BULLET_ID: //Homing missles.
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

    projDataDict = { 
        "object" : projTemp, 
        "velx" : vx, 
        "vely" :  vy, 
        "team" : teamID, 
        "type" : bulletType
    };
    if (spinDir != NaN) {
        projDataDict["spinDir"] = spinDir;
    }

    projDict[bulletID] = projDataDict;
    bulletID += 1;
}

function updateProjectiles(elapsed) {
    let removeList = []
    for(const [key, value] of Object.entries(projDict)) {
        let obj = value["object"];
        let vx = value["velx"];
        let vy = value["vely"];
        let teamID = value["team"];
        let bulletType = value["type"];

        let homingTarget = NaN;

        for(const [eneKey, eneValue] of Object.entries(enemyDict)) {
            let projObj = eneValue["object"];
            let distance = calcDistance(obj.x, obj.y, projObj.x, projObj.y);

            if(distance <= 20) {
                removeList.push(key);
                app.stage.removeChild(obj);
                eneValue["health"] = eneValue["health"] - 20;
            }
        }

        switch (bulletType) {
            case SPIN_STAR_BULLET_ID:
                obj.angle += 6.5 * value["spinDir"];
                break;
            case HEART_SHAPED_BULLET_ID:
                // TODO Add health stealing + shooter.
                break;
            case SPORES_BULLET_ID:
                obj.angle += 15 * value["spinDir"];
                const tempElapsed = elapsed / 6
                obj.x += Math.cos(obj.y * (tempElapsed)) * (tempElapsed);
                obj.y += Math.sin(obj.x * (tempElapsed)) * (tempElapsed);
                obj.x += vx
                obj.y += vy
                break;
            case HOMING_BULLET_ID:
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
            const bulletType = NORMAL_BULLET_ID;
            shootProjectile(playerObj.x, playerObj.y, 10, 0, PLAYER_TEAM, bulletType);
            pShootDelay = Date.now();
        }
    }

    if(Date.now() - pSpecialDelay > 1000) {
        if(keys.q) {
            const bulletType = HOMING_BULLET_ID;
            const attackType = 2;
            const amount = 4;
            const angle = 0;
            const speed = 4;
            shootPattern(playerObj.x, playerObj.y, speed, angle, amount, attackType, bulletType, PLAYER_TEAM);
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
    enemyUpdate();
});
