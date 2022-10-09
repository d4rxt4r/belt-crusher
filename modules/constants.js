const DEBUG = true;

const WIDTH = 400;
const HEIGHT = 700;

const BG_IMG = 'img/bg.png';
const BELT_IMG = 'img/belt.png';
const GROUND_LABEL = {
    STAGE: 'STAGE_GROUND',
    SENSOR: 'GROUND_SENSOR'
};

const TUBE = {
    TOP: 'img/tube.png',
    MIDDLE: 'img/tube2.png',
    BOTTOM: 'img/tube3.png'
};

const FILTER = {
    DEFAULT: 10,
    HEAD: 30,
    OTHER: 20
};

const HEAD = {
    SIZE: 80,
    LABEL: 'HEAD',
    IMG: 'img/head3.png',
    ROTATION_SPEED: 0.01
};

const PARTICLE = {
    SIZE: 20,
    LABEL: 'PARTICLE'
};

const PARTICLE_IMG = [
    'img/particles/weed_pack.png',
    'img/particles/salt.png',
    'img/particles/lsd.png',
    'img/particles/beer.png'
];

const counter = document.getElementById('counter');

export { DEBUG, WIDTH, HEIGHT, GROUND_LABEL, FILTER, HEAD, PARTICLE, BELT_IMG, PARTICLE_IMG, TUBE, BG_IMG, counter };
