export const spaceshipUrl = '../../../../assets/images/spaceship.png';
export const alienUrl = '../../../../assets/images/alien.png';

export const state = {
    keys: {
        'KeyW': false,
        'KeyS': false,
        'KeyD': false,
        'KeyA': false,
        'KeyP': false,
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
    speed: 6,
    width: 167,
    height: 97,
    entered: false
};

export const alien = {
    x: 0,
    width: 77,
    height: 62,
    nextCreation: 3000,
    creationInterval: 3000,
    speed: 2
}
export const availableKeys = [
    'KeyW',
    'KeyS',
    'KeyD',
    'KeyA',
    'KeyP',
    'ArrowUp',
    'ArrowLeft',
    'ArrowDown',
    'ArrowRight',
    'Space'
]