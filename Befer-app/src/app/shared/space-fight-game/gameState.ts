export const gameState = {
    userScores: {
        aliensKilled: 0,
        aliensMissed: 0,
        timeRemaining: 0,
        boostRemaining: 0,
        points: 0,
        totalPoints: 0,
        healthRemaining: 0
    },
    state: {
        level: 1,
        levelsRange: {
            2: 3000,
            3: 7000,
            4: 12000,
            5: 18000,
            6: 25000,
            7: 33000,
        },
        points: 0,
        openMenu: false,
        isPaused: false,
        hasBonuses: false,
        gameOver: false,
        gameWon: false,
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
            'Space': false,
            'NumpadEnter': false
        },
    } as any,
    availableKeys: [
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
        'Space',
        'NumpadEnter'

    ]
}
