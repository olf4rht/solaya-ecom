var LoadExternalBackImage = pc.createScript('loadExternalBackImage');

LoadExternalBackImage.attributes.add("previewImgUrl", { type: "string" });
LoadExternalBackImage.attributes.add("imageEntity", { type: "entity" });

LoadExternalBackImage.prototype.initialize = function() {
    var self = this;


    const urlParam = new URL(document.location).searchParams.get("previewImgUrl");
    console.log("url param: ", urlParam);
    const finalImageUrl = urlParam || this.previewImgUrl;

    if (!finalImageUrl || finalImageUrl.trim() === "") {
        if (self.imageEntity && self.imageEntity.element) {
            self.imageEntity.element.opacity = 0; // Hide image if no URL
        }
        console.log("No image URL provided. Skipping image load.");
        return; }

    this.app.loader.getHandler("texture").crossOrigin = "anonymous";

    var asset = new pc.Asset("ExternalImage", "texture", { url: finalImageUrl });

    this.app.assets.add(asset);

    asset.on("error", function (message) {
        console.log("Error loading image:", message);
    });


    asset.on("load", function (asset) {
        if (self.imageEntity && self.imageEntity.element) {
            let texture = asset.resource;
            self.imageEntity.element.texture = texture;
            self.imageEntity.element.fitMode=pc.FITMODE_COVER;
            console.log("cover mode applied")
            // let originalWidth = texture.width;
            // let originalHeight = texture.height;

            // //Set hight to 720 and calculate proportional width
            // let newHeight = 720;
            // let newWidth = (originalWidth / originalHeight) * newHeight;

            // self.imageEntity.element.texture = texture;
            // self.imageEntity.element.width = newWidth;
            // self.imageEntity.element.height = newHeight;
            // console.log("New width:", newWidth);
        }
    });

    this.app.assets.load(asset);
};


// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// LoadExternalBackImage.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/