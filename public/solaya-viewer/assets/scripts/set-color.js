var SetColor = pc.createScript('setColor');

// Declare the color attribute with a default value
SetColor.attributes.add("color", { type: "string", default: "#FCFBFB", title: "BG color" });

// initialize code called once per entity
SetColor.prototype.initialize = function() {
    // Get the "color" parameter from the URL (e.g., ?color=#ff0000)
    const ColorUrl = new URL(document.location).searchParams.get("color");

    // If a color is found in the URL, use it, otherwise fall back to the default value from the attribute
    this.color = ColorUrl || this.color;

    // Ensure color is a valid hex string, and apply it to pc.Color
    if (this._isValidHexColor(this.color)) {
        this.entity.camera.clearColor.fromString(this.color);
        console.log("Color applied:", this.entity.camera.clearColor);
    } else {
        console.error("Invalid color format:", this.color);
    }
};

// Helper function to check if the color is a valid hex value
SetColor.prototype._isValidHexColor = function(color) {
    return /^#([0-9A-Fa-f]{3}){1,2}$/.test(color);
};


// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// SetColor.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/