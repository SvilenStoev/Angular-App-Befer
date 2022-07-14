export const state = {
    keys: {
        'KeyW': false,
        'KeyS': false,
        'KeyD': false,
        'KeyA': false,
        'ArrowUp': false,
        'ArrowLeft': false,
        'ArrowDown': false,
        'ArrowRight': false,
        'Space': false
    },
};

export const spaceship = {
    x: -180,
    y: 300,
    speed: 5,
    entered: false
};

export const availableKeys = [
    'KeyW',
    'KeyS',
    'KeyD',
    'KeyA',
    'ArrowUp',
    'ArrowLeft',
    'ArrowDown',
    'ArrowRight',
    'Space'
]