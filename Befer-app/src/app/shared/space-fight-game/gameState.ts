export const state = {
    level: 1,
    levelsRange: {
        2: 2000,
        3: 4000,
        4: 7000,
        5: 10000,
        6: 14000,
        7: 20000,
    },
    points: 0,
    openMenu: false,
    isPaused: false,
    hasBonuses: false,
    isBossMode: false,
    gameOver: false,
    keys: {
        'KeyW': false,
        'KeyS': false,
        'KeyD': false,
        'KeyA': false,
        'KeyP': false,
        'KeyM': false,
        'ArrowUp': false,
        'ArrowLeft': false,
        'ArrowDown': false,
        'ArrowRight': false,
        'ShiftLeft': false,
        'Space': false
    },
};

export const availableKeys = [
    'KeyW',
    'KeyS',
    'KeyD',
    'KeyA',
    'KeyP',
    'KeyM',
    'ArrowUp',
    'ArrowLeft',
    'ArrowDown',
    'ArrowRight',
    'ShiftLeft',
    'Space'
]