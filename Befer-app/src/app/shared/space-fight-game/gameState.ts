export const spaceshipUrl = '../../../../assets/images/spaceship.png';
export const alienUrl = '../../../../assets/images/alien.png';

export const state = {
    gameOver: false,
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
    width: 149,
    height: 86,
    entered: false
};

export const alien = {
    x: -100,
    width: 77,
    height: 53,
    nextCreation: 0,
    creationInterval: 2500,
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