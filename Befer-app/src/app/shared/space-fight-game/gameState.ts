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
    hasBonuses: false,
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