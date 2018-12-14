/*
    This is simply an array designed to keep a bunch of spawn data, to be activated and create enemies when needed.
*/
function EnemySet(){
    this.setArray = [];
}

EnemySet.prototype.add = function(toAdd){
    this.setArray.push(toAdd);
}