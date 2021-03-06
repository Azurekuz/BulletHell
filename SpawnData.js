/*
    This object is used to spawn a monster whenever the game is moving to the next encounter.
*/
function SpawnData(spriteID, health, movePattern, bulletPattern, bulletType, fireRate, initXLoc, initYLoc, xVel, yVel){
    this.spriteID = spriteID;
    this.health = health;
    this.movePattern = movePattern;
    this.bulletPattern = bulletPattern;
    this.bulletType = bulletType;
    this.fireRate = fireRate;
    this.initXLoc = initXLoc;
    this.initYLoc = initYLoc;
    this.xVel = xVel;
    this.yVel = yVel;
}