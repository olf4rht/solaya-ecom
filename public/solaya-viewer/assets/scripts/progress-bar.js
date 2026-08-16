var ProgressBar = pc.createScript('progressBar');

ProgressBar.attributes.add('progressImage', {type: 'entity'});

ProgressBar.prototype.initialize = function() {
    this.imageRect = this.progressImage.element.rect.clone();
    this.progressImageMaxWidth = this.progressImage.element.width
    
    // initialize progress to 0
    this.setProgress(0);
    this.increase = true;       
};

// Set progressvalue is between 0 and 1
ProgressBar.prototype.setProgress = function (value) {    
    value = pc.math.clamp(value, 0, 1);
    
    this.progress = value;
    var width = pc.math.lerp(0, this.progressImageMaxWidth, value);
    this.progressImage.element.width = width;
    this.imageRect.copy(this.progressImage.element.rect);
    this.imageRect.z = value;
    this.progressImage.element.rect = this.imageRect;
};


// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// ProgressBar.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/