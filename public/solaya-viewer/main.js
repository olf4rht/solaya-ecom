//import * as pc from '/playcanvas-stable.min.js';
import device from './device-loader.js';
console.log('device loaded:', device);

window.pc = pc;

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('application'));
window.focus();

// const gfxOptions = {
//     deviceTypes: [`WebGPU`, `webgl2`, `webgl1`],

//     // disable antialiasing as gaussian splats do not benefit from it and it's expensive
//     antialias: false
// };


//const device = await pc.createGraphicsDevice(canvas, gfxOptions);
//const device = createGrDevice(canvas, gfxOptions);
device.maxPixelRatio = Math.min(window.devicePixelRatio, 2);

const createOptions = new pc.AppOptions();
createOptions.graphicsDevice = device;
createOptions.mouse = new pc.Mouse(document.body);
createOptions.touch = new pc.TouchDevice(document.body);
createOptions.keyboard = new pc.Keyboard(document.body);
createOptions.elementInput = new pc.ElementInput(document.body);

createOptions.componentSystems = [
    pc.RenderComponentSystem,
    pc.CameraComponentSystem,
    pc.LightComponentSystem,
    pc.ScriptComponentSystem,
    pc.GSplatComponentSystem,
    pc.ScreenComponentSystem,
    pc.ButtonComponentSystem,
    pc.ElementComponentSystem
];
createOptions.resourceHandlers = [pc.TextureHandler, pc.ContainerHandler, pc.ScriptHandler, pc.GSplatHandler, pc.FontHandler, pc.RenderHandler, pc.SceneHandler];

const app = new pc.AppBase(canvas);
app.init(createOptions);

// Set the canvas to fill the window and automatically change resolution to be the same as the canvas size
app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);


// Ensure canvas is resized when window changes size
const resize = () => app.resizeCanvas();
window.addEventListener('resize', resize);
app.on('destroy', () => {
    window.removeEventListener('resize', resize);
});


const assets = {
    orbit: new pc.Asset('camera orbit', 'script', { url: `assets/scripts/orbit-camera.js` }),
    touch: new pc.Asset('touch input', 'script', { url: `assets/scripts/touch-input.js` }),
    keyboard: new pc.Asset('keyboard input', 'script', { url: `assets/scripts/keyboard-input.js` }),
    mouse: new pc.Asset('mouse input', 'script', { url: `assets/scripts/mouse-input.js` }),
    bgcolor: new pc.Asset('set color bg', 'script', { url: `assets/scripts/set-color.js` }),
    splatgs: new pc.Asset('load gs', 'script', { url: `assets/scripts/gs-load.js` }),
    shadowgs: new pc.Asset('load shadow gs', 'script', { url: `assets/scripts/AddShadow.js` }),
    buttonlogic: new pc.Asset('play button logic', 'script', { url: `assets/scripts/button-logic.js` }),
    fontloader: new pc.Asset('load font', 'script', { url: `assets/scripts/fontAwesomeLoader.js` }),
    filesize: new pc.Asset('get file size', 'script', { url: `assets/scripts/FileSizeChecker.js` }),
    fonttext: new pc.Asset('text font', 'font', { url: `assets/fonts/Inter-Medium.json` }),
    progress: new pc.Asset('progress bar ', 'script', { url: `assets/scripts/progress-bar.js` }),
    preview: new pc.Asset('preview image', 'script', {url: `assets/scripts/load-external-back-image.js`})
};

