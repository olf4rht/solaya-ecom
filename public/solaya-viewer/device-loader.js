const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('application'));
window.focus();

const gfxOptions = {
    deviceTypes: [`WebGPU`, `webgl2`, `webgl1`],

    // disable antialiasing as gaussian splats do not benefit from it and it's expensive
    antialias: false
};


const devicePromise = window.pc.createGraphicsDevice(canvas, gfxOptions);

export const device = await devicePromise;  // Top-level await in module
export default device;

export async function createDevice(options = gfxOptions) {
    return window.pc.createGraphicsDevice(canvas, options);
}