var GsLoad = pc.createScript("GsLoad");

GsLoad.attributes.add("splatUrl", { type: "string", default: "", title: "Gaussian Splat URL" });
GsLoad.attributes.add("initialViewAngle" , { type: "number", default: 0, title: "Initial Angle view (degrees)"});

GsLoad.prototype.initialize = function () {
    this.on('update', this.update, this);
    this.updateActive = false; 
    this.app.loader.getHandler("texture").crossOrigin = "anonymous";
    this.app.loader.getHandler("gsplat").crossOrigin = "anonymous";

    //get "splatUrl" parameter from the URL
    const urlParam = new URL(document.location).searchParams.get("splatUrl");
    const initialAngleParam = new URL(document.location).searchParams.get("initialAngle")

    //use the URL parameter if available, otherwise use the attribute value
    this.splatUrl = urlParam || this.splatUrl;
    this.initialViewAngle = initialAngleParam !== null ? parseFloat(initialAngleParam) : this.initialViewAngle;

    if (this.splatUrl) {
        //console.log("Loading Gaussian Splat from URL:", this.splatUrl);
        this.showLoadingScreen();
        this.loadSplat(this.splatUrl);
    } else {
        console.error("No Gaussian Splat URL provided!");
    }
};

GsLoad.prototype.showLoadingScreen = function () {
    //this.loadingText = this.app.root.findByName("LoadingText");
    //this.loadingLogo = this.app.root.findByName("LoadingLogo");
    //this.loadingPage = this.app.root.findByName("LoadingPage");
    //this.loadingPage.script.htmlOverlay.show();
    //if (!this.loadingPage) console.warn("Missing: loadingPage");
    //this.solayaLink = this.app.root.findByName("SolayaLink");
    //this.solayaText = this.app.root.findByName("VisitSolayaText");
    this.progressBar = this.app.root.findByName("ProgressBar");
    this.previewImage = this.app.root.findByName("3DPreviewImage");
    //this.fullScreen = this.app.root.findByName("button");
    this.shadow = this.app.root.findByName("Shadow");
    this.bgcolor = this.app.root.findScript("setColor")

    //this.loadingText.enabled = true;
    //this.loadingLogo.enabled = true;
    //this.loadingPage.enabled = true;
    //this.solayaLink.enabled = true;
    //this.solayaText.enabled = true;
    this.progressBar.enabled = true;
    this.previewImage.enabled = true;
    //this.fullScreen.enabled = false;
    this.shadow.enabled=false;
    this.bgcolor.enabled=false;
};

GsLoad.prototype.hideLoadingScreen = function () {
    //this.loadingText.enabled = false;
    //this.loadingLogo.enabled = false;
    //this.loadingPage.enabled = false;
    //this.loadingPage.script.htmlOverlay.hide();
    //this.solayaLink.enabled = false;
    //this.solayaText.enabled = false;
    this.progressBar.enabled = false;
    this.previewImage.enabled = false;
    //this.fullScreen.enabled = true;
    this.shadow.enabled=true;
    this.bgcolor.enabled=true;

    const bgColor = this.bgcolor.color || "#F2F2F2";  // fallback color
    
    const event = new CustomEvent('viewerBackgroundChanged', {
        detail: { backgroundColor: bgColor }
    });
    window.dispatchEvent(event);



    document.body.style.cursor = "default";
    this.updateActive = true; // Enable update() after loading screen is hidden
};

