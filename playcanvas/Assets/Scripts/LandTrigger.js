var LandTrigger = pc.createScript('landTrigger');

LandTrigger.attributes.add('gameManager', {type: 'entity'});
LandTrigger.attributes.add('coin', {type: 'entity'});

LandTrigger.prototype.initialize = function() {
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
    this.isHitted = false;

    this._gameManager = this.gameManager.script.gameManager;
};

LandTrigger.prototype.update = function(dt) {

};

LandTrigger.prototype.onTriggerEnter = function(entity) {
    if(entity.tags.has('player')){
        if(!this.isHitted){
            this.isHitted = true;
            this.coin.enabled = false;
            this.entity.sound.play('collect');
            this._gameManager.createPlatformAndMoveCamera(this.entity.getPosition().x);
        }
    }
};
