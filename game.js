// PixiJS Emulator
// Use: app, PIXI

console.log("Game running");

/*Mostly done to allow export to work.
However i found the true bug. Related to Async calls maybe reversed in the future.
*/
const ASSET_ATLAS = {
  "player": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABw0lEQVR4AVST23msMAyER3QDW04wqSV7HtaUs8CpKJtalH9s70P0SdZtJMvGTCEpIhSChrYdRNay5rqWxCT5l2O4U9rKVDrAAmM5iIKb5aANJNwt1PFoJmAF6PgI46U+1o/ca1WtD5V1TVcEjZqBBgQ8NMm7uwejWHEKY2UtOQLOGtN1KDUCYHuSkxJr692KffZad83LomW5aWeK1VM0lBoFSFfQAJ/WMIY5FEzjfcHAhkVzvWABorwVBEcA8g7K9OdIyZ5qokHZdF9poylJ5whyLHlUX9x8W5QO0N32vleVwmUaSwzGCvEVBNlFEqEoaOpx719fut//YbIFuUQA4zcWUU9g1WWclgQ+/Hr96PX9etfIfUOduk4mYEeNjMd/PKpu80LEELoIwrzxRWqtvI9+jJFR/wrsaQZKIStNt60owtckbdsnwRR91BdJ5ARxiZITvqDKRfnbp6QEkEpFIGj78zLzMncV/o/IlCjsL1EU4EUGazY5nk+dx6njeeg4Dt6GkACYNmgpbL2PIF3nGXV/qHxuKmVjbEvRhr9t3S5oT3meV1DeeGI7DHz4PP+zSkyv67riAujYiWY4Et5oYGQK/QIAAP//GYOIgAAAAAZJREFUAwBoKMMcinh7GAAAAABJRU5ErkJggg==",
  "bullet1": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAAXNSR0IArs4c6QAAAJtJREFUKFNNkNENwzAIRI/hAk47i5NZ4s6SyDjDUQFpZT4sEE/HnQlPCYsZ7JkIgGGM4Q3iYWHrXQPItcOEUgRDbyJmNu0Ko1wk5J0BliAxi2nvIXGeF1o7sG8b1vcLFFCZIUORFXWvaEdD1x6QzJCfu1zp07DXWSnOpaeMkIYsenuUBOTzwmwuPxt37J/ul1sW/yfnUsFLb42QXz38WSZ4295/AAAAAElFTkSuQmCC",
  "bullet2": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAAXNSR0IArs4c6QAAAJ9JREFUKFN1kMERwzAIBI/igjxBKcVKLXEtlsfg4siAFP9yD31YFgQRAJ8PwfFgdrOLAMcIIcp3mNlVFaUUXGZ0YykBsO/dt+2DAS1obUV91ZCDAooRoWutQZ6CfhyIhoiZERVmP1XT5yAcvUNE0h6CGD1MhYMYJhH0Pk0EmFoymXunU1GWBe+2QmrNelLjBECOTujP735GLuym806z+QuZ+Vbc9032NQAAAABJRU5ErkJggg==",
  "bullet3": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAABHNCSVQICAgIfAhkiAAAAIpJREFUGJVlkFEOgzAMQ18mrjb3NOthylVaJMrd8D4oDDR/RIqTOHFgIEaU5HgwNwQgJdt2kvwcHpBke/cJKfnWFCjpVrZrra61WulQnCS5r2sABtPacqnnTyaMX2C82wCtLZS5/E4eu6YzX1qjlJm+9cA453w3FSi9HYa198uMhsPt4P7/8bANfAEaAVV1jXWeBAAAAABJRU5ErkJggg==",
  "bullet4": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAoklEQVR4AUxPMRKDMAyTeR+Zmo4lPI3QMd5yfV8qC2jRXRzFyJaYDH+Iq5w9ccMEIuc84pACI6rheetJBE0AW62S1LoNkdDzSOTNLaWZTy4a8X1gTgnuzvGB6ZooZbXXski48F5LoSCedmQCERbvfScDdt71tOZu6O8idO8fZTYCDNl7R35kGf3sQFwWhVbyUsGxKQK6NzMKuSQqGkNHHzB8AQAA//9wt4xDAAAABklEQVQDAP7aQBiz0G1PAAAAAElFTkSuQmCC",
  "bullet5": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAe0lEQVR4AWRP2w3AIAg83NH0zzXKNi0z6H6Uh4m2vSCPg5NQCIblrPgaocCh6XxWbonKmXw6h7xrzCWirTWIxUkZSyghC4cNO/H6iUA+thySwFy3C/FHXrfzIVDMEJ28zlJm1mhY7uZ1rqNcF4RpR++oR0XvAw4+OXQPAAAA//9jB1rGAAAABklEQVQDACMKJqOFc58eAAAAAElFTkSuQmCC",
  "enemy1": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB30lEQVR4ATyTW3qrMAyER2zl0K/JfsJTIWcZYPLcmKyjZJ3qPyaNPt80Gl0sTCckmFJouFxSbwFtg+WNSZdhSKjyDBYChIx4zQi9JVIYGAntQCNsz4Zj8FBnSJDnUvLjX6+yLFk4Ax1euOOipSy5YDPH58OY6pI4Jnt+nk86Me3gObjcg0mY0Ol00uf5TD6nDTCpk8sKV5W6XidN1/9CbW4OYot1n22/TpOIIIuxjgKUPjUksFHTCwj2y0Bjw0ZCwXM+tgNg7YBbxmC93YrYZHEf+o9efd9rnpd0sIjQWlaSwIhjtiY6Yt0qHKNSrVX37zuT/V5V75zZW7X41W3jo9lLNDFAPIjuakq5sWFseJIt5apYVVYq1EvMB+QKLwDlQeTgc6Q9nA5SYvbkqIjQBkcEp1x5b00EF2ntQkNDrRdYaafYGMHdS7OjmHqcidwqoNmyRDhDdXzU1LquOK4EbaG01eoC1YIIgdkJJ3FA1bLMufDaHN7OkYEpqIi+QChLyZkZZEZtlXAFayE5EA7jOGocv8gqbXyZyp2TEice0Nc0HjQdgpfaZzS7zHPir/351M++y0zrTmPiDvbcf6zKb0SI7fwLkgnO5Ds+uKc77bOvIqQ+tvA7qfVvr3ZpwX4BAAD//zODemsAAAAGSURBVAMALPXjJdHevrsAAAAASUVORK5CYII=",
  "enemy2": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB3UlEQVR4AVxSwZGjMBDsUSreiwCIAvw6+2mnYREB3jBu/YR9GaIAZ+Bc5rolKLZWNcNIre7WIAgw/BqWID1jG33ftH26zozMAFJsBVTMXBCTGyQoUhJBnmAfjpAWclhzla2wI95aQfipNXGBZJkMnBRzomtyifPp7O/3G0rNxTY9JBSPVRF2Z0d2dpzOJ6+PNeq6QXNkNg1ONHQpeM5mxOn6CtxIpmxF4qY5oiorZsksUBQljerUldGFQcX2CmklL6RTjjytomBeFizK+cU6oyRWNzX+nk+eWzUW2zpwtLF1pz0fUIWDw3C5XgBDHukdjdzobbx5vEUPbYweW4pJsZW51cv1iq/HF3sVYmTkkHd3v9udGbpPTTq7d525Oy08s8h/PP7B0uVkKHfl+CRXiDrlj0SmNCzDMNg4TpiXOV1eWVQoqhJlVaR7mMYR3/1ApuQs1AX2x5UWTM5kMj0nCl6YX7zImbm8ME4T+u/eqMmNkKsI7FmVqS19YUc/9DY+Ryin6YlpfKLve/3l5DHSZbIyApPhu09uhCaDfXwccDj8oVht01xC7fOu1LmZ8TM6OLi5WaS1IF4Wb1l8ZRKoee7nNREaBS0kp4ShXSKMxOUJRJC8ibm+iDDOsY7/AAAA//96mfsFAAAABklEQVQDAC4O1Zj+irRFAAAAAElFTkSuQmCC",
  "enemy3": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB00lEQVR4ATSTy3HjMBBEe5CKtBGss/DeSJ6sjQVAJt4q7YnUyXZ849dDGcXBfLrnA0Bqeq4o7d2Cg1rXLbdtSwWOQ1YW24iwKcDOZ1/KU5GwLWsqEj+1rYsNpfc8yaXwW5EwXO0UO5bQHEMdUbGpBeFMxzYF1WSDaAKWnaKju5/zRCV7Co7yJIS5JAfSZIekwhzB96i9d4ZzINXnlFcYw8hwQlRKgyXikl3i20Z3vIjQ/X5H/p8w+MJdBJg8VRWRmgyTqJ+FPQcd0W9/33S73UA8xVDE2dXNnvlqZQSc50eeShyjE5+ytgrACgW7P+uWpkN4f/+XRhx0n0hcV0+oBAObkKyLK1hMxBFkUwZW3j4h4kgKjT405xAjSPgiYV14DXNo7CZNVDf48fllVUnyqrj0+udVEXQjNvsQw8rcxLc0KbSs3Dzz1eXJK2VQJIbCAR6LCJ3n6Pj8LvxaQFxiCp7GGDVp6OxWThaXYhiBDYajmgSbemICwc0666TI4MyjT2Cp0+33y4uCubsxpPOjsgQ1CYtXkI7HI/bjQPaS49jDhXyBY3YNCj2M73sc+xHG98dRo7agV1lUxGQc/guc73K56no95XL9pbp9n8JnMJc7s/sNAAD//zw5EYUAAAAGSURBVAMAyFXjwIHbI0MAAAAASUVORK5CYII="
};

