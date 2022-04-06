var GameManager = pc.createScript('gameManager');

GameManager.attributes.add('player', {type: 'entity'});
GameManager.attributes.add('platform', {type: 'entity'});
GameManager.attributes.add('cameraContainer', {type: 'entity'});
GameManager.attributes.add('deadTrigger', {type: 'entity'});

GameManager.attributes.add('minX', {type: 'number'});
GameManager.attributes.add('maxX', {type: 'number'});
GameManager.attributes.add('minY', {type: 'number'});
GameManager.attributes.add('maxY', {type: 'number'});

GameManager.attributes.add('cameraPanSpeed', {type: 'number'});

GameManager.attributes.add('playerScore', {type: 'entity'});

GameManager.attributes.add('gameOverMenu', {type: 'entity'});
GameManager.attributes.add('gameOverScore', {type: 'entity'});
GameManager.attributes.add('tryAgain', {type: 'entity'});

GameManager.attributes.add('powerBar', {type: 'entity'});

GameManager.prototype.initialize = function() {
    this.currentPlayer = null;
    this.platformList = [];
    this.currentScore = 0;
    this.canMoveCamera = false;
    this.lerpX = 0;

    this.startGame();

    this.tryAgain.button.on('click', function() {
        this.startGame();
    }, this);
};

GameManager.prototype.update = function(dt) {
    if(this.canMoveCamera){        
        this.learpCamera(dt);
    }
};

GameManager.prototype.learpCamera = function(dt) {
    const camPos = this.cameraContainer.getPosition();

    let x = camPos.x;

    x = pc.math.lerp(x, this.lerpX, this.cameraPanSpeed * dt);

    const newPos = new pc.Vec3(x, camPos.y, 0);

    this.cameraContainer.setPosition(newPos);

    if(newPos.x > this.lerpX - 0.07){
        this.canMoveCamera = false;
    }
};

GameManager.prototype.createInitialPlatformAndPlayer = function() {
    const x = pc.math.random(this.minX, this.minX + 1);
    const y = pc.math.random(this.minY, this.maxY);
    let temp = new pc.Vec3(x, y, 0);

    const initialPlayerPlatform = this.platform.clone();
    this.app.root.addChild(initialPlayerPlatform);
    initialPlayerPlatform.setPosition(temp);
    initialPlayerPlatform.enabled = true;
    this.platformList.push(initialPlayerPlatform);

    initialPlayerPlatform.children[3].script.landTrigger.isHitted = true;
    initialPlayerPlatform.children[4].enabled = false;

    temp.y +=1.8;
    this.currentPlayer = this.player.clone();
    this.app.root.addChild(this.currentPlayer);
    this.currentPlayer.setPosition(temp);
    this.currentPlayer.enabled = true;

    const x2 = pc.math.random(this.maxX, this.maxX - 1.2);
    const y2 = pc.math.random(this.minY, this.maxY);
    let temp2 = new pc.Vec3(x2, y2, 0);

    const newPlatform = this.platform.clone();
    this.app.root.addChild(newPlatform);
    newPlatform.setPosition(temp2);
    newPlatform.enabled = true;
    this.platformList.push(newPlatform);

    this.currentScore = 0;
    this.playerScore.element.text = "" + this.currentScore;
    this.powerBar.element.width = 0;
};


GameManager.prototype.createPlatformAndMoveCamera = function(lastPlatformXPos) {
    this.createNewPlatform();
    this.lerpX = lastPlatformXPos + this.maxX;
    this.canMoveCamera = true;
};

GameManager.prototype.createNewPlatform = function(dt) {
    let camX = this.cameraContainer.getPosition().x;
    let newMax = (this.maxX * 2) + camX;

    const x = pc.math.random(newMax, newMax - 1.2);
    const y = pc.math.random(this.minY, this.maxY);
    let temp = new pc.Vec3(x, y, 0);

    const newPlatform = this.platform.clone();
    this.app.root.addChild(newPlatform);
    newPlatform.setPosition(temp);
    newPlatform.enabled = true;
    this.platformList.push(newPlatform);

    if(this.platformList.length > 5){
        this.platformList[0].destroy();
        this.platformList.slice(0, 1);
    }

    this.currentScore++;
    this.playerScore.element.text = "" + this.currentScore;
};

GameManager.prototype.gameOver = function() {
    this.entity.sound.play('dead');
    this.gameOverMenu.enabled = true;
    this.gameOverScore.element.text = "" + this.currentScore;

    this.resetGame();
};

GameManager.prototype.resetGame = function() {
    for(let i = 0; i < this.platformList.length; i++){
        this.platformList[i].destroy();
    }

    this.cameraContainer.setPosition(0, 0, 0);
    this.platformList = [];
    this.currentPlayer.destroy();
    this.canMoveCamera = false;
    this.lerpX = 0;

    this.deadTrigger.script.deadTrigger.isHitted = false;
};

GameManager.prototype.startGame = function() {
    this.createInitialPlatformAndPlayer();
    
    this.gameOverMenu.enabled = false;
};

GameManager.prototype.setPowerBarValue = function(value) {
    this.powerBar.element.width = value * 340;
};

