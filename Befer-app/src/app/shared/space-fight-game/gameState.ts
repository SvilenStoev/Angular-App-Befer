export const state = {
    level: 1,
    levelsRange: {
        2: 3500,
        3: 8000,
        4: 14000,
        5: 17000,
        6: 20000,
        7: 24000,
    },
    points: 0,
    isPaused: false,
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