GsLoad.prototype.loadSplat = async function (gsUrl) {
    var entity = this.entity;
    entity.addComponent("gsplat");

    //fetch Gaussian Splat
    try {
        const gsResponse = await fetch(gsUrl);
        const gsReader = gsResponse.body.getReader();
        let receivedLength = 0;
        let chunks = [];

        //fetching shadow URL if available
        let shadowSize = 0;
        let shadowResponse = null;
        let shadowReader = null;
        let shadowChunks = [];

        const urlShadow = new URL(document.location).searchParams.get("shadowUrl");
        this.shadowUrl = urlShadow || this.shadow.script.addShadow.shadowUrl;

        if (this.shadowUrl) {
            try {
                shadowResponse = await fetch(this.shadowUrl);
                shadowReader = shadowResponse.body.getReader();
                shadowSize = parseInt(shadowResponse.headers.get("Content-Length") || "0");
                console.log("shadow size", shadowSize)
            } catch (err) {
                console.warn("Failed to load shadow:", err);
            }
        }

        //calculate total size (GS + Shadow, if available)
        let totalSize = parseInt(gsResponse.headers.get("Content-Length") || "0") + shadowSize;
        console.log("total size ", totalSize)

        //read GS in chunks
        while (true) {
            const { done, value } = await gsReader.read();
            if (done) break;

            chunks.push(value);
            receivedLength += value.length;

            // Update progress bar
            let progress = receivedLength / totalSize;
            this.progressBar.script.progressBar.setProgress(progress);
        }

        // Read shadow in chunks (if exists)
        if (shadowReader) {
            console.log("shadow reader")
            let shadowReceived = 0;
            while (true) {
                const { done, value } = await shadowReader.read();
                if (done) break;

                shadowChunks.push(value);
                shadowReceived += value.length;

                // Update progress bar
                let progress = (receivedLength + shadowReceived) / totalSize;
                this.progressBar.script.progressBar.setProgress(progress);
            }
        }

        // Merge GS chunks
        let gsFullArray = new Uint8Array(receivedLength);
        let position = 0;
        for (let chunk of chunks) {
            gsFullArray.set(chunk, position);
            position += chunk.length;
        }

        // let gsBlob = new Blob([gsFullArray], { type: "application/octet-stream" });
        // let gsBlobUrl = URL.createObjectURL(gsBlob);

        //load GS asset
        this.app.assets.loadFromUrl(this.splatUrl, "gsplat", (err, asset) => {
            if (err) {
                console.error("Failed to load GS:", err);
                return;
            }
            entity.gsplat.asset = asset;
            this.centerGSplat(entity);
        });

        // Merge shadow chunks (if exists)
        if (shadowChunks.length > 0) {
            let shadowFullArray = new Uint8Array(shadowSize);
            let shadowPosition = 0;
            for (let chunk of shadowChunks) {
                shadowFullArray.set(chunk, shadowPosition);
                shadowPosition += chunk.length;
            }

            // let shadowBlob = new Blob([shadowFullArray], { type: "application/octet-stream" });
            // let shadowBlobUrl = URL.createObjectURL(shadowBlob);

            let shadowEntity = this.shadow;
            this.app.assets.loadFromUrl(this.shadowUrl, "gsplat", (err, shadowAsset) => {
                if (err) {
                    console.error("Failed to load shadow:", err);
                    return;
                }
                shadowEntity.gsplat.asset = shadowAsset;
            });
        }

        this.hideLoadingScreen(); // Hide loading screen when loading is done

    } catch (error) {
        console.error("Error loading Gaussian Splat:", error);
    }
};




GsLoad.prototype.centerGSplat = function (entity) {
    // Ensure GS model is properly loaded
    const gsplatComponent = entity.gsplat;
    if (!gsplatComponent || !gsplatComponent.instance || !gsplatComponent.instance.meshInstance) {
        console.warn("Gaussian Splat component is not fully initialized.");
        return;
    }

    // Get the bounding box (AABB)
    const bbox = gsplatComponent.instance.meshInstance.aabb;
    if (!bbox) {
        console.warn("Bounding box not found for Gaussian Splat.");
        return;
    }

    // Compute the center of the bounding box
    const center = bbox.center.clone();

    // Offset the entity position to center it at (0,0,0)
    entity.setLocalPosition(entity.getLocalPosition().sub(center));

    // Compute the full dimensions along x, y, z
    const fullX = bbox.halfExtents.x * 2;
    const fullY = bbox.halfExtents.y * 2;
    const fullZ = bbox.halfExtents.z * 2;
    
    const canvasWidth = this.app.graphicsDevice.canvas.width;
    const canvasHeight = this.app.graphicsDevice.canvas.height;

    console.log("Canvas size:", canvasWidth, canvasHeight);
    
    // set initial rotation
    entity.setLocalEulerAngles(180, this.initialViewAngle, 0);
    // Scale the entity depending on the max dimension
    const projection = fullX * Math.abs(Math.cos(this.initialViewAngle*Math.PI/180)) + fullZ * Math.abs(Math.sin(this.initialViewAngle*Math.PI/180));
    if (projection >= fullY) {
        // If max dimension is along the X-axis, scale X to 3
        const scaleFactorX = 3 / projection;//3
        entity.setLocalScale(scaleFactorX, scaleFactorX, scaleFactorX);
    } else {
        // If max dimension is along the Y-axis, scale Y to 2
        const scaleFactorY = 2 / fullY;
        entity.setLocalScale(scaleFactorY, scaleFactorY, scaleFactorY);
    } 

    // Focus orbit camera on the centered model (sets pivot + distance from bounding box)
    var camera = this.app.root.findByName("Camera");
    if (camera && camera.script && camera.script.orbitCamera) {
        var orbitCam = camera.script.orbitCamera;
        orbitCam.focus(entity);
        // Slight downward pitch
        orbitCam.pitch = -3.6;
        orbitCam._removeInertia();
        orbitCam._updatePosition();
    }
};

GsLoad.prototype.update = function (dt) {
    if (!this.updateActive) return; // Skip update() if loading is not finished

    this.display();
};

GsLoad.prototype.display = function() {
    let camera = this.app.root.findByName("Camera");

    if (camera && camera.script && camera.script.orbitCamera) {
        let pitch = camera.script.orbitCamera._pitch; // Get pitch angle directly

        //console.log("Camera Pitch Angle:", pitch); // Debugging output

        if (pitch > 0) { // Check if vertical angle (phi) is less than 0
            this.shadow.enabled = false;
        } else {
            this.shadow.enabled = true;
        }
    } else {
        console.warn("Camera or OrbitCamera script not found!");
    }
};




// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// GsLoad.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/