const assetListLoader = new pc.AssetListLoader(Object.values(assets), app.assets);
assetListLoader.load(() => {
    app.start();
    // create a camera
    const camera = new pc.Entity('Camera');
    const loadingPageColor =new pc.Color(0.58, 0.6, 0.61, 1)
    camera.addComponent('camera', {
        clearColorBuffer: true,
        clearDepthBuffer: true,
        clearColor: loadingPageColor,
    });
    camera.setPosition(0, 0.1, 4.22);
    camera.addComponent('script');
    camera.script.create('orbitCamera', {
        attributes: {
            distanceMax: 10,
            distanceMin: 3,
            full: true,
            inertiaFactor: 0.2,
            frameOnStart: true
        }
    });
    camera.script.create('touchInput');
    camera.script.create('mouseInput');
    camera.script.create('keyboardInput');
    camera.script.create('setColor');
    const setColorScript = camera.script.setColor;
    setColorScript.enabled = false;

    app.root.addChild(camera);

    // create a light
    const light = new pc.Entity('Light');
    light.addComponent('light',{
    type: 'directional',
    color: new pc.Color(1, 1, 1),
    intensity: 1
    });
    light.setEulerAngles(45, 45, 0);
    app.root.addChild(light);

    // load gs
    const params = new URLSearchParams(document.location.search);
    const enabled = params.get("autoLoad") || "false";
    const falseValues = ["false", "0", "no", "off", ""];

    const autoLoadEnabled = !falseValues.includes(enabled.toLowerCase());
    console.log("autoLoadEnabled", autoLoadEnabled);

    const gsEntity = new pc.Entity("GaussianSplatting");
    gsEntity.enabled = autoLoadEnabled;
    gsEntity.addComponent('script');

    app.root.addChild(gsEntity)

    const shadowEntity = new pc.Entity("Shadow");
    shadowEntity.addComponent('script');
    shadowEntity.enabled = false;
    gsEntity.addChild(shadowEntity);
    
    const screenEntity = new pc.Entity("2D Screen");
    screenEntity.addComponent('screen', {
        screenSpace: true, //2D screen
        referenceResolution: new pc.Vec2(1280, 720),
        scaleMode: pc.SCALEMODE_BLEND,
        scaleBlend: 0.5
    });
    app.root.addChild(screenEntity);

    // play button
    const playBottonEntity = new pc.Entity("PlayButton");
    playBottonEntity.enabled = !autoLoadEnabled;

    playBottonEntity.addComponent('element', {
        type: pc.ELEMENTTYPE_IMAGE,
        anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
        pivot: new pc.Vec2(0.5, 0.5),
        color: loadingPageColor,   
        width: 36,
        height: 36,
        useInput: true

    });

    playBottonEntity.addComponent('button', {
        imageEntity: playBottonEntity,
        transitionMode: pc.BUTTON_TRANSITION_MODE_TINT,
        hoverTint: new pc.Color(1,1,1,0),
        pressedTint: new pc.Color(1,1,1,0),
        inactiveTint: new pc.Color(1,1,1,0),
    });

    playBottonEntity.addComponent('script');

    //playBottonEntity.button.imageEntity = playBottonEntity;
    screenEntity.addChild(playBottonEntity);

    //file size text
    const fileSizeEntity = new pc.Entity("GetFileSize");
    fileSizeEntity.addComponent('element', {
        anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
        fontAsset: assets.fonttext,
        fontSize: 16,
        pivot: new pc.Vec2(0.5, 0.5),    
        type: pc.ELEMENTTYPE_TEXT

    });
    fileSizeEntity.setPosition(0,-300,0)
    fileSizeEntity.addComponent('script');

    screenEntity.addChild(fileSizeEntity);
    if (gsEntity.enabled){
        fileSizeEntity.enabled = false;
    }

    //PreviewImage
    const previewImageEntity = new pc.Entity("3DPreviewImage");
    previewImageEntity.addComponent('element', {
        type: pc.ELEMENTTYPE_IMAGE,
        anchor: new pc.Vec4(0, 0, 1, 1),
        pivot: new pc.Vec2(0.5, 0.5),
        color: loadingPageColor,
        opacity: 0.5,
        hight: 100,
        width: 100,
        fitMode: pc.FITTING_COVER

    });
    
    previewImageEntity.addComponent('script');

    screenEntity.addChild(previewImageEntity);

    //Progress bar
    const progressBarEntity = new pc.Entity("ProgressBar");
    progressBarEntity.addComponent('element', {
        type: pc.ELEMENTTYPE_IMAGE,
        anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
        pivot: new pc.Vec2(0.5, 0.5),
        color: new pc.Color(0.99, 0.99, 0.98, 1),   
        width: 270,
        height: 3
    });

    const fillProgressEntity = new pc.Entity("FillProgress");
    fillProgressEntity.addComponent('element', {
        type: pc.ELEMENTTYPE_IMAGE,
        anchor: new pc.Vec4(0, 0.5, 0, 0.5),
        pivot: new pc.Vec2(0, 0.5),
        color: new pc.Color(0.2, 0.6, 1, 1),   
        width: 270,
        height: 3
    });
    progressBarEntity.addChild(fillProgressEntity);

    progressBarEntity.addComponent('script');

    progressBarEntity.enabled = false;
    screenEntity.addChild(progressBarEntity);

    //this.app.fire("entities:created");

    progressBarEntity.script.create('progressBar', {
        attributes:{
            progressImage: fillProgressEntity
        }
    });
    
    gsEntity.script.create('GsLoad');
    shadowEntity.script.create('addShadow');

    playBottonEntity.script.create('buttonLogic');
    playBottonEntity.script.create('fontAwesomeLoader', {
        attributes: {
            fontCode: "fa-regular fa-circle-play",
            fontSize: 30
        }
    });
    fileSizeEntity.script.create('fileSizeChecker');
    previewImageEntity.script.create('loadExternalBackImage', {
        attributes: {
            imageEntity: previewImageEntity,
        }
    });
});
