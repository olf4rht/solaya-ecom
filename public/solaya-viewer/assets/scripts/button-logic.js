var ButtonLogic = pc.createScript('buttonLogic');

ButtonLogic.prototype.initialize = function () {

    this.item = this.app.root.findByName('GaussianSplatting');
    //should be initially disabled
    if (this.item) {
        this.item.enabled = false;
    } else {
        console.error("GaussianSplatting entity not found!");
    }

    this.element = this.entity.element;
    if (!this.element) {
        console.error("Button entity does not have an element component!");
        return;
    }

    this.originalTexture = this.element.texture;

    this.entity.button.on('hoverstart', () => {
        document.body.style.cursor = 'pointer';
        this.entity.script.fontAwesomeLoader.setColor("#3498FF");
    });

    this.entity.button.on('hoverend', () => {
        document.body.style.cursor = 'default';
        this.entity.script.fontAwesomeLoader.setColor("#ffffff");

    });

    this._buttonActivated = false;

    const activate = () => {
        if (this._buttonActivated) return;
        this._buttonActivated = true;

        if (this.item) {
            this.entity.script.fontAwesomeLoader.hide();
            this.item.enabled = true;
            let filesize = this.app.root.findByName("GetFileSize");
            filesize.enabled = false;
            this.entity.enabled = false;
            document.body.style.cursor = 'default';
        }
    };

    this.app.on("custom:buttonClick", activate, this);

};

