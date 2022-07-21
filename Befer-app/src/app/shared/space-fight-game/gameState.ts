export const initState = {
    level: 6,
    points: 0,
    openMenu: false,
    isPaused: false,
    hasBonuses: false,
    gameOver: false,
    isBossMode: false,
}

export const state: any = {
    level: initState.level,
    levelsRange: {
        2: 2000,
        3: 4000,
        4: 7000,
        5: 10000,
        6: 14000,
        7: 2000,
    },
    points: initState.points,
    openMenu: initState.openMenu,
    isPaused: initState.isPaused,
    hasBonuses: initState.hasBonuses,
    gameOver: initState.gameOver,
    isBossMode: false,
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