export const userScores = {
    aliensKilled: 0,
    timeRemaining: 0,
    boostRemaining: 0,
    points: 0,
    totalPoints: 0,
}

export const initState = {
    level: 1,
    points: 0,
    openMenu: false,
    isPaused: false,
    hasBonuses: false,
    gameOver: false,
    gameWon: false,
    isBossMode: false,
}

export const state: any = {
    level: initState.level,
    levelsRange: {
        2: 2000,
        3: 5000,
        4: 9000,
        5: 14000,
        6: 20000,
        7: 25000,
    },
    points: initState.points,
    openMenu: initState.openMenu,
    isPaused: initState.isPaused,
    hasBonuses: initState.hasBonuses,
    gameOver: initState.gameOver,
    isBossMode: initState.isBossMode,
    gameWon: initState.gameWon,
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