var FontAwesomeLoader = pc.createScript('fontAwesomeLoader');

// Attributes
FontAwesomeLoader.attributes.add("fontCode", {
    type: "string",
    default: "fa-solid fa-user",
    title: "Font Awesome Class"
});

FontAwesomeLoader.attributes.add("fontSize", {
    type: "number",
    default: 36,
    title: "Font Size (px)"
});

FontAwesomeLoader.attributes.add("fontColor", {
    type: "string",
    default: "#ffffff",
    title: "Font Color"
});

FontAwesomeLoader.attributes.add("top", {
    type: "string",
    default: "50%",
    title: "Top Position (e.g. 50%, 10px)"
});

FontAwesomeLoader.attributes.add("left", {
    type: "string",
    default: "50%",
    title: "Left Position (e.g. 50%, 10px)"
});

FontAwesomeLoader.attributes.add("zIndex", {
    type: "number",
    default: 10,
    title: "Z-Index"
});

FontAwesomeLoader.prototype.initialize = function () {
    //load Font Awesome stylesheet only once
    if (!document.getElementById('fontawesome-style')) {
        var link = document.createElement('link');
        link.id = 'fontawesome-style';
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
        document.head.appendChild(link);
    }

    //create icon element
    this.icon = document.createElement('i');
    this.icon.className = this.fontCode;
    this.icon.style.position = 'absolute';
    this.icon.style.top = this.top;
    this.icon.style.left = this.left;
    this.icon.style.transform = 'translate(-50%, -50%)';
    this.icon.style.fontSize = this.fontSize + 'px';
    this.icon.style.color = this.fontColor;
    this.icon.style.zIndex = this.zIndex;

    document.body.appendChild(this.icon);


    this.icon.addEventListener('click', () => { 
        this.app.fire("custom:buttonClick"); 
    });

    this.icon.addEventListener('touchstart', () => {
        this.app.fire("custom:buttonClick");
    });
};

FontAwesomeLoader.prototype.show = function () {
    if (this.icon) this.icon.style.display = 'block';
};

FontAwesomeLoader.prototype.hide = function () {
    if (this.icon) this.icon.style.display = 'none';
};

FontAwesomeLoader.prototype.setColor = function (newColor) {
    if (this.icon) {
        this.icon.style.color = newColor;
    }
};



// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// FontAwesomeLoader.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/