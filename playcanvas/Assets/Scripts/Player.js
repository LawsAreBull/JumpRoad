var Player = pc.createScript('player');

Player.attributes.add('thresholdX', {type: 'number', default: 7});
Player.attributes.add('thresholdY', {type: 'number', default: 14});
Player.attributes.add('efx', {type: 'entity'});
Player.attributes.add('gameManager', {type: 'entity'});

Player.prototype.initialize = function() {
    this.forceX = 0;
    this.forceY = 0;
    this.setPower = false;
    this.didJump = false;

    this.entity.sprite.play('idle');

    const touch = this.app.touch;
    this.entity.collision.on('collisionstart', this.onCollisionStart.bind(this));
    this._gameManager = this.gameManager.script.gameManager;

    if(touch){
        touch.on(pc.EVENT_TOUCHSTART, this.onUserPressDown.bind(this));
        touch.on(pc.EVENT_TOUCHEND, this.onUserPressUp.bind(this));
    }else{
        this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onUserPressDown.bind(this));
        this.app.mouse.on(pc.EVENT_MOUSEUP, this.onUserPressUp.bind(this));
    }

    this.on('destroy', function(){
        if(touch){
            touch.off(pc.EVENT_TOUCHSTART, this.onUserPressDown.bind(this));
            touch.off(pc.EVENT_TOUCHEND, this.onUserPressUp.bind(this));
        }else{
            this.app.mouse.off(pc.EVENT_MOUSEDOWN, this.onUserPressDown.bind(this));
            this.app.mouse.off(pc.EVENT_MOUSEUP, this.onUserPressUp.bind(this));
        }
    }, this);
};

Player.prototype.update = function(dt) {
    this.onSetPower(dt);
};

Player.prototype.onSetPower = function(deltaTime) {
    if(this.setPower){
        this.forceX += this.thresholdX * deltaTime;
        this.forceY += this.thresholdY * deltaTime;

        if(this.forceX > this.thresholdX){
            this.forceX = this.thresholdX;
        }

        if(this.forceY > this.thresholdY){
            this.forceY = this.thresholdY;
        }

        let powerVal = this.forceX / this.thresholdX;
        this._gameManager.setPowerBarValue(powerVal);
    }
};

Player.prototype.onUserPressDown = function() {
    if(!this.didJump){
        this.setPower = true;
    }
};

Player.prototype.onUserPressUp = function() {
    if(!this.didJump){
        this.setPower = false;
        this.jump();
    } 
};

Player.prototype.onCollisionStart = function(result) {
    if(result.other.tags.has('ground')){
        this.entity.sprite.play('idle');
        this.efx.enabled = false;
        this.efx.enabled = true;
        this.didJump = false;
    }
};

Player.prototype.jump = function() {
    if(!this.entity.rigidbody){
        return;
    }

    this.didJump = true;

    this.entity.rigidbody.linearVelocity = new pc.Vec3(this.forceX, this.forceY, 0);

    this.forceX = 0;
    this.forceY = 0;

    this.entity.sprite.play('jump');
    this.entity.sound.play('jump');

    this._gameManager.setPowerBarValue(0);
};