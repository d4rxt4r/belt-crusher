import * as $ from './modules/constants.js';
import * as core from './modules/core.js';
import * as helpers from './modules/helpers.js';

const Render = Matter.Render,
    Runner = Matter.Runner,
    Events = Matter.Events,
    Body = Matter.Body;

const { engine, render, floor } = core.init();
const crusher = core.initCrusher(engine);

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

let crusherRunning = false;
core.initMouseEvents(engine, render, () => {
    crusherRunning = true;
});

const speed = 15;
const initPosY = crusher.position.y;
let direction = 1;
let xOffset = 0.85;

/**
 * crusher movement on click event
 */
Events.on(engine, 'beforeUpdate', () => {
    if (crusherRunning) {
        if (direction === 1 && crusher.position.y < $.HEIGHT - initPosY - 300) {
            Body.translate(crusher, { x: 0, y: speed * direction });
        } else {
            direction = -1;
        }

        if (direction === -1 && crusher.position.y > initPosY) {
            Body.translate(crusher, { x: 0, y: speed * direction });
        } else if (crusher.position.y <= initPosY) {
            direction = 1;
            crusherRunning = false;
        }
    }

    xOffset -= 0.001;
    if (xOffset < 0.16) {
        xOffset = 0.85;
    }
    floor.render.sprite.xOffset = xOffset;
});