async function loadTextureDictionary(atlas = ASSET_ATLAS) {
  const bundle = {};
  for (const [name, data] of Object.entries(atlas)) {
    bundle[name] = typeof data === 'string'
      ? data
      : `data:${data.mime};base64,${data.base64}`;
  }

  PIXI.Assets.addBundle('packed-textures', bundle);
  await PIXI.Assets.loadBundle('packed-textures');

  const textures = {};
  for (const name of Object.keys(bundle)) {
    textures[name] = PIXI.Assets.get(name);
  }
  return textures;
}

const textureDict = await loadTextureDictionary();

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

const PLAYER_TEAM = 0;
const ENEMY_TEAM = 1;

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

const clamp = (value, minValue, maxValue) => {
    return Math.max(minValue, Math.min(value, maxValue));
}

const axisDistance = (point, point2) => {
    return Math.abs(point - point2);
}

const calcDistance = (posX, posY, posX1, posY1) => {
    return Math.hypot(posX - posX1, posY - posY1);
}

const calcAngle = (posX, posY, posX1, posY1) => {
    return toDegrees(Math.atan2(posY - posY1, posX - posX1));
}

const toRadians = (degrees) => {
    return (degrees * Math.PI) / 180;
}

const toDegrees = (radians) => {
    return radians * (180.0 / Math.PI);
}

