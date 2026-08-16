var FileSizeChecker = pc.createScript('fileSizeChecker');

FileSizeChecker.prototype.initialize = function () {
    let splatObject = this.app.root.findByName("GaussianSplatting");
    let shadowObject = this.app.root.findByName("Shadow");

    if (!splatObject) {
        console.error("GaussianSplatting entity not found!");
        return;
    }

    gaussurl = new URL(document.location).searchParams.get("splatUrl");
    shadowurl = new URL(document.location).searchParams.get("shadowUrl");

    let url = gaussurl || splatObject.script.testS3.splatUrl;
    let surl = shadowurl || shadowObject.script.addShadow.shadowUrl ;

    let promises = [this.getFileSize(url)];

    if (surl) {
        promises.push(this.getFileSize(surl));
    }

    //Fetch the sizes, handling cases where shadow URL is missing
    Promise.all(promises)
        .then(sizes => {
            let totalSize = sizes.reduce((sum, size) => sum + size, 0).toFixed(2);
            let fileSizeText = `${totalSize} MB`;
            console.log(fileSizeText);
            this.entity.element.text = fileSizeText;
        })
        .catch(error => console.error("Failed to get file sizes:", error));
};

FileSizeChecker.prototype.getFileSize = async function (url) {
    try {
        let response = await fetch(url, { method: "HEAD" });
        let sizeInBytes = response.headers.get("content-length");

        if (sizeInBytes) {
            return parseInt(sizeInBytes, 10) / (1024 * 1024); // Convert bytes to MB
        } else {
            throw new Error("Content-Length header missing");
        }
    } catch (error) {
        console.error("Error fetching file size:", error);
        throw error;
    }
};



// uncomment the swap method to enable hot-reloading for this script
// update the method body to copy state from the old instance
// FileSizeChecker.prototype.swap = function(old) { };

// learn more about scripting here:
// https://developer.playcanvas.com/user-manual/scripting/