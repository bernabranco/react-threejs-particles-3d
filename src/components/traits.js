// Generate random numbers from range
function generateRandomFloatInRange(min, max) {
    return (Math.random() * (max - min)) + min;
}

const offset = [
    generateRandomFloatInRange(1.,20000.),
    generateRandomFloatInRange(-1.,1.),
    generateRandomFloatInRange(-1.,1.),
]

const PARTICLE_COUNT = 45000;
const PARTICLE_SIZE = 20;
const HSL_RANDOM = Math.random()*100.;
const STEPS = 1;

const HSL = [
    generateRandomFloatInRange(0.1,100),
    generateRandomFloatInRange(0.8,1.),
    generateRandomFloatInRange(0.05,0.5)
]

export {offset, PARTICLE_COUNT, PARTICLE_SIZE, HSL, HSL_RANDOM,STEPS}