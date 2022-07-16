export const spaceshipUrl = '../../../../assets/images/spaceship.png';
export const alienUrl = '../../../../assets/images/alien.png';
export const bombUrl = '../../../../assets/images/bomb.png';

export const state = {
    level: 1,
    levelsRange: {
        2: 5000,
        3: 10000,
        4: 20000,
        5: 50000,
    },
    points: 0,
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
    speed: 7,
    width: 149,
    height: 86,
    entered: false
};

export const alien = {
    x: -100,
    width: 77,
    height: 53,
    speed: 2,
    nextCreation: 0,
    creationInterval: 2500,
    pointsToKill: 500,
}

export const bomb = {
    width: 73,
    height: 25,
    speed: 14,
    fireInterval: 500,
    nextFire: 0,
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