const calcAngularPosition = (posX, posY, angle, distance) => {
    return [posX + (distance * Math.cos(toRadians(angle))), posY + (distance * Math.sin(toRadians(angle)))];
}

const BULLET_SIZE = 9;
const MOVE_CHECK_ATTEMPTS = 5;

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
            health = 10 * (strengthLevel < 1 ? 2 : strengthLevel);
            spinDir = getRandInt(0, 1) == 1 ? -1 : 1; 
            maxShootDelay = 1200;
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
        "shootDelay" : Date.now(),
        "maxShootDelay" : maxShootDelay,
        "waypointX" : -1,
        "waypointY" : -1,
        "moveDelay" : Date.now(),
    }

    if (spinDir != NaN) {
        enemyDataDict["spinDir"] = spinDir;
    }
    
    enemyDict[enemyID] = enemyDataDict;
    enemyID += 1;
}

let yOffset = -120
for(let x = 0;x != 12;x++) {
    spawnEnemy(app.screen.width / 2, app.screen.height / 2 + yOffset, GRUNT_SPIN_ENEMY_ID, 0, rotation = -90);
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
        const wpX = value["waypointX"];
        const wpY = value["waypointY"];
        const moveDelay = value["moveDelay"];

        const MIN_DIST_TO_PLAYER = 45;
        const MIN_DIST_TO_POINT = 30;
        const MOVE_SPEED = 2;
        const MOVE_WAIT = 3500

        switch(type) {
            case GRUNT_SPIN_ENEMY_ID:
                const spinDir = value["spinDir"];
                obj.angle += 4 * spinDir;

                let newPoint = (wpX == -1 && wpY == -1) || Math.abs(calcDistance(obj.x, obj.y, wpX, wpY)) <= 1;
                if (newPoint) {
                    if(Date.now() - moveDelay >= MOVE_WAIT){
                        value["moveDelay"] = Date.now();
                        for(let attempts = MOVE_CHECK_ATTEMPTS; attempts != 0; attempts--) {
                            randX = getRandInt(0, app.screen.width);
                            randY = getRandInt(0, app.screen.height);

                            let distanceToPlayer = Math.abs(calcDistance(randX, randY, playerObj.x, playerObj.y))
                            if (distanceToPlayer <= MIN_DIST_TO_PLAYER) continue;

                            let distanceToPoint = Math.abs(calcDistance(randX, randY, obj.x, obj.y))
                            if (distanceToPoint <= MIN_DIST_TO_POINT) continue;

                            value["waypointX"] = randX;
                            value["waypointY"] = randY;
                        }
                    } 
            
                } else {

                    if(Date.now() - shootDelay >= maxShootDelay) {
                        value["shootDelay"] = Date.now();
                        shootSpiral(obj.x, obj.y, 2, obj.angle, 15, 15, SPORES_BULLET_ID, ENEMY_TEAM)
                    }

                    calcMoveDirection(obj, MOVE_SPEED, wpX, wpY);
                }

                break;
            case GRUNT_SHIP_ID:
                
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

function calcMoveDirection(obj, moveSpeed, wpX, wpY) {
    let velX = 0;
    let velY = 0;
    let xSpeed = clamp(axisDistance(obj.x, wpX), 0.0, moveSpeed);
    let ySpeed = clamp(axisDistance(obj.y, wpY), 0.0, moveSpeed);
    if(obj.x < wpX) {
        velX = xSpeed;
    } else if (obj.x > wpX) {
        velX = (xSpeed * -1);
    }
    
    if(obj.y < wpY) {
        velY = ySpeed;
    } else if (obj.y > wpY) {
        velY = (ySpeed * -1);
    }

    obj.x += velX;
    obj.y += velY;
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
        case STAR_PATTERN_ID: // Star wall shot. basically an explosion of bullets. :3
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
        if(teamID == PLAYER_TEAM) {
            for(const [eneKey, eneValue] of Object.entries(enemyDict)) {
                let projObj = eneValue["object"];
                let distance = calcDistance(obj.x, obj.y, projObj.x, projObj.y);

                if(distance <= 20) {
                    removeList.push(key);
                    app.stage.removeChild(obj);
                    eneValue["health"] = eneValue["health"] - 20;
                }
            }
        } else {

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
