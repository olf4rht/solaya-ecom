var AddShadow = pc.createScript('addShadow');

AddShadow.attributes.add("shadowUrl", { type: "string", default: "", title: "shadow url" });

// initialize code called once per entity
/*AddShadow.prototype.initialize = function() {
    this.app.loader.getHandler("texture").crossOrigin = "anonymous";
    this.app.loader.getHandler("gsplat").crossOrigin = "anonymous";

    // Get "shadowUrl" parameter from the URL
    const urlParam = new URL(document.location).searchParams.get("shadowUrl");

    // Use the URL parameter if available, otherwise use the attribute value
    this.shadowUrl = urlParam || this.shadowUrl;

    if (this.shadowUrl) {
        console.log("Loading Gaussian shadow from URL:", this.shadowUrl);
        //this.showLoadingScreen();
        //this.loadshadow(this.shadowUrl);
    } 

}*/

/*AddShadow.prototype.loadshadow = async function (url) {
    var entity = this.entity;
    entity.addComponent("gsplat");

    try {
        const response = await fetch(url);
        const reader = response.body.getReader();
        let receivedLength = 0;
        let chunks = [];

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            chunks.push(value);
            receivedLength += value.length;

        }

        // Merge chunks into a single buffer
        let fullArray = new Uint8Array(receivedLength);
        let position = 0;
        for (let chunk of chunks) {
            fullArray.set(chunk, position);
            position += chunk.length;
        }

        // Create blob URL and load the asset
        let blob = new Blob([fullArray], { type: "application/octet-stream" });
        let blobUrl = URL.createObjectURL(blob);

        this.app.assets.loadFromUrl(blobUrl, "gsplat", (err, asset) => {
            if (err) {
                console.error("Failed to load shadow Splat:", err);
                return;
            }
            entity.gsplat.asset = asset;
        });
    } catch (error) {
        console.error("Error loading shadow Splat:", error);
    }
};*/




// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// AddShadow.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/