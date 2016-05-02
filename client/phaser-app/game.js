var gameState = {

  preload: function() {
    game.load.image('nebula', 'phaser-app/assets/Nebula.png');
    game.load.image('ship', 'phaser-app/assets/spaceship.png');
    game.load.image('red', 'phaser-app/assets/red.png');
  },

  create: function() {
    dropZone = game.add.sprite(0, 50, 'nebula');
    dropZone.height = 450;
    dropZone.width = 840;

    player1 = game.add.sprite(0, 500, 'red');
    player1.height = 50;
    player1.width = 210;
    //assign id zone to self

    player2 = game.add.sprite(0, 0, 'red');
    player2.height = 50;
    player2.width = 210;
    //assign to next

    player3 = game.add.sprite(280, 0, 'red');
    player3.height = 50;
    player3.width = 210;
    //assign to next

    player4 = game.add.sprite(560, 0, 'red');
    player4.height = 50;
    player4.width = 210;
    //assign to next
    var tileData = {
      x:4,
      y:6,
      name:'ship'
    };
    CreateTile(tileData);
    //build board sprites, start and planet sprites 

  }
};

function CreateTile(tileData){
  var tile = game.add.sprite(tileData.x*70, tileData.y*50, tileData.name);
  tile.height = 45;
  tile.width = 65;
  
  tile.inputEnabled = true;
  tile.input.enableDrag();
  tile.input.enableSnap(70, 50, false, true);
 
  tile.events.onInputOver.add(onOver, this);
  tile.events.onInputOut.add(onOut, this);
  tile.events.onDragStart.add(onDragStart, this);
  tile.events.onDragStop.add(onDragStop, this);

  return tile;
}
function onOver(sprite, pointer) {
   sprite.tint = 0xff7777;
}

function onOut(sprite, pointer) {
  sprite.tint = 0xffffff;
}

function  onDragStart(sprite, pointer) {
  dragPosition.set(sprite.x, sprite.y);
}

function  onDragStop(sprite, pointer) {
  if (sprite.overlap(dropZone) || sprite.overlap(player1) || sprite.overlap(player2)|| sprite.overlap(player3)|| sprite.overlap(player4)){
    x = sprite.position.x/70;
    y = sprite.position.y/50;
    console.log(x,y);
    //emit sprite type and coordinates through socket
    //window.socket.emit('drop', {token: window.storage.getItem('com.spacepirates'), x:x, y:y, type: sprite.type });
  }else{
    game.add.tween(sprite).to( { x: dragPosition.x, y: dragPosition.y }, 500, "Back.easeOut", true);
  }

}
