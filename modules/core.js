import * as $ from './constants.js';
import * as helpers from './helpers.js';

const Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Events = Matter.Events,
    Render = Matter.Render,
    Engine = Matter.Engine,
    Vector = Matter.Vector,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Common = Matter.Common;

/**
 * inits the game
 */
const init = () => {
    const engine = Engine.create();

    const render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: $.WIDTH,
            height: $.HEIGHT,
            wireframes: false,
            showAngleIndicator: $.DEBUG
        }
    });

    const background = Bodies.rectangle(0, 0, $.WIDTH * 2, $.HEIGHT * 2, {
        isStatic: true,
        isSensor: true,
        render: {
            fillStyle: '#C8B7A6',
            sprite: {
                texture: $.BG_IMG,
                xScale: 0.8,
                yScale: 1,
                xOffset: -0.2,
                yOffset: -0.4
            }
        }
    });

    Composite.add(engine.world, [background]);

    const floor = createFloor(engine);
    initHeadsFlow(engine);

    return { engine, render, floor };
};

/**
 * inits mouse click event
 * @param {*} engine
 * @param {*} render
 * @param {*} callback
 */
const initMouseEvents = (engine, render, callback) => {
    const mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    Events.on(mouseConstraint, 'mousedown', function (event) {
        callback(event);
    });
};

/**
 * adds crusher to scene
 * @param {*} engine
 * @returns
 */
const initCrusher = (engine) => {
    const crusherHead = Bodies.rectangle($.WIDTH / 2, 350, 150, 20, {
        label: 'CRUSHER_HEAD',
        isSensor: true,
        render: {
            sprite: {
                texture: $.TUBE.BOTTOM,
                xScale: 0.8,
                yScale: 0.35,
                yOffset: 0.03
            }
        }
    });

    const crusher = Body.create({
        isStatic: true,
        collisionFilter: {
            mask: $.FILTER.DEFAULT
        },
        parts: [
            Bodies.rectangle($.WIDTH / 2, 50, 50, 600, {
                render: {
                    sprite: {
                        texture: $.TUBE.MIDDLE,
                        xScale: 0.5,
                        yScale: 0.5,
                        yOffset: -0.05
                    }
                }
            }),
            crusherHead
        ]
    });

    Composite.add(engine.world, [
        crusher,
        Bodies.rectangle($.WIDTH / 2, 100, 110, 300, {
            isStatic: true,
            render: {
                sprite: {
                    texture: $.TUBE.TOP,
                    xScale: 0.6,
                    yScale: 1
                }
            }
        })
    ]);

    Events.on(engine, 'collisionActive', (event) => {
        const pairs = event.pairs;

        for (let i = 0, j = pairs.length; i != j; ++i) {
            const pair = pairs[i];
            const head = helpers.returnBodyIfCollides(crusherHead, pair, [$.HEAD.LABEL]);

            if (head) {
                headExplosion(engine, head);
                Composite.remove(engine.world, head);

                $.counter.innerHTML = +$.counter.innerHTML + 1;
            }
        }
    });

    return crusher;
};

const headExplosion = (engine, head) => {
    const { x: headX, y: headY } = head.position;
    const particles = [];
    Composites.stack(headX, headY, 2, 2, 10, 10, (x, y) => {
        const particle = Bodies.rectangle(x, y, $.PARTICLE.SIZE, $.PARTICLE.SIZE * 1.5, {
            label: $.PARTICLE.LABEL,
            mass: 20,
            collisionFilter: {
                category: $.FILTER.OTHER
            },
            render: {
                sprite: {
                    texture: Common.choose($.PARTICLE_IMG)
                }
            }
        });

        Body.applyForce(
            particle,
            particle.position,
            Vector.create(((Math.random() * 2) | 0 || -1) * Math.random() * 0.7, -Math.random() * 0.7)
        );

        particles.push(particle);
    });

    Composite.add(engine.world, particles);
};

/**
 * inits heads spawn on the belt
 * @param {*} engine
 */
const initHeadsFlow = (engine) => {
    let flowTimer = setTimeout(function spawn() {
        const head = Bodies.circle(-$.HEAD.SIZE, 520, $.HEAD.SIZE, {
            label: $.HEAD.LABEL,
            collisionFilter: {
                category: $.FILTER.HEAD
            },
            render: {
                fillStyle: 'red',
                sprite: {
                    texture: $.HEAD.IMG,
                    xScale: 0.4,
                    yScale: 0.4
                }
            }
        });
        Composite.add(engine.world, [head]);

        flowTimer = setTimeout(spawn, 3000);
    });
};

/**
 * adds simple stage ground
 * @param {*} engine
 */
const createFloor = (engine) => {
    const groundSensor = Bodies.rectangle($.WIDTH / 2, $.HEIGHT - 100, $.WIDTH * 5, 10, {
        isSensor: true,
        isStatic: true,
        label: $.GROUND_LABEL.SENSOR,
        render: {
            fillStyle: 'transparent',
            lineWidth: $.DEBUG ? 1 : 0
        }
    });

    const ground = Bodies.rectangle($.WIDTH / 2, $.HEIGHT, $.WIDTH * 5, 200, {
        isStatic: true,
        label: $.GROUND_LABEL.STAGE,
        render: {
            lineWidth: 1,
            fillStyle: '#353b39',
            sprite: {
                texture: $.BELT_IMG,
                xScale: 1,
                yScale: 1,
                yOffset: 0.45
            }
        }
    });

    Composite.add(engine.world, [ground, groundSensor]);

    Events.on(engine, 'collisionActive', (event) => {
        const pairs = event.pairs;

        for (let i = 0, j = pairs.length; i != j; ++i) {
            const pair = pairs[i];
            const body = helpers.returnBodyIfCollides(groundSensor, pair, [$.HEAD.LABEL, $.PARTICLE.LABEL]);

            if (body) {
                if (body.label === $.HEAD.LABEL) {
                    if (body.position.x >= $.WIDTH + $.HEAD.SIZE) {
                        Composite.remove(engine.world, body);
                    }

                    Body.rotate(body, $.HEAD.ROTATION_SPEED);
                }

                if (body.label === $.PARTICLE.LABEL) {
                    if (body.position.x >= $.WIDTH + $.PARTICLE.SIZE) {
                        Composite.remove(engine.world, body);
                    }
                }

                Body.setVelocity(body, Vector.create(1 * body.mass * 0.1, 0));
            }
        }
    });

    return ground;
};

export { init, initMouseEvents, initCrusher };
