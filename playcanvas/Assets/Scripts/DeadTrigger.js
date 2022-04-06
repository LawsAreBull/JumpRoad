var DeadTrigger = pc.createScript('deadTrigger');

DeadTrigger.attributes.add('gameManager', {type: 'entity'});

DeadTrigger.prototype.initialize = function() {
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);

    this._gameManager = this.gameManager.script.gameManager;

    this.isHitted = false;
};

DeadTrigger.prototype.update = function(dt) {
    
};

DeadTrigger.prototype.onTriggerEnter = function(entity) {
    if(entity.tags.has('player')){
        if(!this.isHitted){
            this.isHitted = true;

            this._gameManager.gameOver();
        }
    }
};
